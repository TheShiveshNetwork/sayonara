"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, Calculator, FileText, AlertCircle, CheckCircle } from 'lucide-react';

// TypeScript interfaces
interface DeviceInfo {
    manufacturer: string;
    model: string;
    serial_number: string;
    interface: string;
    capacity_gb: number;
    manufacture_date: string;
}

interface HealthMetrics {
    smart_status: 'PASSED' | 'WARNING' | 'FAILED';
    health_percentage: number;
    power_on_hours: number;
    power_cycle_count: number;
    reallocated_sectors: number;
    pending_sectors: number;
    temperature_celsius: number;
    read_error_rate: number;
    seek_error_rate: number;
}

interface PerformanceMetrics {
    read_speed_mbps: number;
    write_speed_mbps: number;
    random_read_iops: number;
    random_write_iops: number;
    latency_ms: number;
}

interface PhysicalCondition {
    condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    has_physical_damage: boolean;
    connector_condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    label_condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

interface UsageHistory {
    estimated_age_months: number;
    usage_intensity: 'LIGHT' | 'MODERATE' | 'HEAVY';
    previous_owner_count: number;
}

interface DeviceReport {
    device_info: DeviceInfo;
    health_metrics: HealthMetrics;
    performance_metrics: PerformanceMetrics;
    physical_condition: PhysicalCondition;
    usage_history: UsageHistory;
}

export default function PriceEstimator() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [reportData, setReportData] = useState<DeviceReport | null>(null);
    const [priceEstimate, setPriceEstimate] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Sample report format for download
    const sampleReportFormat: DeviceReport = {
        device_info: {
            manufacturer: "Apple",
            model: "MacBook Air M1",
            serial_number: "MBA-M1-2023-001",
            interface: "NVMe PCIe",
            capacity_gb: 256,
            manufacture_date: "2023-01-15"
        },
        health_metrics: {
            smart_status: "PASSED",
            health_percentage: 88,
            power_on_hours: 2400,
            power_cycle_count: 180,
            reallocated_sectors: 0,
            pending_sectors: 0,
            temperature_celsius: 42,
            read_error_rate: 0,
            seek_error_rate: 0
        },
        performance_metrics: {
            read_speed_mbps: 2800,
            write_speed_mbps: 2100,
            random_read_iops: 85000,
            random_write_iops: 72000,
            latency_ms: 0.05
        },
        physical_condition: {
            condition: "GOOD",
            has_physical_damage: false,
            connector_condition: "EXCELLENT",
            label_condition: "GOOD"
        },
        usage_history: {
            estimated_age_months: 18,
            usage_intensity: "MODERATE",
            previous_owner_count: 1
        }
    };

    // Price calculation logic in Indian Rupees for reselling electronics
    const calculatePrice = (data: DeviceReport): number => {
        let basePrice = 0;
        let multiplier = 1.0;

        // Determine device type based on capacity and interface (more realistic for laptops/phones)
        const capacity = data.device_info?.capacity_gb || 0;
        const deviceInterface = data.device_info?.interface?.toLowerCase() || '';

        // Base pricing for different device types and storage capacities
        if (deviceInterface.includes('nvme') || deviceInterface.includes('pcie')) {
            // High-end laptops/ultrabooks with NVMe SSDs
            if (capacity >= 1000) basePrice = 45000; // ₹45,000 for 1TB+ laptops
            else if (capacity >= 512) basePrice = 35000; // ₹35,000 for 512GB laptops
            else if (capacity >= 256) basePrice = 25000; // ₹25,000 for 256GB laptops
            else basePrice = 18000; // ₹18,000 for 128GB laptops
        } else if (deviceInterface.includes('sata') && capacity >= 500) {
            // Traditional laptops with SATA SSDs/HDDs
            if (capacity >= 2000) basePrice = 35000; // ₹35,000 for 2TB+ laptops
            else if (capacity >= 1000) basePrice = 28000; // ₹28,000 for 1TB laptops
            else basePrice = 22000; // ₹22,000 for 500GB laptops
        } else if (capacity >= 64 && capacity <= 512) {
            // Phones/tablets based on storage
            if (capacity >= 256) basePrice = 25000; // ₹25,000 for 256GB+ phones
            else if (capacity >= 128) basePrice = 18000; // ₹18,000 for 128GB phones
            else if (capacity >= 64) basePrice = 12000; // ₹12,000 for 64GB phones
            else basePrice = 8000; // ₹8,000 for 32GB phones
        } else {
            // Generic devices or older hardware
            if (capacity >= 1000) basePrice = 20000;
            else if (capacity >= 500) basePrice = 15000;
            else basePrice = 10000;
        }

        // Health multiplier - more generous for functional devices
        const healthPercentage = data.health_metrics?.health_percentage || 0;
        if (healthPercentage >= 90) multiplier *= 1.0; // Excellent health
        else if (healthPercentage >= 80) multiplier *= 0.9; // Good health
        else if (healthPercentage >= 70) multiplier *= 0.8; // Fair health
        else if (healthPercentage >= 60) multiplier *= 0.7; // Poor health
        else if (healthPercentage >= 40) multiplier *= 0.5; // Very poor health
        else multiplier *= 0.3; // Critical condition

        // Age depreciation - more realistic for consumer electronics
        const ageMonths = data.usage_history?.estimated_age_months || 0;
        if (ageMonths <= 6) multiplier *= 0.95; // Nearly new
        else if (ageMonths <= 12) multiplier *= 0.85; // Less than 1 year
        else if (ageMonths <= 24) multiplier *= 0.75; // 1-2 years
        else if (ageMonths <= 36) multiplier *= 0.6; // 2-3 years
        else if (ageMonths <= 48) multiplier *= 0.45; // 3-4 years
        else if (ageMonths <= 60) multiplier *= 0.35; // 4-5 years
        else multiplier *= 0.25; // 5+ years

        // Physical condition - critical for resale value
        const condition = data.physical_condition?.condition || 'FAIR';
        if (condition === 'EXCELLENT') multiplier *= 1.0; // Like new
        else if (condition === 'GOOD') multiplier *= 0.85; // Minor wear
        else if (condition === 'FAIR') multiplier *= 0.7; // Visible wear
        else multiplier *= 0.5; // Poor condition

        // Usage intensity - affects component wear
        const usage = data.usage_history?.usage_intensity || 'MODERATE';
        if (usage === 'LIGHT') multiplier *= 1.0; // Minimal usage
        else if (usage === 'MODERATE') multiplier *= 0.9; // Normal usage
        else multiplier *= 0.8; // Heavy usage

        // SMART status for storage devices
        if (data.health_metrics?.smart_status === 'FAILED') multiplier *= 0.4;
        else if (data.health_metrics?.smart_status === 'WARNING') multiplier *= 0.8;

        // Physical damage penalty
        if (data.physical_condition?.has_physical_damage) {
            multiplier *= 0.6; // Significant impact on resale
        }

        // Brand premium (inferred from manufacturer)
        const manufacturer = data.device_info?.manufacturer?.toLowerCase() || '';
        if (manufacturer.includes('apple') || manufacturer.includes('samsung') ||
            manufacturer.includes('dell') || manufacturer.includes('hp') ||
            manufacturer.includes('lenovo') || manufacturer.includes('asus')) {
            multiplier *= 1.1; // 10% premium for popular brands
        }

        const finalPrice = Math.max(basePrice * multiplier, 2000); // Minimum ₹2,000
        return Math.round(finalPrice);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/json') {
            setError('Please upload a JSON file');
            return;
        }

        setError('');
        setUploadedFile(file);
        setPriceEstimate(null);

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    const data: DeviceReport = JSON.parse(result);
                    setReportData(data);
                }
            } catch (err) {
                setError('Invalid JSON format');
                console.error(err);
                setUploadedFile(null);
            }
        };
        reader.readAsText(file);
    };

    const handleGetPriceEstimate = (): void => {
        if (!reportData) return;

        setIsProcessing(true);

        // Simulate processing time
        setTimeout(() => {
            const price = calculatePrice(reportData);
            setPriceEstimate(price);
            setIsProcessing(false);
        }, 1500);
    };

    const downloadReportFormat = (): void => {
        const dataStr = JSON.stringify(sampleReportFormat, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'device_report_sample.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="min-h-screen relative py-20">
            <div
                className="absolute inset-0 -z-[1]"
                style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
                }}
            />
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Device Price Estimator
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Upload your device report to get an instant price estimate in Indian Rupees
                    </p>
                </div>

                {/* File Upload */}
                <div className="flex items-center gap-2 text-lg">
                    <Upload className="w-5 h-5" />
                    Upload Device Report
                </div>
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors relative">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="space-y-2">
                            <p className="text-lg font-medium">Choose a file or drag it here</p>
                            <p className="text-gray-500">JSON files only, up to 10MB</p>
                        </div>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {uploadedFile && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-200 p-3 rounded-lg">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">File uploaded: {uploadedFile.name}</span>
                        </div>
                    )}
                </div>

                {/* Price Estimation */}
                {reportData && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calculator className="w-5 h-5" />
                                Price Estimation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Device Summary */}
                                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">Device</p>
                                        <p className="font-medium">{reportData.device_info?.manufacturer} {reportData.device_info?.model}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Capacity</p>
                                        <p className="font-medium">{reportData.device_info?.capacity_gb}GB</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Health</p>
                                        <p className="font-medium">{reportData.health_metrics?.health_percentage}%</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Age</p>
                                        <p className="font-medium">{reportData.usage_history?.estimated_age_months} months</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleGetPriceEstimate}
                                    disabled={isProcessing}
                                    className="w-full"
                                >
                                    {isProcessing ? 'Processing...' : 'Get Price Estimate'}
                                </Button>

                                {priceEstimate !== null && (
                                    <div className="text-center p-6 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-2">Estimated Price</p>
                                        <p className="text-4xl font-bold text-blue-600">₹{priceEstimate.toLocaleString('en-IN')}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            * Price estimate based on device condition, age, and Indian market value
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Download Report Format */}
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="w-5 h-5" />
                            Sample Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                            Download a sample report to see the exact format required. Upload this file to test the price estimation.
                        </p>
                        <Button
                            variant="outline"
                            onClick={downloadReportFormat}
                            className="w-full sm:w-auto"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Sample Report
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}