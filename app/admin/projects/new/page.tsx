"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, X, Upload, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
// Removed Firebase imports - using API routes and URL inputs instead
import { PROJECT_CATEGORIES, DEMO_TYPES, ProjectCategory } from "@/types/project";
import { slugify } from "@/lib/utils";

export default function NewProjectPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        longDescription: "",
        category: [] as ProjectCategory[], // Changed to array for multi-select
        techStack: [] as string[],
        features: [] as string[],
        thumbnail: "",
        screenshots: [] as string[],
        demoUrl: "",
        videoUrl: "",
        appStoreUrl: "",
        playStoreUrl: "",
        apkUrl: "",
        testFlightUrl: "",
        demoType: "web" as any,
        status: "live" as any,
        featured: false,
        documents: [] as { name: string; url: string; previewUrl?: string }[],
    });
    const [techInput, setTechInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");

    // File states
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [docFile, setDocFile] = useState<File | null>(null);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);
    const [isUploading, setUploading] = useState(false);
    const [mobileDemoType, setMobileDemoType] = useState<'ios' | 'android' | 'apk' | 'testflight' | 'none'>('none');

    // Document state
    const [newDoc, setNewDoc] = useState({ name: "", url: "", previewUrl: "" });

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
        return data.url;
    };

    const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await uploadFile(file);
            setFormData({ ...formData, thumbnail: url });
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            alert('Failed to upload image. Please try again.');
        }
    };

    const handleScreenshotsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = files.map(file => uploadFile(file));
            const urls = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                screenshots: [...prev.screenshots, ...urls]
            }));
        } catch (error) {
            console.error('Error uploading screenshots:', error);
            alert('Failed to upload screenshots.');
        } finally {
            setUploading(false);
        }
    };

    const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadFile(file);
            setFormData(prev => ({
                ...prev,
                documents: [...(prev.documents || []), { name: file.name, url }]
            }));
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document.');
        } finally {
            setUploading(false);
        }
    };

    const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDocFile(e.target.files[0]);
        }
    };

    const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPreviewFile(file);
            // Show immediate preview for doc preview
            setNewDoc({ ...newDoc, previewUrl: URL.createObjectURL(file) });
        }
    };

    // uploadFile function moved up

    const addDocument = async () => {
        if (!newDoc.name) {
            alert("Please enter a document name");
            return;
        }

        if (!docFile && !newDoc.url) {
            alert("Please upload a document file or enter a URL");
            return;
        }

        setIsUploadingDoc(true);
        try {
            let docUrl = newDoc.url;
            let previewUrl = newDoc.previewUrl;

            // Upload files if selected
            if (docFile) {
                docUrl = await uploadFile(docFile);
            }
            if (previewFile) {
                previewUrl = await uploadFile(previewFile);
            }

            setFormData({
                ...formData,
                documents: [...formData.documents, { name: newDoc.name, url: docUrl, previewUrl }],
            });

            // Reset form
            setNewDoc({ name: "", url: "", previewUrl: "" });
            setDocFile(null);
            setPreviewFile(null);

            // Reset file inputs
            const docInput = document.getElementById('doc-upload') as HTMLInputElement;
            const previewInput = document.getElementById('preview-upload') as HTMLInputElement;
            if (docInput) docInput.value = '';
            if (previewInput) previewInput.value = '';

        } catch (error) {
            console.error("Error uploading document:", error);
            alert("Failed to upload document");
        } finally {
            setIsUploadingDoc(false);
        }
    };

    const removeDocument = (index: number) => {
        setFormData({
            ...formData,
            documents: formData.documents.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let thumbnailUrl = formData.thumbnail;

            // Upload thumbnail if selected
            if (thumbnailFile) {
                thumbnailUrl = await uploadFile(thumbnailFile);
            }

            const slug = slugify(formData.title);
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    thumbnail: thumbnailUrl,
                    slug,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create project');
            }

            router.push("/admin/projects");
            router.refresh();
        } catch (error) {
            console.error("Failed to create project:", error);
            alert(error instanceof Error ? error.message : "Failed to create project");
            setIsLoading(false);
        }
    };

    const addTech = () => {
        if (techInput.trim()) {
            setFormData({
                ...formData,
                techStack: [...formData.techStack, techInput.trim()],
            });
            setTechInput("");
        }
    };

    const removeTech = (index: number) => {
        setFormData({
            ...formData,
            techStack: formData.techStack.filter((_, i) => i !== index),
        });
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, featureInput.trim()],
            });
            setFeatureInput("");
        }
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/projects">
                            <Button variant="ghost" size="sm" className="mb-2">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Projects
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">Add New Project</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Title *</label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="My Awesome Project"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Short Description *</label>
                                <Textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="A brief description of your project"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Long Description</label>
                                <Textarea
                                    value={formData.longDescription}
                                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                    placeholder="Detailed description of your project"
                                    className="min-h-[150px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Categories * (Select all that apply)</label>
                                    <div className="p-4 rounded-xl border border-input bg-background/50 space-y-2">
                                        {PROJECT_CATEGORIES.map((cat) => (
                                            <div key={cat.value} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`category-${cat.value}`}
                                                    checked={Array.isArray(formData.category) ? formData.category.includes(cat.value) : formData.category === cat.value}
                                                    onChange={(e) => {
                                                        const currentCategories = Array.isArray(formData.category) ? formData.category : [formData.category];
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, category: [...currentCategories, cat.value] });
                                                        } else {
                                                            setFormData({ ...formData, category: currentCategories.filter(c => c !== cat.value) });
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded border-input"
                                                />
                                                <label htmlFor={`category-${cat.value}`} className="text-sm cursor-pointer">
                                                    {cat.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status *</label>
                                    <select
                                        required
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm"
                                    >
                                        <option value="live">Live</option>
                                        <option value="coming-soon">Coming Soon</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 rounded"
                                />
                                <label htmlFor="featured" className="text-sm font-medium">
                                    Feature this project on homepage
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tech Stack */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Tech Stack</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                                    placeholder="Add technology (e.g., React, Node.js)"
                                />
                                <Button type="button" onClick={addTech} variant="outline">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.techStack.map((tech, index) => (
                                    <Badge key={index} variant="secondary" className="gap-2">
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTech(index)}
                                            className="hover:text-destructive"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Features</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                                    placeholder="Add a feature"
                                />
                                <Button type="button" onClick={addFeature} variant="outline">
                                    Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg glass">
                                        <span className="flex-1">{feature}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-destructive hover:bg-destructive/10 p-1 rounded"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Thumbnail Image</label>
                                {/* Image Preview */}
                                {formData.thumbnail && (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-white/10 shadow-lg group">
                                        <img
                                            src={formData.thumbnail}
                                            alt="Thumbnail preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, thumbnail: "" });
                                                const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
                                                if (fileInput) fileInput.value = "";
                                            }}
                                            className="absolute top-2 right-2 p-2 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove thumbnail"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex gap-4 items-center">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    />
                                </div>
                                <div className="text-center text-sm text-muted-foreground my-2">- OR -</div>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.thumbnail}
                                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                        placeholder="Enter image URL directly"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            const seed = Math.random().toString(36).substring(7);
                                            setFormData({ ...formData, thumbnail: `https://picsum.photos/seed/${seed}/800/600` });
                                        }}
                                        title="Generate random stable image"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Web Project Details */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Web Project Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Demo Type</label>
                                <select
                                    value={formData.demoType === 'video' ? 'video' : formData.demoType === 'web' ? 'web' : 'none'}
                                    onChange={(e) => {
                                        const type = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            demoType: type as any,
                                            // Clear values when switching
                                            demoUrl: type === 'web' ? prev.demoUrl : '',
                                            videoUrl: type === 'video' ? prev.videoUrl : ''
                                        }));
                                    }}
                                    className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm"
                                >
                                    <option value="web">Live Website URL</option>
                                    <option value="video">Video Demo</option>
                                    <option value="none">No Demo</option>
                                </select>
                            </div>

                            {formData.demoType === 'web' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Live Website URL</label>
                                    <Input
                                        value={formData.demoUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                        placeholder="https://myproject.com"
                                    />
                                </div>
                            )}

                            {formData.demoType === 'video' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Video Demo URL</label>
                                    <Input
                                        value={formData.videoUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Mobile Project Details */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Mobile Project Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Platform</label>
                                <select
                                    value={mobileDemoType}
                                    onChange={(e) => {
                                        const type = e.target.value as any;
                                        setMobileDemoType(type);
                                        // Clear all mobile URLs when switching types to ensure exclusivity
                                        setFormData(prev => ({
                                            ...prev,
                                            appStoreUrl: '',
                                            playStoreUrl: '',
                                            apkUrl: '',
                                            testFlightUrl: ''
                                        }));
                                    }}
                                    className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm"
                                >
                                    <option value="none">No Mobile App</option>
                                    <option value="ios">Apple App Store (iOS)</option>
                                    <option value="android">Google Play Store (Android)</option>
                                    <option value="apk">Android APK Download</option>
                                    <option value="testflight">iOS TestFlight</option>
                                </select>
                            </div>

                            {/* Dynamic Input based on Selection */}
                            {mobileDemoType === 'ios' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">App Store URL</label>
                                    <Input
                                        value={formData.appStoreUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, appStoreUrl: e.target.value })}
                                        placeholder="https://apps.apple.com/..."
                                    />
                                </div>
                            )}

                            {mobileDemoType === 'android' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Google Play Store URL</label>
                                    <Input
                                        value={formData.playStoreUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, playStoreUrl: e.target.value })}
                                        placeholder="https://play.google.com/..."
                                    />
                                </div>
                            )}

                            {mobileDemoType === 'apk' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">APK Download URL</label>
                                    <Input
                                        value={formData.apkUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, apkUrl: e.target.value })}
                                        placeholder="https://.../app.apk"
                                    />
                                </div>
                            )}

                            {mobileDemoType === 'testflight' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">TestFlight Link</label>
                                    <Input
                                        value={formData.testFlightUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, testFlightUrl: e.target.value })}
                                        placeholder="https://testflight.apple.com/..."
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                {formData.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg glass border border-white/5">
                                        <div className="flex-1 space-y-1">
                                            <p className="font-medium">{doc.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <FileText className="w-3 h-3" />
                                                <span className="truncate max-w-[200px]">{doc.url}</span>
                                            </div>
                                            {doc.previewUrl && (
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <ImageIcon className="w-3 h-3" />
                                                    <span className="truncate max-w-[200px]">Preview: {doc.previewUrl}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeDocument(index)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}

                                <div className="grid gap-4 p-4 rounded-lg border border-dashed border-white/20">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Document Name *</label>
                                        <Input
                                            value={newDoc.name}
                                            onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                                            placeholder="e.g., Project Proposal"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Document File (PDF/Doc) *</label>
                                            <Input
                                                id="doc-upload"
                                                type="file"
                                                onChange={handleDocFileChange}
                                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                            />
                                            <div className="text-center text-xs text-muted-foreground">- OR -</div>
                                            <Input
                                                value={newDoc.url}
                                                onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
                                                placeholder="Enter URL directly"
                                                className="h-9 text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Preview Image (First Page)</label>
                                            <Input
                                                id="preview-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePreviewFileChange}
                                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                            />
                                            <div className="text-center text-xs text-muted-foreground">- OR -</div>
                                            <Input
                                                value={newDoc.previewUrl}
                                                onChange={(e) => setNewDoc({ ...newDoc, previewUrl: e.target.value })}
                                                placeholder="Enter URL directly"
                                                className="h-9 text-xs"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={addDocument}
                                        variant="secondary"
                                        className="w-full"
                                        disabled={isUploadingDoc}
                                    >
                                        {isUploadingDoc ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Add Document
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link href="/admin/projects">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" variant="gradient" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Create Project
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
