import { Button } from "@/components/ui/button";
import { Download, Monitor, Smartphone } from "lucide-react";
import Image from "next/image";

export default function DownloadAppPage() {
    const platforms = [
        {
          name: "Windows",
          icon: Monitor,
          description: "Windows 10/11 compatible",
          version: "v2.1.3",
          size: "45.2 MB",
          screenshot: "",
          downloadUrl: "#"
        },
        {
          name: "Linux",
          icon: Monitor,
          description: "Ubuntu, Debian, CentOS, Fedora",
          version: "v2.1.3",
          size: "38.7 MB",
          screenshot: "",
          downloadUrl: "#"
        },
        {
          name: "Android",
          icon: Smartphone,
          description: "Android 8.0+ required",
          version: "v1.8.2",
          size: "12.4 MB",
          screenshot: "",
          downloadUrl: "#"
        }
      ];
    
      return (
        <div className="min-h-screen bg-background">
          <main className="pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center space-y-4 mb-16">
                <h1 className="text-4xl md:text-5xl font-bold">
                  Download <span className="gradient-text-primary">Sayonara</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Choose your platform and start securely erasing data across all your devices.
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {platforms.map((platform, index) => (
                  <div 
                    key={platform.name}
                    className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="aspect-video overflow-hidden">
                      <Image 
                        src={platform.screenshot} 
                        alt={`${platform.name} Screenshot`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="gradient-primary p-2 rounded-lg">
                          <platform.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{platform.name}</h3>
                          <p className="text-sm text-muted-foreground">{platform.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Version: {platform.version}</span>
                        <span>Size: {platform.size}</span>
                      </div>
                      
                      <Button variant="default" className="w-full" asChild>
                        <a href={platform.downloadUrl} className="flex gap-2">
                          <Download className="h-4 w-4" />
                          Download for {platform.name}
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 bg-card rounded-2xl p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-4">System Requirements</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Windows</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Windows 10 or later</li>
                      <li>• 4GB RAM minimum</li>
                      <li>• 100MB free storage</li>
                      <li>• Administrator privileges</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Linux</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Ubuntu 18.04+ / Debian 10+</li>
                      <li>• 2GB RAM minimum</li>
                      <li>• 50MB free storage</li>
                      <li>• Root access required</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Android</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Android 8.0 (API 26)+</li>
                      <li>• 1GB RAM minimum</li>
                      <li>• 25MB free storage</li>
                      <li>• Device admin permissions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      );
}
