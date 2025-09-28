"use client";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen py-12"><div
                className="absolute inset-0 -z-[1]"
                style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
                }}
            />
            <div className="mx-auto pt-10 px-4 md:px-0 max-w-6xl relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Privacy Policy
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Last updated: September 28, 2025
                    </p>
                </div>

                {/* Introduction */}
                <h3 className="text-xl font-semibold my-4 flex items-center">
                    Introduction
                </h3>
                <p className="text-white/60 leading-relaxed">
                    At Sayonara, we are committed to protecting your privacy and ensuring the secure handling of your data.
                    This Privacy Policy explains how we collect, use, and safeguard information when you use our secure data
                    wipe software and related services. Given the nature of our software - which permanently destroys data -
                    privacy and security are fundamental to our operations.
                </p>

                {/* Information We Collect */}
                <h3 className="text-xl font-semibold my-4 flex items-center">
                    Information We Collect
                </h3>

                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold  mb-2">Device Information</h4>
                        <ul className="text-white/60 space-y-1 ml-4">
                            <li>• Hardware specifications (drive model, capacity, serial numbers)</li>
                            <li>• System configuration details</li>
                            <li>• SMART data and health metrics</li>
                            <li>• Wipe operation logs and completion status</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold  mb-2">Usage Data</h4>
                        <ul className="text-white/60 space-y-1 ml-4">
                            <li>• Software version and configuration settings</li>
                            <li>• Wipe method selections and completion times</li>
                            <li>• Error logs and diagnostic information</li>
                            <li>• Performance metrics (for software improvement)</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold  mb-2">Personal Information (Optional)</h4>
                        <ul className="text-white/60 space-y-1 ml-4">
                            <li>• Email address (for support and updates)</li>
                            <li>• Organization name (for enterprise licensing)</li>
                            <li>• Contact information (for customer support)</li>
                        </ul>
                    </div>
                </div>

                {/* How We Use Your Information */}
                <h3 className="text-xl font-semibold my-4 flex items-center">
                    How We Use Your Information
                </h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold ">Primary Uses:</h4>
                        <ul className="text-white/60 space-y-1 ml-4 mt-2">
                            <li>• Execute secure data wiping operations</li>
                            <li>• Generate wipe completion certificates and reports</li>
                            <li>• Provide technical support and troubleshooting</li>
                            <li>• Improve software performance and compatibility</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold ">Secondary Uses:</h4>
                        <ul className="text-white/60 space-y-1 ml-4 mt-2">
                            <li>• Send important software updates and security patches</li>
                            <li>• Analyze usage patterns for product development</li>
                            <li>• Comply with legal and regulatory requirements</li>
                        </ul>
                    </div>
                </div>

                {/* Data Protection */}
                <h3 className="text-xl font-semibold my-4 flex items-center">
                    Data Protection & Wiping
                </h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold ">Our Wipe Standards:</h4>
                        <ul className="text-white/60 space-y-1 ml-4 mt-2">
                            <li>• DoD 5220.22-M (3-pass overwrite)</li>
                            <li>• NIST 800-88 compliant methods</li>
                            <li>• Gutmann 35-pass method (for maximum security)</li>
                            <li>• Cryptographic erasure for encrypted drives</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold ">Verification Process:</h4>
                        <ul className="text-white/60 space-y-1 ml-4 mt-2">
                            <li>• Post-wipe verification scans</li>
                            <li>• Digital certificates of destruction</li>
                            <li>• Audit trail generation</li>
                            <li>• Compliance reporting for enterprises</li>
                        </ul>
                    </div>
                </div>

                {/* Information Sharing */}
                <h3 className="text-xl font-semibold my-4">Information Sharing</h3>

                <div>
                    <h4 className="font-semibold  mb-2">Limited Sharing Only When:</h4>
                    <ul className="text-white/60 space-y-1 ml-4">
                        <li>• Required by law or legal process</li>
                        <li>• Necessary for technical support (with your consent)</li>
                        <li>• Part of business transfer (with privacy protections)</li>
                        <li>• Essential for service providers (under strict agreements)</li>
                    </ul>
                </div>

                {/* Data Retention */}
                <h3 className="text-xl font-semibold my-4">Data Retention</h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold ">Retention Periods:</h4>
                        <ul className="text-white/60 space-y-1 ml-4 mt-2">
                            <li>• Wipe completion logs: 7 years (for compliance)</li>
                            <li>• Device reports: 3 years (for warranty support)</li>
                            <li>• Support communications: 2 years</li>
                            <li>• Usage analytics: 1 year (aggregated data only)</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold ">Data Deletion:</h4>
                        <p className="text-white/60 mt-2">
                            Upon request or at the end of retention periods, we securely delete personal
                            information using the same rigorous standards we apply to customer data wiping.
                        </p>
                    </div>
                </div>

                {/* Your Rights */}
                <h3 className="text-xl font-semibold my-4">Your Privacy Rights</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold  mb-2">Access & Control:</h4>
                        <ul className="text-white/60 space-y-1 text-sm">
                            <li>• Request copies of your data</li>
                            <li>• Update incorrect information</li>
                            <li>• Request data deletion</li>
                            <li>• Withdraw consent</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold  mb-2">Protection Rights:</h4>
                        <ul className="text-white/60 space-y-1 text-sm">
                            <li>• Object to data processing</li>
                            <li>• Data portability requests</li>
                            <li>• Lodge privacy complaints</li>
                            <li>• Opt-out of communications</li>
                        </ul>
                    </div>
                </div>

                {/* Security Measures */}
                <h3 className="text-xl font-semibold my-4">Security Measures</h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold ">Technical Safeguards:</h4>
                        <ul className="text-white/60 space-y-1 ml-4 mt-2">
                            <li>• End-to-end encryption for data transmission</li>
                            <li>• Secure boot and code signing</li>
                            <li>• Regular security audits and penetration testing</li>
                            <li>• Multi-factor authentication for admin access</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold ">Operational Security:</h4>
                        <ul className="text-white/60 space-y-1 ml-4 mt-2">
                            <li>• Staff background checks and training</li>
                            <li>• Physical security of facilities</li>
                            <li>• Incident response procedures</li>
                            <li>• Regular backup and disaster recovery testing</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}