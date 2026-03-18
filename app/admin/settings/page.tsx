"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Save, Eye, EyeOff, Layout } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type NavItemKey = "home" | "projects" | "about" | "what-i-offer" | "blogs" | "contact";

const NAV_LABELS: Record<NavItemKey, string> = {
    home: "Home",
    projects: "Projects",
    about: "About",
    "what-i-offer": "What I Offer",
    blogs: "Blogs",
    contact: "Contact",
};

export default function SettingsPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [navVisibility, setNavVisibility] = useState<Record<NavItemKey, boolean>>({
        home: true,
        projects: true,
        about: true,
        "what-i-offer": true,
        blogs: true,
        contact: true,
    });
    const [navLoading, setNavLoading] = useState(true);
    const [savingNav, setSavingNav] = useState<NavItemKey | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetch("/api/admin/nav-visibility")
            .then((r) => r.json())
            .then((data) => setNavVisibility(data))
            .catch(() => {})
            .finally(() => setNavLoading(false));
    }, []);

    const handleNavToggle = async (item: NavItemKey) => {
        const newValue = !navVisibility[item];
        setSavingNav(item);

        try {
            const res = await fetch("/api/admin/nav-visibility", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item, enabled: newValue }),
            });

            if (!res.ok) throw new Error();

            setNavVisibility((prev) => ({ ...prev, [item]: newValue }));
            toast({
                title: "Updated",
                description: `${NAV_LABELS[item]} is now ${newValue ? "visible" : "hidden"} in the navigation.`,
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to update navigation visibility.",
                variant: "destructive",
            });
        } finally {
            setSavingNav(null);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            return;
        }

        if (newPassword.length < 8) {
            toast({
                title: "Error",
                description: "Password must be at least 8 characters long.",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch('/api/admin/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            toast({
                title: "Success",
                description: "Password has been updated successfully! Please log in again with your new password.",
            });

            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                window.location.href = '/admin/login';
            }, 2000);
        } catch (error) {
            console.error("Error updating password:", error);
            toast({
                title: "Error",
                description: "Failed to update password. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-2xl">
                <div>
                    <h1 className="text-4xl font-bold mb-2">
                        Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your admin account settings
                    </p>
                </div>

                {/* Navigation Visibility Card */}
                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Layout className="w-5 h-5 mr-2" />
                            Navigation Visibility
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Toggle which pages appear in the site navigation menu.
                        </p>
                    </CardHeader>
                    <CardContent>
                        {navLoading ? (
                            <p className="text-sm text-muted-foreground">Loading...</p>
                        ) : (
                            <div className="space-y-3">
                                {(Object.keys(NAV_LABELS) as NavItemKey[]).map((item) => {
                                    const enabled = navVisibility[item];
                                    const isSavingThis = savingNav === item;
                                    return (
                                        <div
                                            key={item}
                                            className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/5 border border-white/10"
                                        >
                                            <div className="flex items-center gap-3">
                                                {enabled ? (
                                                    <Eye className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                                )}
                                                <span className={`text-sm font-medium ${enabled ? "" : "text-muted-foreground"}`}>
                                                    {NAV_LABELS[item]}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleNavToggle(item)}
                                                disabled={isSavingThis}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                                                    enabled ? "bg-primary" : "bg-white/20"
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                        enabled ? "translate-x-6" : "translate-x-1"
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Password Change Card */}
                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Lock className="w-5 h-5 mr-2" />
                            Change Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="new" className="text-sm font-medium">
                                    New Password
                                </label>
                                <Input
                                    id="new"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 8 characters long
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirm" className="text-sm font-medium">
                                    Confirm New Password
                                </label>
                                <Input
                                    id="confirm"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <p className="text-sm text-blue-200">
                                    <strong>Note:</strong> Your password will be updated immediately. You'll be redirected to the login page to sign in with your new password.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                size="lg"
                                disabled={isSaving}
                            >
                                {isSaving ? "Updating..." : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Update Password
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
