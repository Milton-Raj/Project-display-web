"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Eye, Trophy } from "lucide-react";
import Image from "next/image";

export default function TopProjects({ projects }: { projects: any[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <Card className="shadow-lg border-none bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Top Performing Projects
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {projects.map((project, index) => (
                            <div key={project.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className={`
                                    relative font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full border
                                    ${index === 0 ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                                        index === 1 ? 'bg-slate-300/20 text-slate-300 border-slate-300/50' :
                                            index === 2 ? 'bg-amber-700/20 text-amber-700 border-amber-700/50' :
                                                'bg-muted text-muted-foreground border-transparent'}
                                `}>
                                    #{index + 1}
                                </div>
                                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-border">
                                    {project.thumbnail ? (
                                        <Image
                                            src={project.thumbnail}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-xs">No Img</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{project.title}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {Array.isArray(project.category) ? project.category.join(', ') : project.category}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-sm font-medium text-primary">
                                    <Eye className="w-4 h-4" />
                                    {project.views.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
