import { getPageContent } from "@/lib/database";
import { AboutContent } from "@/components/about/AboutContent";

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    const content = await getPageContent('about');
    const data = content || {};

    return <AboutContent content={data} />;
}
