import { getPageContent } from "@/lib/database";
import { AboutContent } from "@/components/about/AboutContent";

export const revalidate = 60; // Cache for 60 seconds

export default async function AboutPage() {
    const content = await getPageContent('about');
    const data = content || {};

    return <AboutContent content={data} />;
}
