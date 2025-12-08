"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface DashboardActionsProps {
    data: {
        metrics: {
            totalProjects: number;
            totalViews: number;
            totalContacts: number;
            engagementRate: string;
        };
        topProjects: any[];
        recentContacts: any[];
    };
}

export default function DashboardActions({ data }: DashboardActionsProps) {
    const handleDownloadCSV = (e: React.MouseEvent) => {
        e.preventDefault();
        const date = format(new Date(), "yyyy-MM-dd_HH-mm-ss");

        // Prepare CSV Content
        const rows = [
            ["ADMIN DASHBOARD REPORT"],
            [`Generated on: ${format(new Date(), "PPP p")}`],
            [],
            ["SUMMARY METRICS"],
            ["Metric", "Value"],
            ["Total Projects", data.metrics.totalProjects],
            ["Total Views", data.metrics.totalViews],
            ["Total Inquiries", data.metrics.totalContacts],
            ["Engagement Rate", data.metrics.engagementRate],
            [],
            ["TOP PERFORMING PROJECTS"],
            ["Rank", "Project Name", "Views", "Category"],
            ...data.topProjects.map((p, i) => [
                i + 1,
                p.title,
                p.views,
                Array.isArray(p.category) ? p.category.join(", ") : p.category
            ])
        ];

        const csvContent = rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        const fileName = `dashboard_report_${date}.csv`;

        link.href = url;
        link.download = fileName;
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    const handlePrintPDF = () => {
        window.print();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 print:hidden">
                    <Download className="w-4 h-4" />
                    Download Report
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadCSV} className="cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrintPDF} className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    Save as PDF
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
