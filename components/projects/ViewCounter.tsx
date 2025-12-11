"use client";

import { useEffect } from "react";

interface ViewCounterProps {
    projectId: string;
    slug: string;
    views: number;
}

export function ViewCounter({ projectId, slug, views }: ViewCounterProps) {
    useEffect(() => {
        const incrementView = async () => {
            try {
                // Check session storage first
                const viewKey = `viewed_${slug}`;
                const hasViewed = sessionStorage.getItem(viewKey);

                if (!hasViewed) {
                    // Mark as viewed immediately to prevent double counting
                    sessionStorage.setItem(viewKey, 'true');

                    // Call API to increment
                    await fetch('/api/projects', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: projectId,
                            views: views + 1
                        })
                    });
                }
            } catch (error) {
                console.error("Failed to increment view count:", error);
            }
        };

        incrementView();
    }, [projectId, slug, views]);

    return null; // This component renders nothing
}
