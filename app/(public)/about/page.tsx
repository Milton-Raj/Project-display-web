import { getPageContent } from "@/lib/database";
import { AboutContent } from "@/components/about/AboutContent";

export const revalidate = 3600; // Cache for 1 hour

export default async function AboutPage() {
    const content = await getPageContent('about');
    const data = content || {};

    return <AboutContent content={data} />;
}
