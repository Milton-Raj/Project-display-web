"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    Mail,
    LogOut,
    Menu,
    X,
    FileText,
    ChevronDown,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
    children: ReactNode;
}

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    {
        name: "Website Pages",
        icon: FileText,
        submenu: [
            { name: "Home Page", href: "/admin/pages/home" },
            { name: "About Page", href: "/admin/pages/about" },
            { name: "What I Offer", href: "/admin/pages/what-i-offer" },
            { name: "Contact Page", href: "/admin/pages/contact" },
        ]
    },
    { name: "Contacts", href: "/admin/contacts", icon: Mail },
];

function SidebarItem({ item, pathname, setSidebarOpen }: { item: any, pathname: string, setSidebarOpen: (open: boolean) => void }) {
    const isSubmenuActive = item.submenu?.some((sub: any) => pathname === sub.href);
    const [isOpen, setIsOpen] = useState(isSubmenuActive);

    // Update open state when pathname changes to ensure it stays open if active
    useEffect(() => {
        if (isSubmenuActive) {
            setIsOpen(true);
        }
    }, [pathname, isSubmenuActive]);

    if (item.submenu) {
        return (
            <div className="space-y-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-smooth",
                        isSubmenuActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                >
                    <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                    </div>
                    <div className={cn("transition-transform duration-200", isOpen ? "rotate-180" : "")}>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </button>

                {isOpen && (
                    <div className="pl-12 space-y-1">
                        {item.submenu.map((sub: any) => {
                            const isSubActive = pathname === sub.href;
                            return (
                                <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "block px-4 py-2 rounded-lg text-sm transition-smooth",
                                        isSubActive
                                            ? "text-primary bg-primary/10 font-medium"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {sub.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    const isActive = item.href ? (pathname === item.href || pathname.startsWith(item.href + "/")) : false;
    return (
        <Link
            href={item.href || '#'}
            onClick={() => setSidebarOpen(false)}
            className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-smooth",
                isActive
                    ? "bg-primary/20 text-primary border border-primary/30 glow-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
        >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
        </Link>
    );
}

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/admin/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar for desktop */}
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow glass-strong border-r border-white/10">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-6 border-b border-white/10">
                        <Link href="/admin/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary">
                                <span className="text-sm font-bold text-white">C</span>
                            </div>
                            <span className="text-lg font-bold gradient-text-primary">Admin</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => (
                            <SidebarItem
                                key={item.name}
                                item={item}
                                pathname={pathname}
                                setSidebarOpen={setSidebarOpen}
                            />
                        ))}
                    </nav>

                    {/* Settings & Logout */}
                    <div className="p-4 border-t border-white/10 space-y-2">
                        <Link href="/admin/settings">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <Settings className="w-5 h-5 mr-3" />
                                Settings
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setShowLogoutConfirm(true)}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 w-64 glass-strong border-r border-white/10 z-50">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
                                <Link href="/admin/dashboard" className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">C</span>
                                    </div>
                                    <span className="text-lg font-bold gradient-text-primary">Admin</span>
                                </Link>
                                <button onClick={() => setSidebarOpen(false)}>
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-4 py-6 space-y-2">
                                {navigation.map((item) => (
                                    <SidebarItem
                                        key={item.name}
                                        item={item}
                                        pathname={pathname}
                                        setSidebarOpen={setSidebarOpen}
                                    />
                                ))}
                            </nav>

                            {/* Settings & Logout */}
                            <div className="p-4 border-t border-white/10 space-y-2">
                                <Link href="/admin/settings">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <Settings className="w-5 h-5 mr-3" />
                                        Settings
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => {
                                        setSidebarOpen(false);
                                        setShowLogoutConfirm(true);
                                    }}
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="md:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-40 glass-strong border-b border-white/10">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-white/5"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex-1 md:flex-none">
                            <h2 className="text-xl font-bold">
                                {navigation.find(item => item.href && pathname.startsWith(item.href))?.name ||
                                    navigation.find(item => item.submenu?.some(sub => pathname === sub.href))?.name ||
                                    "Admin"}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href="/" target="_blank">
                                <Button variant="outline" size="sm">
                                    View Site
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Logout Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Logout"
                description="Are you sure you want to logout?"
                confirmText="Logout"
                variant="default"
            />
        </div>
    );
}
