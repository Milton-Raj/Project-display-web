import { getPageContent } from "@/lib/database";
import { ContactContent } from "@/components/contact/ContactContent";

export const revalidate = 0; // Always fetch fresh data from Supabase

export default async function ContactPage() {
    const content = await getPageContent('contact');
    // Fix: Unwrap content if it's nested (API returns { slug, content: {...}, updatedAt })
    const data = content?.content || content || {};

    return <ContactContent content={data} />;
}
