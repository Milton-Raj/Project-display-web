import { getPageContent } from "@/lib/database";
import { WhatIOfferContent } from "@/components/what-i-offer/WhatIOfferContent";

export const revalidate = 60; // Cache for 60 seconds

export const metadata = {
    title: "What I Offer | Chrixlin",
    description: "Custom software development, interview training, and career profile optimization services.",
};

export default async function WhatIOfferPage() {
    const pageData = await getPageContent('what-i-offer');
    const content = pageData?.content || {};

    return <WhatIOfferContent content={content} />;
}
