"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

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

            // Reset form
            setNewPassword("");
            setConfirmPassword("");

            // Redirect to login after 2 seconds
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
