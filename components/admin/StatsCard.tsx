"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={cn("hover-glow-primary transition-smooth", className)}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground font-medium">{title}</p>
                            <p className="text-3xl font-bold gradient-text-primary">{value}</p>
                            {trend && (
                                <p className={cn(
                                    "text-sm font-medium",
                                    trend.isPositive ? "text-success" : "text-destructive"
                                )}>
                                    {trend.isPositive ? "+" : ""}{trend.value}%
                                </p>
                            )}
                        </div>
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            {icon}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
