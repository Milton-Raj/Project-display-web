"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

const pages = [
    {
        id: "home",
        name: "Home Page",
        description: "Edit hero section, featured projects title, and CTA section.",
        lastUpdated: "Never",
    },
    {
        id: "about",
        name: "About Page",
        description: "Edit bio, skills, certifications, and experience.",
        lastUpdated: "Never",
    },
    {
        id: "contact",
        name: "Contact Page",
        description: "Edit contact information and social links.",
        lastUpdated: "Never",
    },
];

export default function PagesManagement() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold gradient-text-primary">Website Pages</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                    <Card key={page.id} className="p-6 glass hover:glow-primary transition-smooth group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2">{page.name}</h3>
                        <p className="text-muted-foreground mb-6 h-12">
                            {page.description}
                        </p>

                        <Link href={`/admin/pages/${page.id}`}>
                            <Button className="w-full group-hover:glow-primary">
                                Edit Content
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
}
