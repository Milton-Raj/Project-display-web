
"use client";

import { Bold, Italic, Underline, List } from "lucide-react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const handleFormat = (tag: string) => {
        // Simple append for now, or wrap around selection implementation would be better but complex without a lib.
        // Let's do a simple wrap if selection exists, or append if not? 
        // For simplicity in a lightweight environment, we'll assume append or standard HTML tag insertion.
        // Actually, let's try to do standard specialized insertion.

        const textarea = document.getElementById("rich-textarea") as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        let newText = "";

        if (tag === "ul") {
            newText = `${before}\n<ul>\n  <li>${selection || "List item"}</li>\n</ul>\n${after}`;
        } else {
            newText = `${before}<${tag}>${selection}</${tag}>${after}`;
        }

        onChange(newText);
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-1 p-1 border border-input rounded-md bg-muted/50">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormat("b")}
                    className="h-8 w-8 p-0"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormat("i")}
                    className="h-8 w-8 p-0"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormat("u")}
                    className="h-8 w-8 p-0"
                >
                    <Underline className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormat("ul")}
                    className="h-8 w-8 p-0"
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
            <Textarea
                id="rich-textarea"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="min-h-[120px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground"> Supports HTML: &lt;b&gt;, &lt;i&gt;, &lt;u&gt;, &lt;ul&gt;&lt;li&gt;</p>
        </div>
    );
}
