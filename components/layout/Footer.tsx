import Link from "next/link";
import { Mail, Phone, Linkedin, Instagram } from "lucide-react";

const contactInfo = {
    phone: process.env.NEXT_PUBLIC_PHONE || "+919151214181",
    email: process.env.NEXT_PUBLIC_EMAIL || "chrixlinitsolutions@gmail.com",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN || "https://www.linkedin.com/in/milton-raj/",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "",
};

const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="glass-strong border-t border-white/10 mt-20">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary">
                                <span className="text-xl font-bold text-white">C</span>
                            </div>
                            <span className="text-xl font-bold gradient-text-primary">
                                Chrixlin
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Building scalable apps for web & mobile. Transforming ideas into premium digital experiences.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Get in Touch</h3>
                        <div className="space-y-3">
                            <a
                                href={`mailto:${contactInfo.email}`}
                                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
                            >
                                <Mail className="w-4 h-4" />
                                <span>{contactInfo.email}</span>
                            </a>
                            <a
                                href={`tel:${contactInfo.phone}`}
                                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
                            >
                                <Phone className="w-4 h-4" />
                                <span>{contactInfo.phone}</span>
                            </a>
                            <div className="flex items-center space-x-4 pt-2">
                                {contactInfo.linkedin && (
                                    <a
                                        href={contactInfo.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg glass hover:bg-primary/20 hover-glow-primary transition-smooth"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {contactInfo.instagram && (
                                    <a
                                        href={`https://instagram.com/${contactInfo.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg glass hover:bg-accent/20 hover-glow-accent transition-smooth"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} Chrixlin IT Solutions. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
