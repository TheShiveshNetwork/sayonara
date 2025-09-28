"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Monitor, Smartphone, ChevronDown } from "lucide-react";

export default function DownloadAppPage() {
  const [linuxFormat, setLinuxFormat] = useState<'deb' | 'rpm'>('deb');
  const [showLinuxDropdown, setShowLinuxDropdown] = useState(false);

  const linuxOptions = [
    {
      format: 'deb' as const,
      description: 'Ubuntu, Debian, Pop!_OS',
      downloadUrl: '/Sayonara_0.1.0_amd64.deb',
      size: '38.7 MB'
    },
    {
      format: 'rpm' as const,
      description: 'Fedora, RHEL, openSUSE',
      downloadUrl: '/sayonara-0.1.0-2.x86_64.rpm',
      size: '39.2 MB'
    }
  ];

  const selectedLinuxOption = linuxOptions.find(option => option.format === linuxFormat)!;

  const platforms = [
    {
      name: "Windows",
      icon: Monitor,
      description: "Windows 10/11 compatible",
      version: "v0.1.0",
      size: "45.2 MB",
      downloadUrl: "/Sayonara_0.1.0_x64-setup.exe",
      isLinux: false
    },
    {
      name: "Linux",
      icon: Monitor,
      description: selectedLinuxOption.description,
      version: "v0.1.0",
      size: selectedLinuxOption.size,
      downloadUrl: selectedLinuxOption.downloadUrl,
      isLinux: true
    },
    {
      name: "Android",
      icon: Smartphone,
      description: "Android 8.0+ required",
      version: "v0.1.0",
      size: "12.4 MB",
      downloadUrl: "/Sayonara.apk",
      isLinux: false
    }
  ];

  return (
    <div className="min-h-screen">
      <div
        className="absolute inset-0 -z-[1]"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
        }}
      />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Download Sayonara
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your platform and start securely erasing data across all your devices.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <div
                key={platform.name}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-blue-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <platform.icon className="h-10 w-10 text-white" />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{platform.name}</h3>
                      <p className="text-sm text-gray-400">{platform.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Version: {platform.version}</span>
                    <span>Size: {platform.size}</span>
                  </div>

                  {/* Linux Format Selector */}
                  {platform.isLinux && (
                    <div className="relative">
                      <button
                        onClick={() => setShowLinuxDropdown(!showLinuxDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-sm text-white hover:bg-gray-700 transition-colors"
                      >
                        <span>Format: .{linuxFormat.toUpperCase()}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showLinuxDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showLinuxDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10">
                          {linuxOptions.map((option) => (
                            <button
                              key={option.format}
                              onClick={() => {
                                setLinuxFormat(option.format);
                                setShowLinuxDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors first:rounded-t-md last:rounded-b-md"
                            >
                              <div className="font-medium">.{option.format.toUpperCase()}</div>
                              <div className="text-xs text-gray-400">{option.description}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                    <a href={platform.downloadUrl} className="flex gap-2 items-center justify-center">
                      <Download className="h-4 w-4" />
                      Download for {platform.name}
                      {platform.isLinux && ` (.${linuxFormat})`}
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">System Requirements</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Windows</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Windows 10 or later</li>
                  <li>• 4GB RAM minimum</li>
                  <li>• 100MB free storage</li>
                  <li>• Administrator privileges</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Linux</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Ubuntu 18.04+ / Debian 10+ (.deb)</li>
                  <li>• Fedora 30+ / RHEL 8+ (.rpm)</li>
                  <li>• 2GB RAM minimum</li>
                  <li>• 50MB free storage</li>
                  <li>• Root access required</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Android</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Android 8.0 (API 26)+</li>
                  <li>• 1GB RAM minimum</li>
                  <li>• 25MB free storage</li>
                  <li>• Device admin permissions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">Installation Instructions</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Windows</h3>
                <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Download the .exe installer</li>
                  <li>Run as administrator</li>
                  <li>Follow the setup wizard</li>
                  <li>Launch from Start Menu</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Linux</h3>
                <div className="text-sm text-gray-400 space-y-2">
                  <p className="font-medium">For .deb packages:</p>
                  <code className="block bg-gray-800 p-2 rounded text-xs">
                    sudo dpkg -i Sayonara_0.1.0_amd64.deb
                  </code>
                  <p className="font-medium mt-3">For .rpm packages:</p>
                  <code className="block bg-gray-800 p-2 rounded text-xs">
                    sudo rpm -i Sayonara_0.1.0_x86_64.rpm
                  </code>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Android</h3>
                <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Enable Unknown sources</li>
                  <li>Download the .apk file</li>
                  <li>Tap to install</li>
                  <li>Grant required permissions</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}