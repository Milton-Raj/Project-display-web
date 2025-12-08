import { getPageContent } from "@/lib/json-db";
import { ContactContent } from "@/components/contact/ContactContent";

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
    const content = await getPageContent('contact');
    const data = content || {};

    return <ContactContent content={data} />;
}
