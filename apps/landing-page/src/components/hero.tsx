"use client";

import { Button } from "@/components/ui/button";
import { Shield, Download, Disc } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import appScreenshot from "@/assets/app-mockup.png";

const Hero = () => {
    return (
        <section className="hero-section min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden hero-gradient">
            {/* Plasma Beam System */}
            <div className="plasma-beam-container">
                {/* Spotlight from top */}
                <div className="spotlight"></div>

                {/* Main plasma beam */}
                <div className="plasma-beam"></div>

                {/* Plasma flow particles */}
                <div className="plasma-flow-container">
                    {[...Array(6)].map((_, i) => (
                        <div
                            suppressHydrationWarning
                            key={i}
                            className="plasma-particle"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${-Math.random() * 6}s`,
                                animationDuration: `${5 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-fade-in">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-primary">
                                <Shield className="h-6 w-6" />
                                <span className="text-sm font-medium uppercase tracking-wider">
                                    Secure Data Erasure
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                                Complete Drive
                                <span className="gradient-text-primary"> Erasure</span>
                                <br />
                                Made Simple
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-lg">
                                Military-grade data destruction software that permanently erases sensitive information
                                from your drives with government-approved algorithms.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                                <Link href="/download-app">
                                    <Download className="h-5 w-5" />
                                    Download App
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                                <Link href="/download-iso">
                                    <Disc className="h-5 w-5" />
                                    Download ISO
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span>DoD 5220.22-M Compliant</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span>NIST 800-88 Certified</span>
                            </div>
                        </div>
                    </div>

                    {/* Image with glow effect */}
                    <div className="relative animate-float">
                        <div className="card-glow rounded-2xl overflow-hidden image-container glow relative">
                            <div className="plasma-impact-point"></div>
                            <div className="screen-glare"></div>
                            <Image
                                src={appScreenshot}
                                alt="SecureWipe Application Interface"
                                height={500}
                                width={500}
                                className="w-full h-auto rounded-2xl shadow-2xl relative z-20"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
