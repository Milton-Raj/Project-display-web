"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    project: any;
    index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    const categories = Array.isArray(project.category) ? project.category : [project.category];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            <Card className="group cursor-pointer overflow-hidden h-full hover:scale-105 transition-all duration-300 flex flex-col border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20">
                {/* Thumbnail */}
                <div className="relative h-56 overflow-hidden bg-muted">
                    {project.thumbnail ? (
                        <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                            <span className="text-4xl font-bold gradient-text">
                                {project.title.charAt(0)}
                            </span>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                    {/* Featured Badge */}
                    {project.featured && (
                        <div className="absolute top-3 left-3 z-10">
                            <Badge className="bg-yellow-500/90 hover:bg-yellow-500 text-black font-bold border-none shadow-lg backdrop-blur-md">
                                Featured
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between relative">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-wrap gap-2">
                                {categories.slice(0, 2).map((cat: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-[10px] font-bold bg-primary/10 text-primary border-none px-2 py-0.5 uppercase tracking-wider">
                                        {cat.replace(/-/g, ' ')}
                                    </Badge>
                                ))}
                                {categories.length > 2 && (
                                    <Badge variant="secondary" className="text-[10px] font-bold bg-muted text-muted-foreground border-none px-2 py-0.5">
                                        +{categories.length - 2}
                                    </Badge>
                                )}
                            </div>
                            <Badge variant={project.status === 'live' ? 'default' : 'outline'} className={cn(
                                "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-none",
                                project.status === 'live'
                                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                    : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                            )}>
                                <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse",
                                    project.status === 'live' ? "bg-green-500" : "bg-orange-500"
                                )} />
                                {project.status === 'live' ? 'Live' : 'Upcoming'}
                            </Badge>
                        </div>

                        <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                            {project.title}
                        </h3>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50">
                        <Link href={`/projects/${project.slug}`} className="block w-full">
                            <Button className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg transition-all duration-300 hover:shadow-primary/25 h-10 rounded-lg">
                                <span className="relative z-10 flex items-center justify-center gap-2 font-semibold text-sm">
                                    View Details
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
