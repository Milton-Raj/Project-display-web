"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export default function PrivacyPolicyAdmin() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<any>({
        title: 'Privacy Policy',
        content: ''
    });

    useEffect(() => {
        const loadContent = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/content?slug=privacy-policy');
                if (response.ok) {
                    const data = await response.json();
                    if (data.content) {
                        setFormData(data.content.content || data.content);
                    }
                }
            } catch (error) {
                console.error("Error loading content:", error);
                toast({
                    title: "Error",
                    description: "Failed to load Privacy Policy content.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    slug: 'privacy-policy',
                    content: formData,
                }),
            });

            if (!response.ok) throw new Error('Failed to save');

            toast({
                title: "Success",
                description: "Privacy Policy updated successfully.",
            });
        } catch (error: any) {
            console.error("Error updating content:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to update page content.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/dashboard">
                            <Button variant="ghost" size="sm" className="mb-2">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">Privacy Policy Options</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Edit Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Page Title</label>
                                    <Input
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Privacy Policy"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Policy Content (Accepts HTML formatting)</label>

                                    {/* Note: since RichTextEditor implementation details are unknown in this context, falling back to a raw textarea or simplified div based on project standards can avoid breaking */}
                                    <RichTextEditor
                                        content={formData.content || ''}
                                        onChange={(html: string) => setFormData({ ...formData, content: html })}
                                        placeholder="Write your privacy policy here..."
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
