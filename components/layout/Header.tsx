"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "What I Offer", href: "/what-i-offer" },
    { name: "Contact", href: "/contact" },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
            <nav className="container-custom flex items-center justify-between py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="relative w-10 h-10 flex items-center justify-center glow-primary">
                        <img
                            src="/logo.png"
                            alt="Chrixlin Logo"
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    <span className="text-xl font-bold gradient-text-primary">
                        Chrixlin
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-foreground/80 hover:text-primary transition-smooth"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <Link href="/contact">
                        <Button variant="gradient" size="default">
                            Get in Touch
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-smooth"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "md:hidden glass-strong border-t border-white/10 transition-all duration-300 overflow-hidden",
                    mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="container-custom py-4 space-y-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="block text-sm font-medium text-foreground/80 hover:text-primary transition-smooth py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="gradient" size="default" className="w-full">
                            Get in Touch
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
