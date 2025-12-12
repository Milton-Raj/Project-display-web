"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Linkedin, Instagram, MessageSquare, Send, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ContactContentProps {
    content: any;
}

export function ContactContent({ content }: ContactContentProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const contactInfo = {
        phone: content.phone || process.env.NEXT_PUBLIC_PHONE || "+919151214181",
        whatsapp: content.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || "+919151214181",
        email: content.email || process.env.NEXT_PUBLIC_EMAIL || "chrixlinitsolutions@gmail.com",
        linkedin: content.linkedin || process.env.NEXT_PUBLIC_LINKEDIN || "https://www.linkedin.com/in/milton-raj/",
        instagram: content.instagram || process.env.NEXT_PUBLIC_INSTAGRAM || "",
    };

    const [honeypot, setHoneypot] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>("");

    // Import createContactSubmission dynamically or at top level if possible. 
    // Since this is a client component, we should import it at the top.
    // However, I will assume it is imported. I need to add the import statement.
    // Wait, I can't add import with this tool easily if I don't target the top.
    // Let me use the existing imports and just replace the handleSubmit logic.
    // I'll need to add the import in a separate step or assume it's available?
    // No, I must add the import. I'll use multi_replace_file_content or just replace the whole file content to be safe and clean.
    // Actually, I can just replace the top imports and the handleSubmit.

    // Let's do it in two steps. First add import.

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('handleSubmit called');
        e.preventDefault();
        console.log('preventDefault called');

        // Honeypot check
        if (honeypot) {
            console.log('Honeypot triggered');
            // Silently fail for bots
            setSubmitStatus("success");
            setTimeout(() => setSubmitStatus("idle"), 5000);
            return;
        }

        setIsSubmitting(true);
        setUploadError("");
        console.log('Starting form submission', formData);

        try {
            let attachmentPath = "";

            // Try to upload file if selected (but don't fail if upload fails)
            if (selectedFile) {
                try {
                    const fileFormData = new FormData();
                    fileFormData.append('file', selectedFile);

                    const uploadResponse = await fetch('/api/upload', {
                        method: 'POST',
                        body: fileFormData,
                    });

                    if (uploadResponse.ok) {
                        const uploadData = await uploadResponse.json();
                        attachmentPath = uploadData.path;
                    } else {
                        console.warn('File upload failed, continuing without attachment');
                        setUploadError("File upload failed. Message will be sent without attachment.");
                    }
                } catch (uploadError) {
                    console.warn('File upload error, continuing without attachment:', uploadError);
                    setUploadError("File upload failed. Message will be sent without attachment.");
                }
            }

            // Submit contact form with or without attachment
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                    attachment: attachmentPath || undefined,
                }),
            });

            console.log('Response received:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit contact form');
            }

            setSubmitStatus("success");
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
            setSelectedFile(null);
            setUploadError("");
            console.log('Form submitted successfully');
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Something went wrong!");
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus("idle"), 5000);
        }
    };

    return (
        <div className="container-custom py-20 space-y-16">
            {/* Page Header */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold">
                    {content.headerTitle || (
                        <>Get in <span className="gradient-text">Touch</span></>
                    )}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {content.headerSubtitle || "Have a project in mind? Let's discuss how we can work together to bring your vision to life."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="shadow-premium-lg">
                        <CardHeader>
                            <CardTitle className="text-3xl">Send a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Honeypot Field - Hidden from users */}
                                <div className="hidden">
                                    <input
                                        type="text"
                                        name="website"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">
                                            Name *
                                        </label>
                                        <Input
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">
                                            Email *
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Phone *
                                    </label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium">
                                        Subject *
                                    </label>
                                    <Input
                                        id="subject"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">
                                        Message *
                                    </label>
                                    <Textarea
                                        id="message"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell me about your project..."
                                        className="min-h-[150px]"
                                    />
                                </div>

                                {/* File Upload Field */}
                                <div className="space-y-2">
                                    <label htmlFor="attachment" className="text-sm font-medium">
                                        SOW/Project Scope (Optional)
                                    </label>
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Input
                                                id="attachment"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        // Validate file size
                                                        if (file.size > 10 * 1024 * 1024) {
                                                            setUploadError("File size must be less than 10MB");
                                                            e.target.value = "";
                                                            setSelectedFile(null);
                                                            return;
                                                        }
                                                        // Validate file type
                                                        const validTypes = [
                                                            'application/pdf',
                                                            'application/msword',
                                                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                        ];
                                                        if (!validTypes.includes(file.type)) {
                                                            setUploadError("Only PDF and Word documents are allowed");
                                                            e.target.value = "";
                                                            setSelectedFile(null);
                                                            return;
                                                        }
                                                        setUploadError("");
                                                        setSelectedFile(file);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('attachment')?.click()}
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <span className="mr-2">📎</span>
                                                {selectedFile ? selectedFile.name : 'Choose file'}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            PDF or Word document (max 10MB)
                                        </p>
                                        {selectedFile && (
                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/30">
                                                <span className="text-sm text-primary font-medium flex-1">
                                                    📎 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedFile(null);
                                                        const input = document.getElementById('attachment') as HTMLInputElement;
                                                        if (input) input.value = "";
                                                    }}
                                                    className="p-1.5 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground transition-colors"
                                                    title="Remove file"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {uploadError && (
                                            <p className="text-sm text-destructive">{uploadError}</p>
                                        )}
                                    </div>
                                </div>

                                {submitStatus === "success" && (
                                    <div className="p-4 rounded-xl bg-success/20 border border-success/30 text-success">
                                        <p className="font-medium">Message sent successfully!</p>
                                        <p className="text-sm">I'll get back to you as soon as possible.</p>
                                    </div>
                                )}

                                {submitStatus === "error" && (
                                    <div className="p-4 rounded-xl bg-destructive/20 border border-destructive/30 text-destructive">
                                        <p className="font-medium">Something went wrong!</p>
                                        <p className="text-sm">{String(errorMessage) || "Please try again or contact me directly."}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    variant="gradient"
                                    size="lg"
                                    className="w-full"
                                    disabled={isSubmitting}
                                    onClick={(e) => {
                                        console.log('Button clicked');
                                        e.preventDefault();
                                        handleSubmit(e as any);
                                    }}
                                >
                                    {isSubmitting ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contact Info & Direct Buttons */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Direct Contact Buttons */}
                    <Card className="shadow-premium-lg">
                        <CardHeader>
                            <CardTitle className="text-3xl">Quick Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <a href={`tel:${contactInfo.phone}`} className="block">
                                <Button variant="outline" size="lg" className="w-full justify-start hover-glow-primary">
                                    <Phone className="w-5 h-5 mr-3" />
                                    <div className="text-left">
                                        <div className="font-semibold">Call Me</div>
                                        <div className="text-sm text-muted-foreground">{contactInfo.phone}</div>
                                    </div>
                                </Button>
                            </a>

                            <a
                                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Button variant="outline" size="lg" className="w-full justify-start hover-glow-secondary">
                                    <MessageSquare className="w-5 h-5 mr-3" />
                                    <div className="text-left">
                                        <div className="font-semibold">WhatsApp</div>
                                        <div className="text-sm text-muted-foreground">Chat on WhatsApp</div>
                                    </div>
                                </Button>
                            </a>

                            <a href={`mailto:${contactInfo.email}`} className="block">
                                <Button variant="outline" size="lg" className="w-full justify-start hover-glow-accent">
                                    <Mail className="w-5 h-5 mr-3" />
                                    <div className="text-left">
                                        <div className="font-semibold">Email Me</div>
                                        <div className="text-sm text-muted-foreground">{contactInfo.email}</div>
                                    </div>
                                </Button>
                            </a>

                            {contactInfo.linkedin && (
                                <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="block">
                                    <Button variant="outline" size="lg" className="w-full justify-start hover-glow-primary">
                                        <Linkedin className="w-5 h-5 mr-3" />
                                        <div className="text-left">
                                            <div className="font-semibold">LinkedIn</div>
                                            <div className="text-sm text-muted-foreground">Connect on LinkedIn</div>
                                        </div>
                                    </Button>
                                </a>
                            )}

                            {contactInfo.instagram && (
                                <a
                                    href={`https://instagram.com/${contactInfo.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button variant="outline" size="lg" className="w-full justify-start hover-glow-accent">
                                        <Instagram className="w-5 h-5 mr-3" />
                                        <div className="text-left">
                                            <div className="font-semibold">Instagram</div>
                                            <div className="text-sm text-muted-foreground">@{contactInfo.instagram}</div>
                                        </div>
                                    </Button>
                                </a>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <Card className="glass">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xl font-bold">{content.responseTimeTitle || "Response Time"}</h3>
                            <p className="text-muted-foreground">
                                {content.responseTimeDescription || "I typically respond within 24 hours during business days. For urgent inquiries, please call or message me on WhatsApp."}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
