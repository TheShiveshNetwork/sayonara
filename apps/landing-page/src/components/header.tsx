"use client";

import { Button } from "@/components/ui/button";
import { Hand, Shield } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold gradient-text-primary">Sayonara</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/download-app" className="text-muted-foreground hover:text-foreground transition-colors">
            Download App
          </Link>
          <Link href="/download-iso" className="text-muted-foreground hover:text-foreground transition-colors">
            Download ISO
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/download-app">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;