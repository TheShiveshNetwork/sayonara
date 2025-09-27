"use client";

import { Button } from "@/components/ui/button";
import { Shield, Download, Disc } from "lucide-react";
import Link from "next/link";
import { SayonaraWipeFlow } from "./ui/animated-beam";
import Highlighter from "./ui/highlighter";

const Hero = () => {
    return (
        <section className="hero-section min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden ">

            {/* Indigo Cosmos Background with Top Glow */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
                }}
            />

            <div
                className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
         repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
                    WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                }}
            />

            {/* Aurora Mystic Mist Background */}
            {/* <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(58, 175, 169, 0.6) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(238, 130, 238, 0.3) 0%, transparent 80%)
        `,
                }}
            /> */}

            {/* Plasma Beam System */}
            <div className="plasma-beam-container">
                {/* Spotlight from top */}
                {/* <div className="spotlight"></div> */}

                {/* Main plasma beam */}
                {/* <div className="plasma-beam"></div> */}

                {/* Plasma flow particles */}
                {/* <div className="plasma-flow-container">
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
                </div> */}
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
                            <h1 className="text-4xl md:text-6xl font-bold -leading-[50px]">
                                Complete Drive
                                <Highlighter color="#FF9800"> Erasure</Highlighter>
                                {" "}Made Simple
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-lg">
                                Military-grade data destruction software that permanently erases sensitive information
                                from your drives with government-approved algorithms.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                                <Link href="/download-app">
                                    <Download className="h-5 w-5 mr-2" />
                                    Download App
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                                <Link href="/download-iso">
                                    <Disc className="h-5 w-5 mr-2" />
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
                    <SayonaraWipeFlow />
                </div>
            </div>
        </section>
    );
};

export default Hero;
