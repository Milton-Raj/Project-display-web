import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Users, FileText, CheckCircle2, Sparkles, Smartphone, Cloud, Briefcase, Database, Layout } from "lucide-react";
import Link from "next/link";

interface WhatIOfferContentProps {
    content?: any;
}

export function WhatIOfferContent({ content = {} }: WhatIOfferContentProps) {
    // Default Fallbacks consistent with original hardcoded values
    const services = content.services || [];

    const whyChooseMe = content.whyChooseMe || [
        { title: "Hands-on Experience", desc: "Real-world expertise in software development and delivery." },
        { title: "500+ Trained", desc: "Helped hundreds of students and employees achieve their career goals." },
        { title: "Full Support", desc: "From the first call to final delivery, I'm with you every step." },
        { title: "Transparent Pricing", desc: "No hidden costs. Zero outsourcing. You work directly with me." },
        { title: "Real Results", desc: "Proven track record of successful apps and hired candidates." },
        { title: "Custom Solutions", desc: "Tailored strategies and code, not generic templates." }
    ];

    const showcaseItems = content.showcaseItems || [
        {
            title: "Business Apps Delivered",
            description: "Custom solutions helping businesses scale operations efficiently."
        },
        {
            title: "Career Transformations",
            description: "Students placed in top companies after training and profile optimization."
        }
    ];

    const getDynamicIcon = (title: string, style: any) => {
        const lowerTitle = title.toLowerCase();
        const iconClass = `w-7 h-7 ${style.text}`;

        if (lowerTitle.includes('mobile') || lowerTitle.includes('android') || lowerTitle.includes('ios') || lowerTitle.includes('app')) {
            return <Smartphone className={iconClass} />;
        }
        if (lowerTitle.includes('cloud') || lowerTitle.includes('aws') || lowerTitle.includes('azure')) {
            return <Cloud className={iconClass} />;
        }
        if (lowerTitle.includes('data') || lowerTitle.includes('sql') || lowerTitle.includes('backend')) {
            return <Database className={iconClass} />;
        }
        if (lowerTitle.includes('interview') || lowerTitle.includes('training') || lowerTitle.includes('coaching') || lowerTitle.includes('team') || lowerTitle.includes('education')) {
            return <Users className={iconClass} />;
        }
        if (lowerTitle.includes('resume') || lowerTitle.includes('linkedin') || lowerTitle.includes('profile')) {
            return <FileText className={iconClass} />;
        }
        if (lowerTitle.includes('product') || lowerTitle.includes('management') || lowerTitle.includes('business') || lowerTitle.includes('job') || lowerTitle.includes('career')) {
            return <Briefcase className={iconClass} />;
        }
        if (lowerTitle.includes('web') || lowerTitle.includes('frontend') || lowerTitle.includes('react') || lowerTitle.includes('technical')) {
            return <Layout className={iconClass} />;
        }

        return <Code className={iconClass} />;
    };

    const getColors = (index: number) => {
        const colors = [
            { bg: "bg-primary/10", text: "text-primary", border: "hover:border-primary/50", button: "group-hover:bg-primary group-hover:text-primary-foreground", check: "text-primary" },
            { bg: "bg-accent/10", text: "text-accent", border: "hover:border-accent/50", button: "group-hover:bg-accent group-hover:text-accent-foreground", check: "text-accent" },
            { bg: "bg-secondary/10", text: "text-secondary", border: "hover:border-secondary/50", button: "group-hover:bg-secondary group-hover:text-secondary-foreground", check: "text-secondary" }
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="space-y-20 pb-20">
            {/* 1. Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-8 pb-12">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
                </div>

                <div className="container-custom text-center space-y-6">
                    <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Premium Services</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        {content.heroTitle || "I build software, train teams, and help job seekers upgrade their career."}
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
                    {services.map((service: any, index: number) => {
                        const style = getColors(index);
                        const provides = typeof service.provides === 'string' ? service.provides.split('\n') : (service.provides || []);
                        const audience = typeof service.audience === 'string' ? service.audience.split('\n') : (service.audience || []);

                        return (
                            <div key={index} className={`glass-strong rounded-3xl p-8 space-y-6 ${style.border} transition-colors group`}>
                                <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    {getDynamicIcon(service.title || '', style)}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{service.title}</h3>
                                    <p className="text-muted-foreground">{service.description}</p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div>
                                        <h4 className={`text-sm font-semibold ${style.text} mb-2`}>What you provide:</h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            {provides.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <CheckCircle2 className={`w-4 h-4 ${style.check} shrink-0 mt-0.5`} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Who this is for:</h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            {audience.map((item: string, i: number) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-secondary' : index === 1 ? 'bg-primary' : 'bg-accent'}`} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <Link href={`/contact?service=${index}`} className="block pt-4">
                                    <Button className={`w-full ${style.button} transition-colors`}>
                                        I'm Interested
                                    </Button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 3. Why Choose Me */}
            <section className="container-custom py-10">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Why Choose Me?</h2>
                    <p className="text-muted-foreground">No fluff. Just results and transparent delivery.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {whyChooseMe.map((item: any, i: number) => (
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
                        <h2 className="text-3xl md:text-4xl font-bold">{content.showcaseTitle || "Proof of Work"}</h2>
                        <p className="text-muted-foreground">{content.showcaseSubtitle || "Don't just take my word for it. See the results."}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {showcaseItems.map((item: any, i: number) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-video rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-muted-foreground">{item.title} Placeholder</span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
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
