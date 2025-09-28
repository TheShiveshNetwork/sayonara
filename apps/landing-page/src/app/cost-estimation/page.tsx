"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, Calculator, FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';

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

interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export default function PriceEstimator() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [reportData, setReportData] = useState<DeviceReport | null>(null);
    const [priceEstimate, setPriceEstimate] = useState<number | null>(null);
    const [originalPrice, setOriginalPrice] = useState<number | null>(null);
    const [wipedPrice, setWipedPrice] = useState<number | null>(null);
    const [profitMargin, setProfitMargin] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Sample report format for download (No Apple devices)
    const sampleReportFormat: DeviceReport = {
        device_info: {
            manufacturer: "Samsung",
            model: "Galaxy S22 Ultra",
            serial_number: "SGS22U-2023-001",
            interface: "UFS 3.1",
            capacity_gb: 256,
            manufacture_date: "2022-03-15"
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

    // Validation function to check if report data is complete and valid
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validateReportData = (data: any): ValidationResult => {
        const errors: string[] = [];

        // Check if data exists and has required structure
        if (!data || typeof data !== 'object') {
            return { isValid: false, errors: ['Invalid or empty JSON data'] };
        }

        // Check device_info
        if (!data.device_info) {
            errors.push('Missing device_info section');
        } else {
            if (!data.device_info.manufacturer?.trim()) errors.push('Missing manufacturer');
            if (!data.device_info.model?.trim()) errors.push('Missing model');
            if (!data.device_info.capacity_gb || data.device_info.capacity_gb <= 0) {
                errors.push('Missing or invalid capacity');
            }
            if (!data.device_info.interface?.trim()) errors.push('Missing interface type');
        }

        // Check health_metrics
        if (!data.health_metrics) {
            errors.push('Missing health_metrics section');
        } else {
            if (typeof data.health_metrics.health_percentage !== 'number' || 
                data.health_metrics.health_percentage < 0 || 
                data.health_metrics.health_percentage > 100) {
                errors.push('Invalid health percentage (must be 0-100)');
            }
            if (!['PASSED', 'WARNING', 'FAILED'].includes(data.health_metrics.smart_status)) {
                errors.push('Invalid SMART status');
            }
        }

        // Check physical_condition
        if (!data.physical_condition) {
            errors.push('Missing physical_condition section');
        } else {
            if (!['EXCELLENT', 'GOOD', 'FAIR', 'POOR'].includes(data.physical_condition.condition)) {
                errors.push('Invalid physical condition');
            }
        }

        // Check usage_history
        if (!data.usage_history) {
            errors.push('Missing usage_history section');
        } else {
            if (typeof data.usage_history.estimated_age_months !== 'number' || 
                data.usage_history.estimated_age_months < 0) {
                errors.push('Invalid estimated age');
            }
            if (!['LIGHT', 'MODERATE', 'HEAVY'].includes(data.usage_history.usage_intensity)) {
                errors.push('Invalid usage intensity');
            }
        }

        return { isValid: errors.length === 0, errors };
    };

    // Enhanced price calculation with more realistic pricing (adjusted for 30% higher base prices)
    const calculatePrice = (data: DeviceReport): { price: number; originalPrice: number; wipedPrice: number; profitMargin: number } => {
        let basePrice = 0;
        let multiplier = 1.0;

        const capacity = data.device_info?.capacity_gb || 0;
        const deviceInterface = data.device_info?.interface?.toLowerCase() || '';
        const manufacturer = data.device_info?.manufacturer?.toLowerCase() || '';
        const model = data.device_info?.model?.toLowerCase() || '';

        // Improved base pricing with 30% higher values and better device detection (No Apple support)
        if (manufacturer.includes('samsung')) {
            if (model.includes('galaxy s') || model.includes('note')) {
                if (capacity >= 512) basePrice = 50000; // ₹50,000 for 512GB+ Galaxy flagship
                else if (capacity >= 256) basePrice = 40000; // ₹40,000 for 256GB Galaxy flagship
                else if (capacity >= 128) basePrice = 32000; // ₹32,000 for 128GB Galaxy flagship
                else basePrice = 25000; // ₹25,000 for 64GB Galaxy flagship
            } else {
                // Other Samsung devices
                if (capacity >= 256) basePrice = 30000; // ₹30,000 for 256GB+ Samsung mid-range
                else if (capacity >= 128) basePrice = 22000; // ₹22,000 for 128GB Samsung mid-range
                else basePrice = 18000; // ₹18,000 for lower capacity Samsung
            }
        } else if (manufacturer.includes('oneplus')) {
            if (capacity >= 256) basePrice = 35000; // ₹35,000 for 256GB+ OnePlus
            else if (capacity >= 128) basePrice = 28000; // ₹28,000 for 128GB OnePlus
            else basePrice = 22000; // ₹22,000 for lower capacity OnePlus
        } else if (manufacturer.includes('xiaomi') || manufacturer.includes('redmi') || manufacturer.includes('poco')) {
            if (capacity >= 256) basePrice = 25000; // ₹25,000 for 256GB+ Xiaomi/Redmi
            else if (capacity >= 128) basePrice = 18000; // ₹18,000 for 128GB Xiaomi/Redmi
            else basePrice = 12000; // ₹12,000 for lower capacity Xiaomi/Redmi
        } else {
            // Generic pricing based on interface and capacity (30% higher)
            if (deviceInterface.includes('nvme') || deviceInterface.includes('pcie')) {
                // High-end laptops with NVMe SSDs
                if (capacity >= 1000) basePrice = 58500; // ₹58,500 (was 45,000)
                else if (capacity >= 512) basePrice = 45500; // ₹45,500 (was 35,000)
                else if (capacity >= 256) basePrice = 32500; // ₹32,500 (was 25,000)
                else basePrice = 23400; // ₹23,400 (was 18,000)
            } else if (deviceInterface.includes('sata') && capacity >= 500) {
                // Traditional laptops with SATA SSDs/HDDs
                if (capacity >= 2000) basePrice = 45500; // ₹45,500 (was 35,000)
                else if (capacity >= 1000) basePrice = 36400; // ₹36,400 (was 28,000)
                else basePrice = 28600; // ₹28,600 (was 22,000)
            } else if (capacity >= 32 && capacity <= 512) {
                // Phones/tablets based on storage
                if (capacity >= 256) basePrice = 32500; // ₹32,500 (was 25,000)
                else if (capacity >= 128) basePrice = 23400; // ₹23,400 (was 18,000)
                else if (capacity >= 64) basePrice = 15600; // ₹15,600 (was 12,000)
                else basePrice = 10400; // ₹10,400 (was 8,000)
            } else {
                // Generic devices or older hardware
                if (capacity >= 1000) basePrice = 26000;
                else if (capacity >= 500) basePrice = 19500;
                else basePrice = 13000;
            }
        }

        const originalPrice = basePrice;

        // Health multiplier - more realistic depreciation
        const healthPercentage = data.health_metrics?.health_percentage || 0;
        if (healthPercentage >= 95) multiplier *= 0.95; // Excellent health (small depreciation)
        else if (healthPercentage >= 85) multiplier *= 0.85; // Good health
        else if (healthPercentage >= 75) multiplier *= 0.75; // Fair health
        else if (healthPercentage >= 65) multiplier *= 0.65; // Poor health
        else if (healthPercentage >= 50) multiplier *= 0.5; // Very poor health
        else if (healthPercentage >= 30) multiplier *= 0.35; // Critical condition
        else multiplier *= 0.2; // Nearly unusable

        // Age depreciation - more realistic for Indian market
        const ageMonths = data.usage_history?.estimated_age_months || 0;
        if (ageMonths <= 3) multiplier *= 0.9; // Nearly new (10% depreciation)
        else if (ageMonths <= 6) multiplier *= 0.85; // 6 months
        else if (ageMonths <= 12) multiplier *= 0.75; // 1 year
        else if (ageMonths <= 18) multiplier *= 0.65; // 1.5 years
        else if (ageMonths <= 24) multiplier *= 0.55; // 2 years
        else if (ageMonths <= 36) multiplier *= 0.45; // 3 years
        else if (ageMonths <= 48) multiplier *= 0.35; // 4 years
        else if (ageMonths <= 60) multiplier *= 0.25; // 5 years
        else multiplier *= 0.15; // 5+ years

        // Physical condition - critical for resale
        const condition = data.physical_condition?.condition || 'FAIR';
        if (condition === 'EXCELLENT') multiplier *= 1.0;
        else if (condition === 'GOOD') multiplier *= 0.9;
        else if (condition === 'FAIR') multiplier *= 0.75;
        else multiplier *= 0.55; // Poor condition

        // Usage intensity
        const usage = data.usage_history?.usage_intensity || 'MODERATE';
        if (usage === 'LIGHT') multiplier *= 1.0;
        else if (usage === 'MODERATE') multiplier *= 0.92;
        else multiplier *= 0.85; // Heavy usage

        // SMART status penalties
        if (data.health_metrics?.smart_status === 'FAILED') multiplier *= 0.3;
        else if (data.health_metrics?.smart_status === 'WARNING') multiplier *= 0.75;

        // Physical damage penalty
        if (data.physical_condition?.has_physical_damage) {
            multiplier *= 0.6;
        }

        // Brand premium/discount (No Apple support)
        if (manufacturer.includes('samsung') || manufacturer.includes('oneplus')) {
            multiplier *= 1.08; // 8% premium for premium Android brands
        } else if (manufacturer.includes('dell') || manufacturer.includes('hp') || 
                   manufacturer.includes('lenovo') || manufacturer.includes('asus')) {
            multiplier *= 1.05; // Small premium for established laptop brands
        } else if (manufacturer.includes('xiaomi') || manufacturer.includes('redmi') || manufacturer.includes('poco')) {
            multiplier *= 0.95; // Small discount for budget brands
        }

        // Previous owner penalty
        const ownerCount = data.usage_history?.previous_owner_count || 1;
        if (ownerCount > 2) multiplier *= 0.9; // Multiple owners reduce value

        const finalPrice = Math.max(basePrice * multiplier, 3000); // Minimum ₹3,000
        const wipedPrice = finalPrice * 1.15; // 15% increase after professional wiping
        const profitMargin = wipedPrice - finalPrice; // Profit from wiping service
        
        return { 
            price: Math.round(finalPrice), 
            originalPrice: Math.round(originalPrice),
            wipedPrice: Math.round(wipedPrice),
            profitMargin: Math.round(profitMargin)
        };
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/json') {
            setError('Please upload a JSON file');
            return;
        }

        setError('');
        setValidationErrors([]);
        setUploadedFile(file);
        setPriceEstimate(null);
        setOriginalPrice(null);
        setWipedPrice(null);
        setProfitMargin(null);

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    const data = JSON.parse(result);
                    const validation = validateReportData(data);
                    
                    if (!validation.isValid) {
                        setValidationErrors(validation.errors);
                        setUploadedFile(null);
                        setReportData(null);
                        return;
                    }
                    
                    setReportData(data as DeviceReport);
                }
            } catch (err) {
                setError('Invalid JSON format or corrupted file');
                console.error(err);
                setUploadedFile(null);
                setReportData(null);
            }
        };
        reader.readAsText(file);
    };

    const handleGetPriceEstimate = (): void => {
        if (!reportData) return;

        setIsProcessing(true);

        // Simulate processing time
        setTimeout(() => {
            const { price, originalPrice: origPrice, wipedPrice: wPrice, profitMargin: pMargin } = calculatePrice(reportData);
            setPriceEstimate(price);
            setOriginalPrice(origPrice);
            setWipedPrice(wPrice);
            setProfitMargin(pMargin);
            setIsProcessing(false);
        }, 2000);
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

    const getDepreciationPercentage = (): number => {
        if (originalPrice && priceEstimate) {
            return Math.round(((originalPrice - priceEstimate) / originalPrice) * 100);
        }
        return 0;
    };

    const getProfitMarginPercentage = (): number => {
        if (priceEstimate && profitMargin) {
            return Math.round((profitMargin / priceEstimate) * 100);
        }
        return 0;
    };

    return (
        <div className="min-h-screen relative py-20">
            <div
                className="absolute inset-0 -z-[1]"
                style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
                }}
            />
            <div className="mx-auto max-w-6xl space-y-6 px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Device Price Estimator
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Upload your device report to get an accurate price estimate in Indian Rupees
                    </p>
                </div>

                {/* File Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Upload className="w-5 h-5" />
                            Upload Device Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                <div className="flex items-center gap-2 text-red-600 border border-red-200 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {validationErrors.length > 0 && (
                                <div className="text-red-600 border border-red-200 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="font-medium text-sm">Validation Errors:</span>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {validationErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {uploadedFile && validationErrors.length === 0 && (
                                <div className="flex items-center gap-2 text-green-600 border border-green-200 p-3 rounded-lg">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm">File uploaded successfully: {uploadedFile.name}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

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
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg border">
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

                                {priceEstimate !== null && originalPrice !== null && wipedPrice !== null && profitMargin !== null && (
                                    <div className="text-center p-6 rounded-lg border">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Current Market Value</p>
                                                <p className="text-3xl font-bold text-gray-700">₹{priceEstimate.toLocaleString('en-IN')}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">After Professional Wiping</p>
                                                <p className="text-4xl font-bold text-green-600">₹{wipedPrice.toLocaleString('en-IN')}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-4 text-sm border-t pt-4">
                                                <div>
                                                    <p className="text-gray-600">Original Price</p>
                                                    <p className="font-semibold">₹{originalPrice.toLocaleString('en-IN')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Profit Margin</p>
                                                    <p className="font-semibold text-green-600">₹{profitMargin.toLocaleString('en-IN')} ({getProfitMarginPercentage()}%)</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Depreciation</p>
                                                    <p className="font-semibold text-red-600">{getDepreciationPercentage()}%</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-center gap-2 mt-4">
                                                <Info className="w-4 h-4 text-blue-500" />
                                                <p className="text-xs text-gray-500">
                                                    Professional wiping service adds 15% value premium. Price estimate based on device condition, age, brand, and current Indian market trends
                                                </p>
                                            </div>
                                        </div>
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
                            Sample Report Format
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                            Download a sample report to understand the exact format required. This sample contains all required fields for accurate price estimation.
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