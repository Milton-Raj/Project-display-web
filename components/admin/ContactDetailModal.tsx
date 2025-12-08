"use client";

import { ContactSubmission } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Mail, Phone, Calendar, Trash2, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ContactDetailModalProps {
    contact: ContactSubmission | null;
    isOpen: boolean;
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
    onMarkAsUnread: (id: string) => void;
    onDelete: (id: string) => void;
}

export function ContactDetailModal({
    contact,
    isOpen,
    onClose,
    onMarkAsRead,
    onMarkAsUnread,
    onDelete,
}: ContactDetailModalProps) {
    if (!isOpen || !contact) return null;

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this message?")) {
            onDelete(contact.id);
            onClose();
        }
    };

    const handleToggleRead = () => {
        if (contact.status === 'unread') {
            onMarkAsRead(contact.id);
        } else {
            onMarkAsUnread(contact.id);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-card border border-border rounded-2xl shadow-premium-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold">{contact.subject}</h2>
                                {contact.status === 'unread' && (
                                    <Badge variant="accent">Unread</Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Message from {formatDate(contact.createdAt)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                                title="Reply via Email"
                            >
                                <Button variant="outline" size="icon" className="hover-glow-primary">
                                    <Mail className="w-5 h-5" />
                                </Button>
                            </a>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="hover-glow-secondary"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{contact.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="text-primary hover:underline"
                                >
                                    {contact.email}
                                </a>
                            </div>
                            {contact.phone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="text-primary hover:underline"
                                    >
                                        {contact.phone}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    {formatDate(contact.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                                Message
                            </h3>
                            <p className="text-base whitespace-pre-wrap leading-relaxed">
                                {contact.message}
                            </p>
                        </div>

                        {/* Attachment */}
                        {contact.attachment && (
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                                    Attachment
                                </h3>
                                <a
                                    href={contact.attachment}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
                                >
                                    <span>📎</span>
                                    <span className="font-medium">
                                        {contact.attachment.split('/').pop()}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                        Click to download
                                    </span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
