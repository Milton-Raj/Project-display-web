"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Code2 } from "lucide-react";

export default function TechStackChart({ data }: { data: any[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <Card className="shadow-lg border-none bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 h-full overflow-visible relative z-10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Code2 className="w-5 h-5 text-purple-500" />
                        Top Technologies
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} className="stroke-muted/20" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    tick={{ fontSize: 11, fill: 'currentColor' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(20, 20, 20, 0.95)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                                        color: '#fff',
                                        zIndex: 1000
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45 + 200}, 70%, 50%)`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
