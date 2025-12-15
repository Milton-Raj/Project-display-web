"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Smartphone, Brain, Briefcase, Award, GraduationCap } from "lucide-react";
import Link from "next/link";

const defaultSkills = [
    { icon: Code, name: "Web Development", description: "React, Next.js, Node.js, TypeScript" },
    { icon: Smartphone, name: "Mobile Apps", description: "React Native, Flutter, iOS, Android" },
    { icon: Brain, name: "AI & ML", description: "TensorFlow, OpenAI, Machine Learning" },
    { icon: Briefcase, name: "Business Solutions", description: "SaaS, E-commerce, CRM Systems" },
];

const defaultCertifications = [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional",
    "Meta React Developer",
    "MongoDB Certified Developer",
];

interface AboutContentProps {
    content: any;
}

export function AboutContent({ content }: AboutContentProps) {
    // Parse skills
    let skillsList = defaultSkills;
    if (content.skills) {
        if (Array.isArray(content.skills)) {
            skillsList = content.skills;
        } else if (typeof content.skills === 'string') {
            const skillString = content.skills.trim();
            if (skillString.startsWith('[') || skillString.startsWith('{')) {
                try {
                    const parsed = JSON.parse(skillString);
                    if (Array.isArray(parsed)) {
                        skillsList = parsed;
                    }
                } catch {
                    // Fallback for malformed JSON-like strings
                    skillsList = [{ icon: Code, name: "Expertise", description: skillString }];
                }
            } else {
                // Handle plain text skills (comma separated or description)
                skillsList = [{ icon: Code, name: "Expertise", description: skillString }];
            }
        }
    }

    // Parse certifications
    const certificationsList = content.certifications || defaultCertifications;

    return (
        <div className="container-custom py-10 space-y-20">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{content.heroBadge || "Full-Stack Developer"}</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold">
                        {content.heroTitle ? (
                            content.heroTitle.includes("Milton Raj") ? (
                                <>
                                    {content.heroTitle.split("Milton Raj")[0]}
                                    <span className="gradient-text">Milton Raj</span>
                                    {content.heroTitle.split("Milton Raj")[1]}
                                </>
                            ) : (
                                content.heroTitle
                            )
                        ) : (
                            <>Hi, I'm <span className="gradient-text">Milton Raj</span></>
                        )}
                    </h1>

                    {/* Subtitle with Rich Text Support */}
                    <div className="text-xl text-muted-foreground leading-relaxed prose prose-invert max-w-none">
                        {content.heroSubtitle1 ? (
                            <div dangerouslySetInnerHTML={{ __html: content.heroSubtitle1 }} />
                        ) : (
                            "Building scalable apps for web & mobile"
                        )}
                    </div>

                    {/* Bio Paragraphs REMOVED as per request */}

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link href="/projects">
                            <Button variant="gradient" size="lg">
                                View My Work
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" size="lg">
                                Get in Touch
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="relative w-full aspect-square rounded-3xl overflow-hidden glass-strong shadow-premium-lg">
                        {content.profileImage ? (
                            <img
                                src={content.profileImage}
                                alt="Profile"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                                <div className="text-center space-y-4">
                                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary">
                                        <span className="text-6xl font-bold text-white">M</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        Add your professional photo here
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Floating Stats */}
                    <div className="absolute -bottom-6 -right-6 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border-2 border-white/60">
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 drop-shadow-sm">{content.experienceYears || "11+"}</div>
                            <div className="text-sm text-gray-800 font-semibold tracking-wide">Years Experience</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Skills Section */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        {content.skillsTitle || (
                            <>My <span className="gradient-text">Expertise</span></>
                        )}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {content.skillsSubtitle || "Specialized skills and technologies I use to build exceptional digital products"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {skillsList.map((skill: any, index: number) => {
                        // Map icon name to component if stored as string, or use default
                        const IconComponent = skill.icon || Code;

                        return (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:scale-105 transition-all duration-300 hover-glow-primary">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                            {/* If icon is a component (from default list), render it. If it's a string name (from DB), we might need a lookup map, but for now let's just use a default icon or try to render if it's a component */}
                                            <Code className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold">{skill.name}</h3>
                                            <p className="text-sm text-muted-foreground">{skill.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Certifications */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        {content.certificationsTitle || (
                            <>Certifications & <span className="gradient-text">Achievements</span></>
                        )}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {certificationsList.map((cert: string, index: number) => (
                        <motion.div
                            key={cert}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="glass hover-glow-secondary transition-all duration-300">
                                <CardContent className="p-6 flex items-center space-x-4">
                                    <Award className="w-8 h-8 text-secondary flex-shrink-0" />
                                    <span className="font-medium">{cert}</span>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="glass-strong rounded-3xl p-12 md:p-16 text-center space-y-8 shadow-premium-lg">
                <h2 className="text-4xl md:text-5xl font-bold">
                    Let's Work <span className="gradient-text">Together</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
                <Link href="/contact">
                    <Button variant="gradient" size="xl">
                        Start a Conversation
                    </Button>
                </Link>
            </section>
        </div>
    );
}
