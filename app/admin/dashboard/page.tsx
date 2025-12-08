
import { getProjects, getContacts } from "@/lib/json-db";
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

export default async function DashboardPage() {
    const projects = await getProjects();
    const contacts = await getContacts();

    // Calculate stats
    const totalProjects = projects.length;
    const totalContacts = contacts.length;
    const unreadContacts = contacts.filter((c: any) => c.status === 'unread').length;

    // Get Analytics Data
    const visitorData = getVisitorData();
    const { topProjects, categoryData, techData } = getProjectStats(projects);
    const recentContacts = getRecentInquiries(contacts);

    // Mock total views for now
    const totalViews = projects.reduce((acc: number, curr: any) => acc + (curr.views || 0), 0) + 1250; // Base + mock

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
                                engagementRate: "4.8%"
                            },
                            topProjects,
                            recentContacts
                        }}
                    />
                </div>

                {/* Key Metrics */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Projects"
                        value={totalProjects}
                        icon={<FolderGit2 className="w-7 h-7 text-primary" />}
                        trend={{ value: 2, isPositive: true }}
                    />
                    <StatsCard
                        title="Total Views"
                        value={totalViews.toLocaleString()}
                        icon={<Eye className="w-7 h-7 text-primary" />}
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatsCard
                        title="Inquiries"
                        value={totalContacts}
                        icon={<Mail className="w-7 h-7 text-primary" />}
                        trend={{ value: 1, isPositive: true }}
                    />
                    <StatsCard
                        title="Engagement Rate"
                        value="4.8%"
                        icon={<MousePointerClick className="w-7 h-7 text-primary" />}
                        trend={{ value: 0.5, isPositive: true }}
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
