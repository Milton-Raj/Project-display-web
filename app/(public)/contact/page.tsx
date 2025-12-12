import { getPageContent } from "@/lib/database";
import { ContactContent } from "@/components/contact/ContactContent";

export const revalidate = 3600; // Cache for 1 hour

export default async function ContactPage() {
    const content = await getPageContent('contact');
    const data = content || {};

    return <ContactContent content={data} />;
}
