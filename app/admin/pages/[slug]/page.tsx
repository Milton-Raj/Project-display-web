"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2, X, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function PageEditor() {
    const params = useParams();
    const slug = params?.slug as string;
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        const loadContent = async () => {
            if (!slug) return;

            try {
                setIsLoading(true);
                const response = await fetch(`/api/content?slug=${slug}`);
                const data = await response.json();

                if (data.content) {
                    setFormData(data.content);
                } else {
                    // Default initial state based on slug
                    if (slug === 'home') {
                        setFormData({
                            heroTitle: "Building Digital Experiences That Matter",
                            heroSubtitle: "Full-stack developer specializing in building exceptional digital experiences.",
                            ctaTitle: "Ready to start your project?",
                            ctaDescription: "Let's collaborate to bring your vision to life.",
                        });
                    } else if (slug === 'about') {
                        setFormData({
                            bio: "I am a passionate developer...",
                            skills: "React, Next.js, TypeScript, Node.js",
                        });
                    } else if (slug === 'contact') {
                        setFormData({
                            email: "contact@example.com",
                            phone: "+1234567890",
                            address: "123 Tech Street",
                        });
                    } else if (slug === 'what-i-offer') {
                        setFormData({
                            heroTitle: "I build software, train teams, and help job seekers upgrade their career.",
                            heroSubtitle: "Book a Call | WhatsApp Me",
                            services: [
                                {
                                    title: "Custom Web & Mobile App Development",
                                    description: "Build scalable, high-performance applications tailored to your business needs.",
                                    provides: "Custom-built web apps\nCustom-built mobile apps (Android / iOS)\nReady-made business apps\nFull support until deployment",
                                    audience: "Entrepreneurs launching a business\nSMEs scaling operations"
                                },
                                {
                                    title: "Interview Training for Students & Employees",
                                    description: "Result-oriented coaching to crack technical and HR rounds with confidence.",
                                    provides: "Interview strategy coaching\nTechnical + HR practice rounds\nCommunication training\nReal-world mock scenarios",
                                    audience: "Freshers & Job Seekers\nProfessionals switching careers"
                                },
                                {
                                    title: "Resume / Job Portal / LinkedIn Optimization",
                                    description: "Stand out to recruiters with ATS-friendly resumes and optimized profiles.",
                                    provides: "ATS-friendly resume writing\nLinkedIn profile optimization\nJob portal complete setup\nKeyword strategy for search",
                                    audience: "Job Seekers\nStudents preparing for placements"
                                }
                            ],
                            whyChooseMe: [
                                { title: "Hands-on Experience", desc: "Real-world expertise in software development and delivery." },
                                { title: "500+ Trained", desc: "Helped hundreds of students and employees achieve their career goals." },
                                { title: "Full Support", desc: "From the first call to final delivery, I'm with you every step." },
                                { title: "Transparent Pricing", desc: "No hidden costs. Zero outsourcing. You work directly with me." },
                                { title: "Real Results", desc: "Proven track record of successful apps and hired candidates." },
                                { title: "Custom Solutions", desc: "Tailored strategies and code, not generic templates." }
                            ],
                            showcaseTitle: "Proof of Work",
                            showcaseSubtitle: "Don't just take my word for it. See the results.",
                            showcaseItems: [
                                {
                                    title: "Business Apps Delivered",
                                    description: "Custom solutions helping businesses scale operations efficiently.",
                                    image: ""
                                },
                                {
                                    title: "Career Transformations",
                                    description: "Students placed in top companies after training and profile optimization.",
                                    image: ""
                                }
                            ],
                            ctaTitle: "Ready to Level Up?",
                            ctaDescription: "Whether you need a custom app, interview training, or a career profile makeover, I'm here to help you succeed."
                        });
                    }
                }
            } catch (error) {
                console.error("Error loading content:", error);
                toast({
                    title: "Error",
                    description: "Failed to load page content.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, [slug, toast]);

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
                    slug,
                    content: formData,
                }),
            });

            if (!response.ok) throw new Error('Failed to save');

            toast({
                title: "Success",
                description: "Page content updated successfully.",
            });
        } catch (error) {
            console.error("Error updating content:", error);
            toast({
                title: "Error",
                description: "Failed to update page content.",
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
                        <Link href="/admin/pages">
                            <Button variant="ghost" size="sm" className="mb-2">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Pages
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold capitalize">{slug} Page Content</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Edit Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {slug === 'home' && (
                                <>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Hero Section</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Badge Text</label>
                                            <Input
                                                value={formData.heroBadge || ''}
                                                onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                                                placeholder="e.g., Premium Digital Experiences"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Hero Title</label>
                                            <Input
                                                value={formData.heroTitle || ''}
                                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                                placeholder="e.g., Building Scalable Apps"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Hero Subtitle</label>
                                            <Textarea
                                                value={formData.heroSubtitle || ''}
                                                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                                placeholder="e.g., Transforming innovative ideas..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">Hero Stats</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[0, 1, 2].map((index) => (
                                                <Card key={index} className="bg-card/50 border-white/10">
                                                    <CardContent className="space-y-3 pt-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Value {index + 1}</label>
                                                            <Input
                                                                value={formData.heroStats?.[index]?.value || ''}
                                                                onChange={(e) => {
                                                                    const newStats = [...(formData.heroStats || [])];
                                                                    if (!newStats[index]) newStats[index] = { value: '', label: '' };
                                                                    newStats[index].value = e.target.value;
                                                                    setFormData({ ...formData, heroStats: newStats });
                                                                }}
                                                                placeholder="e.g., 10+"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Label {index + 1}</label>
                                                            <Input
                                                                value={formData.heroStats?.[index]?.label || ''}
                                                                onChange={(e) => {
                                                                    const newStats = [...(formData.heroStats || [])];
                                                                    if (!newStats[index]) newStats[index] = { value: '', label: '' };
                                                                    newStats[index].label = e.target.value;
                                                                    setFormData({ ...formData, heroStats: newStats });
                                                                }}
                                                                placeholder="e.g., Projects Delivered"
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">Featured Projects Section</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Section Title</label>
                                            <Input
                                                value={formData.featuredTitle || ''}
                                                onChange={(e) => setFormData({ ...formData, featuredTitle: e.target.value })}
                                                placeholder="e.g., Featured Projects"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Section Subtitle</label>
                                            <Textarea
                                                value={formData.featuredSubtitle || ''}
                                                onChange={(e) => setFormData({ ...formData, featuredSubtitle: e.target.value })}
                                                placeholder="e.g., Explore some of my best work..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">CTA Section</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">CTA Title</label>
                                            <Input
                                                value={formData.ctaTitle || ''}
                                                onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
                                                placeholder="e.g., Ready to Build Something Amazing?"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">CTA Description</label>
                                            <Textarea
                                                value={formData.ctaDescription || ''}
                                                onChange={(e) => setFormData({ ...formData, ctaDescription: e.target.value })}
                                                placeholder="e.g., Let's collaborate..."
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {slug === 'about' && (
                                <>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Hero Section</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Badge Text</label>
                                            <Input
                                                value={formData.heroBadge || ''}
                                                onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                                                placeholder="e.g., Full-Stack Developer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input
                                                value={formData.heroTitle || ''}
                                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                                placeholder="e.g., Hi, I'm Milton Raj"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Subtitle 1 (Bold)</label>
                                            <RichTextEditor
                                                value={formData.heroSubtitle1 || ''}
                                                onChange={(val) => setFormData({ ...formData, heroSubtitle1: val })}
                                                placeholder="e.g., Building scalable apps..."
                                            />
                                        </div>

                                        {/* Bio Paragraphs REMOVED as per request */}

                                        <div className="space-y-4">
                                            <label className="text-sm font-medium">Profile Image</label>

                                            {/* Image Preview */}
                                            {formData.profileImage && (
                                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-lg group">
                                                    <img
                                                        src={formData.profileImage}
                                                        alt="Profile preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setFormData({ ...formData, profileImage: "" });
                                                            const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
                                                            if (fileInput) fileInput.value = "";
                                                        }}
                                                        className="absolute top-1 right-1 p-1.5 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remove image"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Upload Section */}
                                            <div className="p-4 rounded-lg border border-dashed border-white/20 space-y-3">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={isUploading}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        try {
                                                            setIsUploading(true);
                                                            const storageRef = ref(storage, `content/${Date.now()}-${file.name}`);
                                                            const snapshot = await uploadBytes(storageRef, file);
                                                            const downloadURL = await getDownloadURL(snapshot.ref);

                                                            setFormData({ ...formData, profileImage: downloadURL });
                                                            toast({
                                                                title: "Success",
                                                                description: "Image uploaded successfully",
                                                            });
                                                        } catch (error) {
                                                            console.error("Upload failed:", error);
                                                            toast({
                                                                title: "Error",
                                                                description: "Failed to upload image",
                                                                variant: "destructive",
                                                            });
                                                        } finally {
                                                            setIsUploading(false);
                                                        }
                                                    }}
                                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                />
                                                <div className="text-center text-xs text-muted-foreground">- OR -</div>
                                                <Input
                                                    value={formData.profileImage || ''}
                                                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                                                    placeholder="Enter image URL directly"
                                                    className="h-9 text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Years of Experience</label>
                                            <Input
                                                value={formData.experienceYears || ''}
                                                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                                                placeholder="e.g., 5+"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">Skills Section</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Section Title</label>
                                            <Input
                                                value={formData.skillsTitle || ''}
                                                onChange={(e) => setFormData({ ...formData, skillsTitle: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Section Subtitle</label>
                                            <Textarea
                                                value={formData.skillsSubtitle || ''}
                                                onChange={(e) => setFormData({ ...formData, skillsSubtitle: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium">Skills List</label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];
                                                        setFormData({
                                                            ...formData,
                                                            skills: [...currentSkills, { name: "", description: "" }]
                                                        });
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Skill
                                                </Button>
                                            </div>
                                            <div className="space-y-4">
                                                {(Array.isArray(formData.skills) ? formData.skills : []).map((skill: any, index: number) => (
                                                    <Card key={index} className="bg-card/50 border-white/10">
                                                        <CardContent className="p-4 flex gap-4 items-start">
                                                            <div className="flex-1 space-y-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-xs text-muted-foreground">Skill Name</label>
                                                                    <Input
                                                                        value={skill.name || ''}
                                                                        onChange={(e) => {
                                                                            const newSkills = [...(Array.isArray(formData.skills) ? formData.skills : [])];
                                                                            newSkills[index] = { ...skill, name: e.target.value };
                                                                            setFormData({ ...formData, skills: newSkills });
                                                                        }}
                                                                        placeholder="e.g. Web Development"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-xs text-muted-foreground">Description/Technologies</label>
                                                                    <Input
                                                                        value={skill.description || ''}
                                                                        onChange={(e) => {
                                                                            const newSkills = [...(Array.isArray(formData.skills) ? formData.skills : [])];
                                                                            newSkills[index] = { ...skill, description: e.target.value };
                                                                            setFormData({ ...formData, skills: newSkills });
                                                                        }}
                                                                        placeholder="e.g. React, Next.js, Node.js"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
                                                                onClick={() => {
                                                                    const newSkills = [...(Array.isArray(formData.skills) ? formData.skills : [])];
                                                                    newSkills.splice(index, 1);
                                                                    setFormData({ ...formData, skills: newSkills });
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                                {(!formData.skills || formData.skills.length === 0) && (
                                                    <div className="text-center p-8 border border-dashed border-white/10 rounded-lg text-muted-foreground">
                                                        No skills added yet. Click "Add Skill" to start.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">Certifications</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Section Title</label>
                                            <Input
                                                value={formData.certificationsTitle || ''}
                                                onChange={(e) => setFormData({ ...formData, certificationsTitle: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium">Certifications List</label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const currentCerts = Array.isArray(formData.certifications) ? formData.certifications :
                                                            (typeof formData.certifications === 'string' && formData.certifications ? formData.certifications.split(',').map((s: string) => s.trim()) : []);

                                                        setFormData({
                                                            ...formData,
                                                            certifications: [...currentCerts, ""]
                                                        });
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Certification
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {(() => {
                                                    // Normalize certifications to array for rendering
                                                    let certs = [];
                                                    if (Array.isArray(formData.certifications)) {
                                                        certs = formData.certifications;
                                                    } else if (typeof formData.certifications === 'string' && formData.certifications) {
                                                        certs = formData.certifications.split(',').map((s: string) => s.trim()).filter((s: string) => s);
                                                    }

                                                    return certs.map((cert: string, index: number) => (
                                                        <div key={index} className="flex gap-2">
                                                            <Input
                                                                value={cert}
                                                                onChange={(e) => {
                                                                    const newCerts = [...certs];
                                                                    newCerts[index] = e.target.value;
                                                                    setFormData({ ...formData, certifications: newCerts });
                                                                }}
                                                                placeholder="Certification Name"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                onClick={() => {
                                                                    const newCerts = [...certs];
                                                                    newCerts.splice(index, 1);
                                                                    setFormData({ ...formData, certifications: newCerts });
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ));
                                                })()}

                                                {(!formData.certifications || formData.certifications.length === 0) && (
                                                    <div className="text-center p-8 border border-dashed border-white/10 rounded-lg text-muted-foreground">
                                                        No certifications added yet.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {slug === 'contact' && (
                                <>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Header Section</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input
                                                value={formData.headerTitle || ''}
                                                onChange={(e) => setFormData({ ...formData, headerTitle: e.target.value })}
                                                placeholder="e.g., Get in Touch"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Subtitle</label>
                                            <Textarea
                                                value={formData.headerSubtitle || ''}
                                                onChange={(e) => setFormData({ ...formData, headerSubtitle: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">Contact Information</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email</label>
                                            <Input
                                                value={formData.email || ''}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Phone</label>
                                            <Input
                                                value={formData.phone || ''}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">WhatsApp</label>
                                            <Input
                                                value={formData.whatsapp || ''}
                                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">LinkedIn URL</label>
                                            <Input
                                                value={formData.linkedin || ''}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Instagram Handle</label>
                                            <Input
                                                value={formData.instagram || ''}
                                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                                placeholder="username_only"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">Response Time Card</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input
                                                value={formData.responseTimeTitle || ''}
                                                onChange={(e) => setFormData({ ...formData, responseTimeTitle: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Description</label>
                                            <Textarea
                                                value={formData.responseTimeDescription || ''}
                                                onChange={(e) => setFormData({ ...formData, responseTimeDescription: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {slug === 'what-i-offer' && (
                                <>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Hero Section</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Main Heading</label>
                                            <Input
                                                value={formData.heroTitle || ''}
                                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">Service Blocks (3 Tables)</h3>
                                        <div className="grid gap-6">
                                            {(formData.services || []).map((service: any, index: number) => (
                                                <Card key={index} className="bg-card/50 border-white/10">
                                                    <CardHeader>
                                                        <CardTitle className="text-base">Service {index + 1}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Title</label>
                                                            <Input
                                                                value={service.title || ''}
                                                                onChange={(e) => {
                                                                    const newServices = [...(formData.services || [])];
                                                                    newServices[index] = { ...service, title: e.target.value };
                                                                    setFormData({ ...formData, services: newServices });
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Short Description</label>
                                                            <Input
                                                                value={service.description || ''}
                                                                onChange={(e) => {
                                                                    const newServices = [...(formData.services || [])];
                                                                    newServices[index] = { ...service, description: e.target.value };
                                                                    setFormData({ ...formData, services: newServices });
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-medium">What you provide (One per line)</label>
                                                                <Textarea
                                                                    value={service.provides || ''}
                                                                    onChange={(e) => {
                                                                        const newServices = [...(formData.services || [])];
                                                                        newServices[index] = { ...service, provides: e.target.value };
                                                                        setFormData({ ...formData, services: newServices });
                                                                    }}
                                                                    className="min-h-[150px]"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-medium">Who this is for (One per line)</label>
                                                                <Textarea
                                                                    value={service.audience || ''}
                                                                    onChange={(e) => {
                                                                        const newServices = [...(formData.services || [])];
                                                                        newServices[index] = { ...service, audience: e.target.value };
                                                                        setFormData({ ...formData, services: newServices });
                                                                    }}
                                                                    className="min-h-[150px]"
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">Why Choose Me (6 Items)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(formData.whyChooseMe || []).map((item: any, index: number) => (
                                                <Card key={index} className="bg-card/50 border-white/10">
                                                    <CardContent className="space-y-3 pt-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Title {index + 1}</label>
                                                            <Input
                                                                value={item.title || ''}
                                                                onChange={(e) => {
                                                                    const newItems = [...(formData.whyChooseMe || [])];
                                                                    newItems[index] = { ...item, title: e.target.value };
                                                                    setFormData({ ...formData, whyChooseMe: newItems });
                                                                }}
                                                                placeholder="e.g., Hands-on Experience"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Description</label>
                                                            <Textarea
                                                                value={item.desc || ''}
                                                                onChange={(e) => {
                                                                    const newItems = [...(formData.whyChooseMe || [])];
                                                                    newItems[index] = { ...item, desc: e.target.value };
                                                                    setFormData({ ...formData, whyChooseMe: newItems });
                                                                }}
                                                                className="min-h-[80px]"
                                                                placeholder="Brief description..."
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">Showcase Section</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Section Title</label>
                                                <Input
                                                    value={formData.showcaseTitle || ''}
                                                    onChange={(e) => setFormData({ ...formData, showcaseTitle: e.target.value })}
                                                    placeholder="e.g., Proof of Work"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Section Subtitle</label>
                                                <Input
                                                    value={formData.showcaseSubtitle || ''}
                                                    onChange={(e) => setFormData({ ...formData, showcaseSubtitle: e.target.value })}
                                                    placeholder="e.g., Don't just take my word for it..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            {(formData.showcaseItems || []).map((item: any, index: number) => (
                                                <Card key={index} className="bg-card/50 border-white/10">
                                                    <CardHeader>
                                                        <CardTitle className="text-base">
                                                            {index === 0 ? "Business Apps Delivered" : "Career Transformations"}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Title</label>
                                                            <Input
                                                                value={item.title || ''}
                                                                onChange={(e) => {
                                                                    const newItems = [...(formData.showcaseItems || [])];
                                                                    newItems[index] = { ...item, title: e.target.value };
                                                                    setFormData({ ...formData, showcaseItems: newItems });
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Description</label>
                                                            <Textarea
                                                                value={item.description || ''}
                                                                onChange={(e) => {
                                                                    const newItems = [...(formData.showcaseItems || [])];
                                                                    newItems[index] = { ...item, description: e.target.value };
                                                                    setFormData({ ...formData, showcaseItems: newItems });
                                                                }}
                                                                className="min-h-[80px]"
                                                            />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <label className="text-sm font-medium">
                                                                {index === 0 ? "App Screenshot" : "Success Story Image"}
                                                            </label>

                                                            {/* Image Preview */}
                                                            {item.image && (
                                                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-white/10 shadow-lg group">
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            const newItems = [...(formData.showcaseItems || [])];
                                                                            newItems[index] = { ...item, image: "" };
                                                                            setFormData({ ...formData, showcaseItems: newItems });
                                                                            // Reset file input
                                                                            const fileInputs = document.querySelectorAll('input[type="file"][accept="image/*"]');
                                                                            if (fileInputs[index + 1]) (fileInputs[index + 1] as HTMLInputElement).value = "";
                                                                        }}
                                                                        className="absolute top-2 right-2 p-2 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        title="Remove image"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {/* Upload Section */}
                                                            <div className="p-4 rounded-lg border border-dashed border-white/20 space-y-3">
                                                                <Input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const newItems = [...(formData.showcaseItems || [])];
                                                                        newItems[index] = { ...item, image: e.target.value };
                                                                        setFormData({ ...formData, showcaseItems: newItems });
                                                                    }}
                                                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                                />
                                                                <div className="text-center text-xs text-muted-foreground">- OR -</div>
                                                                <Input
                                                                    value={item.image || ''}
                                                                    onChange={(e) => {
                                                                        const newItems = [...(formData.showcaseItems || [])];
                                                                        newItems[index] = { ...item, image: e.target.value };
                                                                        setFormData({ ...formData, showcaseItems: newItems });
                                                                    }}
                                                                    placeholder="Enter image URL directly"
                                                                    className="h-9 text-xs"
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold">CTA Section</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">CTA Title</label>
                                                <Input
                                                    value={formData.ctaTitle || ''}
                                                    onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">CTA Description</label>
                                                <Input
                                                    value={formData.ctaDescription || ''}
                                                    onChange={(e) => setFormData({ ...formData, ctaDescription: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href="/admin/pages">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" variant="gradient" disabled={isSaving}>
                            <Save className="w-5 h-5 mr-2" />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
