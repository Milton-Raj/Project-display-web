import { getPageContent } from "@/lib/database";
import { AboutContent } from "@/components/about/AboutContent";

export const revalidate = 0; // Always fetch fresh data from Supabase

export default async function AboutPage() {
    const content = await getPageContent('about');
    // Fix: Unwrap content if it's nested (API returns { slug, content: {...}, updatedAt })
    const data = content?.content || content || {};

    return <AboutContent content={data} />;
}
