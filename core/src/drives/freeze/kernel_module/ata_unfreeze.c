/*
 * ata_unfreeze.c - Loadable kernel module for ATA drive unfreeze
 *
 * This module provides direct ATA port reset to unfreeze drives
 * that are frozen by BIOS or controller firmware.
 *
 * The module performs a soft reset on all SATA ports with drives,
 * which clears the security frozen state in most cases.
 *
 * WARNING: This is a low-level driver that directly manipulates hardware.
 * Use with extreme caution. Incorrect usage can damage drives.
 *
 * Usage:
 *   sudo insmod ata_unfreeze.ko
 *   sudo rmmod ata_unfreeze
 *
 * License: GPL v2
 */

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/fs.h>
#include <linux/device.h>
#include <linux/pci.h>
#include <linux/libata.h>
#include <linux/ata.h>
#include <linux/delay.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Sayonara Wipe Project");
MODULE_DESCRIPTION("ATA Drive Unfreeze Module");
MODULE_VERSION("1.0");

#define DEVICE_NAME "ata_unfreeze"
#define CLASS_NAME  "ata"

static int    majorNumber;
static struct class*  ataUnfreezeClass  = NULL;
static struct device* ataUnfreezeDevice = NULL;

/* ATA Security Commands */
#define ATA_CMD_SECURITY_FREEZE_LOCK    0xF5
#define ATA_CMD_SECURITY_UNLOCK         0xF2
#define ATA_CMD_SECURITY_DISABLE        0xF6

/* ATA Status Register Bits */
#define ATA_STATUS_BSY   0x80  /* Busy */
#define ATA_STATUS_DRDY  0x40  /* Drive Ready */
#define ATA_STATUS_DRQ   0x08  /* Data Request */
#define ATA_STATUS_ERR   0x01  /* Error */

/**
 * wait_for_drive_ready - Wait for drive to be ready
 * @port: ATA port
 * @timeout_ms: Timeout in milliseconds
 *
 * Returns: 0 on success, negative on timeout/error
 */
static int wait_for_drive_ready(struct ata_port *ap, int timeout_ms)
{
    unsigned long timeout = jiffies + msecs_to_jiffies(timeout_ms);
    u8 status;

    do {
        status = ata_sff_check_status(ap);

        /* Check if drive is ready */
        if ((status & ATA_STATUS_BSY) == 0 &&
            (status & ATA_STATUS_DRDY) != 0) {
            return 0;
        }

        /* Check for errors */
        if (status & ATA_STATUS_ERR) {
            pr_err("ata_unfreeze: Drive error detected\n");
            return -EIO;
        }

        msleep(10);

    } while (time_before(jiffies, timeout));

    pr_err("ata_unfreeze: Timeout waiting for drive\n");
    return -ETIMEDOUT;
}

/**
 * attempt_port_reset - Attempt to reset port to unfreeze drives
 * @ap: ATA port
 *
 * This function attempts to clear the frozen state by:
 * 1. Triggering a soft reset on the port
 * 2. Waiting for devices to re-initialize
 *
 * Returns: 0 on success, negative on error
 */
static int attempt_port_reset(struct ata_port *ap)
{
    int ret;
    unsigned int classes;
    struct ata_link *link;

    pr_info("ata_unfreeze: Attempting to reset port\n");

    /* Wait for drive to be ready */
    ret = wait_for_drive_ready(ap, 5000);
    if (ret < 0) {
        pr_warn("ata_unfreeze: Drive not ready, continuing anyway\n");
    }

    /* Get the first link */
    link = &ap->link;

    /* Attempt soft reset - pass pointer to link */
    ret = ata_sff_softreset(link, &classes, 10000);
    if (ret != 0) {
        pr_err("ata_unfreeze: Soft reset failed: %d\n", ret);
        return ret;
    }

    pr_info("ata_unfreeze: Soft reset completed\n");

    /* Wait for devices to stabilize */
    msleep(1000);

    pr_info("ata_unfreeze: Port reset completed\n");
    return 0;
}

/**
 * scan_and_unfreeze_drives - Scan for drives and attempt to unfreeze
 *
 * This function iterates through all ATA hosts/ports and attempts
 * to reset them to clear any frozen states.
 *
 * Returns: Number of ports reset
 */
static int scan_and_unfreeze_drives(void)
{
    struct ata_host *host;
    struct ata_port *ap;
    struct ata_link *link;
    struct ata_device *dev;
    struct pci_dev *pdev = NULL;
    int reset_count = 0;
    int has_devices;

    pr_info("ata_unfreeze: Scanning for ATA drives...\n");

    /* Iterate through PCI devices to find SATA/ATA controllers */
    while ((pdev = pci_get_class(PCI_CLASS_STORAGE_SATA_AHCI << 8, pdev)) != NULL) {
        host = dev_get_drvdata(&pdev->dev);
        if (!host)
            continue;

        pr_info("ata_unfreeze: Found SATA controller: %s\n",
                pci_name(pdev));

        /* Iterate through ports */
        for (int i = 0; i < host->n_ports; i++) {
            ap = host->ports[i];
            if (!ap)
                continue;

            /* Check if port has any enabled devices */
            has_devices = 0;
            ata_for_each_link(link, ap, EDGE) {
                ata_for_each_dev(dev, link, ALL) {
                    if (ata_dev_enabled(dev)) {
                        has_devices = 1;
                        pr_info("ata_unfreeze: Found device: %s\n",
                                dev_name(&dev->tdev));
                        break;
                    }
                }
                if (has_devices)
                    break;
            }

            /* If port has devices, attempt reset to clear frozen state */
            if (has_devices) {
                pr_info("ata_unfreeze: Resetting port %d\n", i);

                if (attempt_port_reset(ap) == 0) {
                    reset_count++;
                    pr_info("ata_unfreeze: Port reset successful\n");
                } else {
                    pr_warn("ata_unfreeze: Port reset failed\n");
                }
            }
        }
    }

    pr_info("ata_unfreeze: Scan complete. Reset %d port(s)\n",
            reset_count);

    return reset_count;
}

/**
 * ata_unfreeze_init - Module initialization
 *
 * Called when the module is loaded. Scans for frozen drives
 * and attempts to unfreeze them.
 */
static int __init ata_unfreeze_init(void)
{
    int result;

    pr_info("ata_unfreeze: Initializing ATA unfreeze module\n");

    /* Register character device (for future ioctl interface) */
    majorNumber = register_chrdev(0, DEVICE_NAME, NULL);
    if (majorNumber < 0) {
        pr_err("ata_unfreeze: Failed to register device\n");
        return majorNumber;
    }

    /* Create device class - API changed in newer kernels */
    ataUnfreezeClass = class_create(CLASS_NAME);
    if (IS_ERR(ataUnfreezeClass)) {
        unregister_chrdev(majorNumber, DEVICE_NAME);
        pr_err("ata_unfreeze: Failed to create device class\n");
        return PTR_ERR(ataUnfreezeClass);
    }

    /* Create device */
    ataUnfreezeDevice = device_create(ataUnfreezeClass, NULL,
                                      MKDEV(majorNumber, 0),
                                      NULL, DEVICE_NAME);
    if (IS_ERR(ataUnfreezeDevice)) {
        class_destroy(ataUnfreezeClass);
        unregister_chrdev(majorNumber, DEVICE_NAME);
        pr_err("ata_unfreeze: Failed to create device\n");
        return PTR_ERR(ataUnfreezeDevice);
    }

    pr_info("ata_unfreeze: Module loaded successfully\n");

    /* Perform unfreeze scan */
    result = scan_and_unfreeze_drives();

    if (result > 0) {
        pr_info("ata_unfreeze: Reset %d port(s) with drives\n", result);
    } else {
        pr_info("ata_unfreeze: No drives found or reset\n");
    }

    return 0;
}

/**
 * ata_unfreeze_exit - Module cleanup
 *
 * Called when the module is unloaded.
 */
static void __exit ata_unfreeze_exit(void)
{
    device_destroy(ataUnfreezeClass, MKDEV(majorNumber, 0));
    class_unregister(ataUnfreezeClass);
    class_destroy(ataUnfreezeClass);
    unregister_chrdev(majorNumber, DEVICE_NAME);

    pr_info("ata_unfreeze: Module unloaded\n");
}

module_init(ata_unfreeze_init);
module_exit(ata_unfreeze_exit);
