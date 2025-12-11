"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    stats?: {
        value: string;
        label: string;
    }[];
}

export function HeroSection({ title, subtitle, stats }: HeroSectionProps) {
    const defaultStats = [
        { value: "10+", label: "Projects Delivered" },
        { value: "5+", label: "Happy Clients" },
        { value: "100%", label: "Satisfaction" }
    ];

    const displayStats = stats && stats.length === 3 ? stats : defaultStats;

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
            </div>

            <div className="container-custom text-center space-y-8">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center"
                >
                    <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Premium Digital Experiences</span>
                    </div>
                </motion.div>

                {/* Main Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-4"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
                        {title ? (
                            title.includes("Milton Raj") ? (
                                <>
                                    {title.split("Milton Raj")[0]}
                                    <span className="gradient-text animate-gradient">Milton Raj</span>
                                    {title.split("Milton Raj")[1]}
                                </>
                            ) : (
                                title
                            )
                        ) : (
                            <>
                                Building{" "}
                                <span className="gradient-text animate-gradient">
                                    Scalable Apps
                                </span>
                            </>
                        )}
                    </h1>
                    {!title && (
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground/80">
                            for Web & Mobile
                        </h2>
                    )}
                </motion.div>

                {/* Description - Supports Rich Text (HTML) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    {subtitle ? (
                        <div dangerouslySetInnerHTML={{ __html: subtitle }} />
                    ) : (
                        <p>Transforming innovative ideas into premium digital solutions. Specialized in web applications, mobile apps, and AI-powered tools.</p>
                    )}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/projects">
                        <Button variant="gradient" size="xl" className="group">
                            View My Projects
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="outline" size="xl">
                            Get in Touch
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
                >
                    <div className="space-y-2">
                        <div className="text-4xl md:text-5xl font-bold gradient-text-primary">{displayStats[0].value}</div>
                        <div className="text-sm text-muted-foreground">{displayStats[0].label}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl md:text-5xl font-bold gradient-text-accent">{displayStats[1].value}</div>
                        <div className="text-sm text-muted-foreground">{displayStats[1].label}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl md:text-5xl font-bold gradient-text-primary">{displayStats[2].value}</div>
                        <div className="text-sm text-muted-foreground">{displayStats[2].label}</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
