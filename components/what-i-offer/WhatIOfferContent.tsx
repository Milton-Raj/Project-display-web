import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Users, FileText, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

export function WhatIOfferContent() {
    return (
        <div className="space-y-20 pb-20">
            {/* 1. Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
                </div>

                <div className="container-custom text-center space-y-8">
                    <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Premium Services</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        I build software, train teams, and help job seekers <span className="gradient-text">upgrade their career.</span>
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        <Link href="/contact">
                            <Button variant="gradient" size="xl" className="group min-w-[200px]">
                                Book a Call
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="xl" className="min-w-[200px]">
                                WhatsApp Me
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. Service Category Blocks */}
            <section className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Service 1: App Development */}
                    <div className="glass-strong rounded-3xl p-8 space-y-6 hover:border-primary/50 transition-colors group">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Code className="w-7 h-7 text-primary" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Custom Web & Mobile App Development</h3>
                            <p className="text-muted-foreground">Build scalable, high-performance applications tailored to your business needs.</p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">What you provide:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Custom-built web apps</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Custom-built mobile apps (Android / iOS)</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Ready-made business apps</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Full support until deployment</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-secondary mb-2">Who this is for:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary" /> Entrepreneurs launching a business</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary" /> SMEs scaling operations</li>
                                </ul>
                            </div>
                        </div>

                        <Link href="/contact?service=app-dev" className="block pt-4">
                            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                Build My App
                            </Button>
                        </Link>
                    </div>

                    {/* Service 2: Interview Training */}
                    <div className="glass-strong rounded-3xl p-8 space-y-6 hover:border-accent/50 transition-colors group">
                        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-7 h-7 text-accent" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Interview Training for Students & Employees</h3>
                            <p className="text-muted-foreground">Result-oriented coaching to crack technical and HR rounds with confidence.</p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div>
                                <h4 className="text-sm font-semibold text-accent mb-2">What you provide:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Interview strategy coaching</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Technical + HR practice rounds</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Communication training</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Real-world mock scenarios</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-secondary mb-2">Who this is for:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary" /> Freshers & Job Seekers</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary" /> Professionals switching careers</li>
                                </ul>
                            </div>
                        </div>

                        <Link href="/contact?service=training" className="block pt-4">
                            <Button className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                Train Me for Interviews
                            </Button>
                        </Link>
                    </div>

                    {/* Service 3: Profile Optimization */}
                    <div className="glass-strong rounded-3xl p-8 space-y-6 hover:border-secondary/50 transition-colors group">
                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-7 h-7 text-secondary" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Resume / Job Portal / LinkedIn Optimization</h3>
                            <p className="text-muted-foreground">Stand out to recruiters with ATS-friendly resumes and optimized profiles.</p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div>
                                <h4 className="text-sm font-semibold text-secondary mb-2">What you provide:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> ATS-friendly resume writing</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> LinkedIn profile optimization</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Job portal complete setup</li>
                                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Keyword strategy for search</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">Who this is for:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Job Seekers</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Students preparing for placements</li>
                                </ul>
                            </div>
                        </div>

                        <Link href="/contact?service=profile" className="block pt-4">
                            <Button className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                                Optimize My Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. Why Choose Me */}
            <section className="container-custom py-10">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Why Choose Me?</h2>
                    <p className="text-muted-foreground">No fluff. Just results and transparent delivery.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "Hands-on Experience", desc: "Real-world expertise in software development and delivery." },
                        { title: "500+ Trained", desc: "Helped hundreds of students and employees achieve their career goals." },
                        { title: "Full Support", desc: "From the first call to final delivery, I'm with you every step." },
                        { title: "Transparent Pricing", desc: "No hidden costs. Zero outsourcing. You work directly with me." },
                        { title: "Real Results", desc: "Proven track record of successful apps and hired candidates." },
                        { title: "Custom Solutions", desc: "Tailored strategies and code, not generic templates." },
                    ].map((item, i) => (
                        <div key={i} className="glass p-6 rounded-2xl flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                            <div>
                                <h4 className="font-bold mb-1">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Showcase Section */}
            <section className="container-custom py-10">
                <div className="glass-strong rounded-3xl p-8 md:p-12">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Proof of Work</h2>
                        <p className="text-muted-foreground">Don't just take my word for it. See the results.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Placeholder for App Showcase */}
                        <div className="space-y-4">
                            <div className="aspect-video rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-muted-foreground">App Screenshot Placeholder</span>
                            </div>
                            <h3 className="text-xl font-bold">Business Apps Delivered</h3>
                            <p className="text-sm text-muted-foreground">Custom solutions helping businesses scale operations efficiently.</p>
                        </div>

                        {/* Placeholder for Success Stories */}
                        <div className="space-y-4">
                            <div className="aspect-video rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-muted-foreground">Success Stories Placeholder</span>
                            </div>
                            <h3 className="text-xl font-bold">Career Transformations</h3>
                            <p className="text-sm text-muted-foreground">Students placed in top companies after training and profile optimization.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Final CTA */}
            <section className="container-custom py-10">
                <div className="text-center space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold">
                        Ready to <span className="gradient-text">Level Up?</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Whether you need a custom app, interview training, or a career profile makeover, I'm here to help you succeed.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact">
                            <Button variant="gradient" size="xl" className="w-full sm:w-auto px-12 text-lg h-14">
                                Contact Me Now
                                <ArrowRight className="w-6 h-6 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
