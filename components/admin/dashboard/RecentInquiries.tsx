"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function RecentInquiries({ contacts }: { contacts: any[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="shadow-lg border-none bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Mail className="w-5 h-5 text-blue-500" />
                        Recent Inquiries
                    </CardTitle>
                    <Link href="/admin/contacts" className="text-xs text-primary hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {contacts.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">No recent inquiries</div>
                        ) : (
                            contacts.map((contact) => (
                                <div key={contact.id} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm truncate">{contact.name}</p>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium truncate text-foreground/80">{contact.subject}</p>
                                        <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
