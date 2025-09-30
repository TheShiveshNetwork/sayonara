# Makefile for ATA Unfreeze Kernel Module

obj-m += ata_unfreeze.o

# Kernel build directory
KDIR := /lib/modules/$(shell uname -r)/build

# Module build directory
PWD := $(shell pwd)

# Default target
all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

# Clean target
clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean

# Install target
install:
	$(MAKE) -C $(KDIR) M=$(PWD) modules_install
	depmod -a

# Load module
load:
	sudo insmod ata_unfreeze.ko

# Unload module
unload:
	sudo rmmod ata_unfreeze

# Show module info
info:
	modinfo ata_unfreeze.ko

# Test load (load and show dmesg)
test:
	sudo dmesg -C
	sudo insmod ata_unfreeze.ko || true
	sleep 1
	dmesg | grep ata_unfreeze
	sudo rmmod ata_unfreeze || true

.PHONY: all clean install load unload info test
