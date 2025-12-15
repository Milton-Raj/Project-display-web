"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Mail, Trash2, Clock, Phone, User, Download } from "lucide-react";
import { ContactSubmission } from "@/types/contact";
import { formatDate } from "@/lib/utils";
import { ContactDetailModal } from "@/components/admin/ContactDetailModal";
import { useToast } from "@/components/ui/use-toast";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { format } from "date-fns";

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<ContactSubmission[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { toast } = useToast();

    // State for delete confirmation
    const [contactToDelete, setContactToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadContacts();
    }, []);

    async function loadContacts() {
        try {
            console.log("Loading contacts...");
            const response = await fetch(`/api/contacts?t=${Date.now()}`);
            const { contacts: data } = await response.json();
            console.log("Contacts loaded:", data.length);
            setContacts(data);
            setFilteredContacts(data);
        } catch (error) {
            console.error("Failed to load contacts:", error);
        } finally {
            setIsLoading(false);
        }
    }

    // Filter contacts based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredContacts(contacts);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = contacts.filter(contact =>
                contact.name.toLowerCase().includes(query) ||
                contact.email.toLowerCase().includes(query) ||
                contact.subject.toLowerCase().includes(query) ||
                contact.message.toLowerCase().includes(query)
            );
            setFilteredContacts(filtered);
        }
    }, [searchQuery, contacts]);

    async function handleMarkAsRead(id: string) {
        try {
            await fetch('/api/contacts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'read' })
            });
            setContacts(contacts.map(c =>
                c.id === id ? { ...c, status: 'read' } : c
            ));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    }

    async function handleMarkAsUnread(id: string) {
        try {
            await fetch('/api/contacts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'unread' })
            });
            setContacts(contacts.map(c =>
                c.id === id ? { ...c, status: 'unread' } : c
            ));
        } catch (error) {
            console.error("Failed to mark as unread:", error);
        }
    }

    async function confirmDelete() {
        if (!contactToDelete) return;

        setIsDeleting(true);
        const id = contactToDelete;
        console.log("Proceeding with delete for contact ID:", id);

        try {
            console.log("Sending DELETE request...");
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE'
            });
            console.log("Response received:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to delete contact:", errorData);
                toast({
                    title: "Error",
                    description: "Failed to delete contact. Please try again.",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Success",
                description: "Contact deleted successfully.",
            });

            // Reload from server to ensure sync
            loadContacts();
        } catch (error) {
            console.error("Failed to delete contact:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setContactToDelete(null); // Close modal
        }
    }

    function handleContactClick(contact: ContactSubmission) {
        setSelectedContact(contact);
        setIsModalOpen(true);
        // Auto-mark as read when opened
        if (contact.status === 'unread') {
            handleMarkAsRead(contact.id);
        }
    }

    const unreadCount = contacts.filter(c => c.status === 'unread').length;

    function downloadCSV(e: React.MouseEvent) {
        e.preventDefault();

        if (!contacts.length) {
            toast({
                title: "No data",
                description: "There are no contacts to export.",
                variant: "destructive",
            });
            return;
        }

        try {
            const headers = ["ID", "Name", "Email", "Phone", "Subject", "Message", "Status", "Date", "Attachment"];
            const csvContent = contacts.map(contact => [
                contact.id,
                `"${contact.name.replace(/"/g, '""')}"`,
                `"${contact.email.replace(/"/g, '""')}"`,
                `"${(contact.phone || "").replace(/"/g, '""')}"`,
                `"${contact.subject.replace(/"/g, '""')}"`,
                `"${contact.message.replace(/"/g, '""')}"`,
                contact.status,
                new Date(contact.createdAt).toLocaleString(),
                contact.attachment ? `${window.location.origin}${contact.attachment}` : ""
            ].join(",")).join("\n");

            const blob = new Blob([headers.join(",") + "\n" + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            // Format: Contacts_2024-03-20_14-30-00.csv
            const fileName = `Contacts_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`;

            link.href = url;
            link.download = fileName;
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            toast({
                title: "Download Started",
                description: `Exporting as ${fileName}`,
            });
        } catch (error) {
            console.error("Export failed:", error);
            toast({
                title: "Export Failed",
                description: "Could not generate CSV file.",
                variant: "destructive",
            });
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Contact Submissions</h1>
                            <p className="text-muted-foreground">
                                {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
                            </p>
                        </div>
                        <Button
                            onClick={downloadCSV}
                            variant="outline"
                            className="gap-2"
                            disabled={contacts.length === 0}
                        >
                            <Download className="w-4 h-4" />
                            Export .CSV
                        </Button>
                    </div>

                    {/* Search Box */}
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Contacts List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading contacts...</p>
                    </div>
                ) : contacts.length === 0 ? (
                    <Card className="p-12 text-center glass">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Messages Yet</h3>
                        <p className="text-muted-foreground">
                            Contact form submissions will appear here
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${contact.status === 'unread'
                                        ? 'bg-primary/10 border-l-4 border-l-primary border-primary/20 shadow-sm hover:bg-primary/15'
                                        : 'bg-card/50 border-l-4 border-l-transparent hover:bg-accent/5 opacity-80 hover:opacity-100'
                                    }`}
                                onClick={() => handleContactClick(contact)}
                            >
                                {/* Unread Indicator */}
                                {contact.status === 'unread' && (
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`text-base font-semibold truncate ${contact.status === 'unread' ? 'text-foreground' : 'text-muted-foreground'
                                            }`}>
                                            {contact.subject}
                                        </h3>
                                        {contact.status === 'unread' && (
                                            <Badge variant="accent" className="text-xs">New</Badge>
                                        )}
                                    </div>
                                    <p className={`text-sm truncate mb-1 ${contact.status === 'unread' ? 'font-medium' : 'text-muted-foreground'
                                        }`}>
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            <span className="font-semibold">{contact.name}</span>
                                            <span className="text-muted-foreground"> - {contact.message}</span>
                                        </span>
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {contact.email}
                                        </span>
                                        {contact.phone && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {contact.phone}
                                            </span>
                                        )}
                                        {contact.attachment && (
                                            <span className="flex items-center gap-1 text-primary">
                                                📎 Attachment
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Date & Actions */}
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(contact.createdAt)}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={isDeleting && contactToDelete === contact.id}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive z-10 relative"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setContactToDelete(contact.id);
                                        }}
                                    >
                                        {isDeleting && contactToDelete === contact.id ? (
                                            <span className="animate-spin">⏳</span>
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Detail Modal */}
            <ContactDetailModal
                contact={selectedContact}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onMarkAsRead={handleMarkAsRead}
                onMarkAsUnread={handleMarkAsUnread}
                onDelete={(id) => {
                    setIsModalOpen(false); // Close detail modal
                    setContactToDelete(id); // Open confirm modal
                }}
            />

            {/* Add Confirm Modal */}
            <ConfirmDialog
                isOpen={!!contactToDelete}
                onClose={() => setContactToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Message"
                description="Are you sure you want to delete this message? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                isLoading={isDeleting}
            />
        </AdminLayout>
    );
}
