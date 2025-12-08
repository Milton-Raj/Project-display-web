"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIME_RANGES = [
    { label: '7D', value: '7d' },
    { label: '15D', value: '15d' },
    { label: '30D', value: '30d' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
];

export default function VisitorChart({ data: initialData }: { data: any[] }) {
    const [timeRange, setTimeRange] = useState('7d');
    const [chartData, setChartData] = useState(initialData);

    // Simulate data fetching based on range
    useEffect(() => {
        const generateData = () => {
            let dataPoints = 7;
            let labels: string[] = [];

            switch (timeRange) {
                case '7d':
                    dataPoints = 7;
                    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    break;
                case '15d':
                    dataPoints = 15;
                    labels = Array.from({ length: 15 }, (_, i) => `${i + 1}`);
                    break;
                case '30d':
                    dataPoints = 10; // Condensed
                    labels = ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'];
                    break;
                case '6m':
                    dataPoints = 6;
                    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                    break;
                case '1y':
                    dataPoints = 12;
                    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    break;
            }

            return labels.map(label => ({
                name: label,
                visits: Math.floor(Math.random() * 100) + 20,
                views: Math.floor(Math.random() * 200) + 50,
            }));
        };

        setChartData(generateData());
    }, [timeRange]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="col-span-4 shadow-lg border-none bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Visitor Engagement
                    </CardTitle>
                    <div className="flex items-center bg-muted/50 rounded-lg p-1">
                        {TIME_RANGES.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => setTimeRange(range.value)}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                    timeRange === range.value
                                        ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(20, 20, 20, 0.95)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorVisits)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#82ca9d"
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
