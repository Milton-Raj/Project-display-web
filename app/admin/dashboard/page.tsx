import { getAllProjects, getAllContacts } from "@/lib/database";
import { StatsCard } from "@/components/admin/StatsCard";
import { FolderGit2, Mail, Eye, MousePointerClick } from "lucide-react";
import VisitorChart from "@/components/admin/dashboard/VisitorChart";
import TopProjects from "@/components/admin/dashboard/TopProjects";
import RecentInquiries from "@/components/admin/dashboard/RecentInquiries";
import CategoryDistribution from "@/components/admin/dashboard/CategoryDistribution";
import TechStackChart from "@/components/admin/dashboard/TechStackChart";
import { getVisitorData, getProjectStats, getRecentInquiries } from "@/lib/analytics";
import { AdminLayout } from "@/components/admin/AdminLayout";
import DashboardActions from "@/components/admin/dashboard/DashboardActions";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const projects = await getAllProjects();
    const contacts = await getAllContacts();

    // Calculate stats
    const totalProjects = projects.length;
    const totalContacts = contacts.length;

    // Calculate total views
    const totalViews = projects.reduce((acc: number, curr: any) => acc + (curr.views || 0), 0);

    // Calculate engagement rate (Inquiries / Total Views)
    const engagementRate = totalViews > 0
        ? ((totalContacts / totalViews) * 100).toFixed(1) + "%"
        : "0%";

    // Get Analytics Data
    const visitorData = getVisitorData(); // Still returns empty/zero data as we don't have historical tracking yet
    const { topProjects, categoryData, techData } = getProjectStats(projects);
    const recentContacts = getRecentInquiries(contacts);

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                            Dashboard Overview
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Welcome back! Here's what's happening with your portfolio.
                        </p>
                    </div>
                    <DashboardActions
                        data={{
                            metrics: {
                                totalProjects,
                                totalViews,
                                totalContacts,
                                engagementRate
                            },
                            topProjects,
                            recentContacts
                        }}
                    />
                </div>

                {/* Key Metrics - TRENDS REMOVED (User Request: No Dummy Data) */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Projects"
                        value={totalProjects}
                        icon={<FolderGit2 className="w-7 h-7 text-primary" />}
                    />
                    <StatsCard
                        title="Total Views"
                        value={totalViews.toLocaleString()}
                        icon={<Eye className="w-7 h-7 text-primary" />}
                    />
                    <StatsCard
                        title="Inquiries"
                        value={totalContacts}
                        icon={<Mail className="w-7 h-7 text-primary" />}
                    />
                    <StatsCard
                        title="Engagement Rate"
                        value={engagementRate}
                        icon={<MousePointerClick className="w-7 h-7 text-primary" />}
                    />
                </div>

                {/* Main Analytics Section */}
                <div className="grid gap-6 md:grid-cols-7">
                    {/* Visitor Chart - Takes up 4 columns */}
                    <div className="md:col-span-4">
                        <VisitorChart data={visitorData} />
                    </div>

                    {/* Top Projects - Takes up 3 columns */}
                    <div className="md:col-span-3">
                        <TopProjects projects={topProjects} />
                    </div>
                </div>

                {/* Secondary Analytics Section */}
                <div className="grid gap-6 md:grid-cols-3">
                    <CategoryDistribution data={categoryData} />
                    <TechStackChart data={techData} />
                    <div className="print:hidden">
                        <RecentInquiries contacts={recentContacts} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
