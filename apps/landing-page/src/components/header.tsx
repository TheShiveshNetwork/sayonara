"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed px-4 md:px-0 top-0 w-full z-50 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"}`}>
      <div className="container relative mx-auto md:max-w-6xl py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Sayonara</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/download" className="text-muted-foreground hover:text-foreground transition-colors">
            Download
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/#demo">Watch Demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;