import { getPageContent } from "@/lib/database";
import { WhatIOfferContent } from "@/components/what-i-offer/WhatIOfferContent";

export const metadata = {
    title: "What I Offer | Chrixlin",
    description: "Custom software development, interview training, and career profile optimization services.",
};

export default function WhatIOfferPage() {
    return <WhatIOfferContent />;
}
