import { Button } from "@/components/ui/button";
import { CheckCircle, Disc, Download, Shield } from "lucide-react";
import appScreenshot from "@/assets/app-mockup.png";
import Image from "next/image";

export default function DownloadISOPage() {
    const isoVersions = [
        {
          name: "SecureWipe ISO Standard",
          description: "Bootable ISO with essential erasure tools",
          version: "v2.1.0",
          size: "698 MB",
          features: ["UEFI & Legacy Boot", "Multiple Erasure Algorithms", "Hardware Detection", "Basic Reporting"]
        },
        {
          name: "SecureWipe ISO Professional",
          description: "Advanced ISO with enterprise features",
          version: "v2.1.0",
          size: "1.2 GB",
          features: ["Everything in Standard", "Advanced Reporting", "Network Boot Support", "Hardware Diagnostics", "Audit Logging"]
        }
      ];
    
      const steps = [
        {
          number: "1",
          title: "Download ISO",
          description: "Download the SecureWipe bootable ISO image"
        },
        {
          number: "2",
          title: "Create Bootable Media",
          description: "Burn to DVD or create bootable USB using tools like Rufus"
        },
        {
          number: "3",
          title: "Boot from Media",
          description: "Restart computer and boot from your created media"
        },
        {
          number: "4",
          title: "Erase Drives",
          description: "Select drives and erasure method, then start the process"
        }
      ];
    
      return (
        <div className="min-h-screen bg-background">
          <main className="pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center space-y-4 mb-16">
                <h1 className="text-4xl md:text-5xl font-bold">
                  Download <span className="gradient-text-primary">Bootable ISO</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Create a bootable environment for secure drive erasure without installing software.
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="gradient-primary p-3 rounded-lg">
                      <Disc className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Bootable Environment</h2>
                      <p className="text-muted-foreground">Complete system-level access</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-muted-foreground">
                    The SecureWipe ISO provides a complete bootable environment that runs independently 
                    of your operating system, ensuring maximum security and the ability to erase 
                    system drives completely.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>No installation required</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Works on any x86/x64 system</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Complete drive access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Hardware detection</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="card-glow rounded-2xl overflow-hidden">
                    <Image 
                      src={appScreenshot} 
                      alt="SecureWipe ISO Interface"
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {isoVersions.map((iso, index) => (
                  <div 
                    key={iso.name}
                    className="bg-card rounded-2xl p-8 border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{iso.name}</h3>
                        <p className="text-muted-foreground">{iso.description}</p>
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Version: {iso.version}</span>
                        <span>Size: {iso.size}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {iso.features.map((feature) => (
                            <li key={feature} className="flex items-center space-x-2">
                              <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button variant="default" className="w-full">
                        <Download className="h-4 w-4" />
                        Download {iso.name.split(' ').pop()}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-8 text-center">How to Use the ISO</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {steps.map((step, index) => (
                    <div key={step.number} className="text-center space-y-4">
                      <div className="gradient-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                        {step.number}
                      </div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-muted/50 rounded-xl">
                  <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Important Notice</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The bootable ISO will completely erase selected drives. Ensure you have backed up 
                    any important data before proceeding. This process is irreversible and designed 
                    for secure data destruction.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      );
}
