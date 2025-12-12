import { getProjectBySlug } from "@/lib/database";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Calendar, Layers, CheckCircle, FileText, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ViewCounter } from "@/components/projects/ViewCounter";

interface ProjectPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export const revalidate = 60;
export const dynamicParams = true;

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen pb-20">
            <ViewCounter projectId={project.id} slug={project.slug} views={project.views || 0} />

            {/* Hero Section */}
            <section className="relative pt-10 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

                <div className="container relative mx-auto px-4">
                    <Link href="/projects">
                        <Button variant="ghost" className="mb-8 hover:bg-white/5">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Projects
                        </Button>
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(project.category) ? (
                                        project.category.map((cat, idx) => (
                                            <Badge key={idx} variant="outline" className="text-primary border-primary/30">
                                                {cat.replace('-', ' ').toUpperCase()}
                                            </Badge>
                                        ))
                                    ) : (
                                        <Badge variant="outline" className="text-primary border-primary/30">
                                            {project.category.replace('-', ' ').toUpperCase()}
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold gradient-text-primary leading-tight">
                                    {project.title}
                                </h1>
                                <div className="mt-4">
                                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed break-words">
                                        {project.description}
                                    </p>
                                </div>
                            </div>

                            {/* Demo Buttons */}
                            {/* Demo Buttons */}
                            {(() => {
                                const actionButtons = [
                                    project.demoUrl ? { label: "View Live Demo", url: project.demoUrl, icon: <ExternalLink className="w-4 h-4 ml-2" />, variant: "gradient", className: "glow-primary" } : null,
                                    project.videoUrl ? { label: "Watch Video", url: project.videoUrl, icon: <ExternalLink className="w-4 h-4 ml-2" />, variant: "outline", className: "border-primary/50 text-foreground hover:bg-primary/10" } : null,
                                    project.appStoreUrl ? { label: "Download on App Store", url: project.appStoreUrl, icon: <ExternalLink className="w-4 h-4 ml-2" />, variant: "outline" } : null,
                                    project.playStoreUrl ? { label: "Get it on Play Store", url: project.playStoreUrl, icon: <ExternalLink className="w-4 h-4 ml-2" />, variant: "outline" } : null,
                                    project.apkUrl ? { label: "Download APK", url: project.apkUrl, icon: <ExternalLink className="w-4 h-4 ml-2" />, variant: "outline" } : null,
                                    project.testFlightUrl ? { label: "Join TestFlight", url: project.testFlightUrl, icon: <ExternalLink className="w-4 h-4 ml-2" />, variant: "outline" } : null,
                                ].filter(Boolean);

                                return (
                                    <div className="grid grid-cols-1 sm:grid-cols-[auto_auto] gap-4 pt-4 w-fit">
                                        {actionButtons.map((btn: any, idx) => (
                                            <Link key={idx} href={btn.url} target="_blank" className="w-full">
                                                <Button variant={btn.variant} size="lg" className={`w-full ${btn.className || ""}`}>
                                                    {btn.label}
                                                    {btn.icon}
                                                </Button>
                                            </Link>
                                        ))}

                                        <div className="col-span-1 sm:col-span-2 pt-2 w-full">
                                            <Link href="/contact" className="block w-full">
                                                <Button variant="gradient" size="lg" className="w-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all h-14">
                                                    Contact for Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="pt-8 border-t border-white/10">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Layers className="w-5 h-5 mr-2 text-primary" />
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech: string) => (
                                        <Badge key={tech} variant="secondary" className="bg-white/5 hover:bg-white/10">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl glow-primary">
                            {project.thumbnail ? (
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                    <span className="text-muted-foreground">No preview available</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 space-y-16">
                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <Card className="p-8 glass">
                            <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {project.longDescription || project.description}
                                </p>
                            </div>
                        </Card>

                        <Card className="p-8 glass">
                            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {project.features.map((feature: string, index: number) => (
                                    <div key={index} className="flex items-start p-4 rounded-xl bg-white/5 border border-white/5">
                                        <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Documents Section */}
                        {project.documents && project.documents.length > 0 && (
                            <Card className="p-8 glass">
                                <h2 className="text-2xl font-bold mb-6">Project Documents</h2>
                                <div className="grid gap-6">
                                    {project.documents.map((doc: any, index: number) => (
                                        <div key={index} className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold flex items-center">
                                                    <FileText className="w-5 h-5 mr-2 text-primary" />
                                                    {doc.name}
                                                </h3>
                                            </div>

                                            {/* Document Preview (First Page) */}
                                            <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-xl overflow-hidden border border-white/10 bg-black/40 group">
                                                {doc.previewUrl ? (
                                                    <img
                                                        src={doc.previewUrl}
                                                        alt={`${doc.name} Preview`}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        No preview available
                                                    </div>
                                                )}

                                                {/* Overlay */}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <Lock className="w-12 h-12 text-primary mb-4" />
                                                    <p className="text-white font-medium mb-4 text-center px-4">
                                                        This is a protected document. <br />
                                                        Contact us for full access.
                                                    </p>
                                                    <Link href={`/contact?subject=Request Access: ${doc.name} (${project.title})`}>
                                                        <Button variant="gradient">
                                                            Request Full Access
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Previewing page 1 of document
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="p-6 glass">
                            <h3 className="font-semibold mb-4">Project Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-muted-foreground flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Date
                                    </span>
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant={project.status === 'live' ? 'default' : 'secondary'}>
                                        {project.status === 'live' ? 'Live' : 'In Development'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-muted-foreground">Type</span>
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {Array.isArray(project.category) ? (
                                            project.category.map((cat, idx) => (
                                                <span key={idx} className="capitalize text-sm">
                                                    {cat.replace('-', ' ')}
                                                    {idx < project.category.length - 1 && ', '}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="capitalize">{project.category.replace('-', ' ')}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 glass bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                            <h3 className="font-semibold mb-2">Interested in this project?</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Contact us to discuss how we can build something similar for you.
                            </p>
                            <Link href="/contact">
                                <Button className="w-full">Get in Touch</Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
