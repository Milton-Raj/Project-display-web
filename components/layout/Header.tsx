import { getNavVisibility } from "@/lib/supabase-db";
import { HeaderClient } from "./HeaderClient";

const ALL_NAV_ITEMS = [
    { key: "home" as const, name: "Home", href: "/" },
    { key: "projects" as const, name: "Projects", href: "/projects" },
    { key: "about" as const, name: "About", href: "/about" },
    { key: "what-i-offer" as const, name: "What I Offer", href: "/what-i-offer" },
    { key: "blogs" as const, name: "Blogs", href: "/blogs" },
    { key: "contact" as const, name: "Contact", href: "/contact" },
];

export async function Header() {
    const visibility = await getNavVisibility();

    const navigation = ALL_NAV_ITEMS
        .filter((item) => visibility[item.key])
        .map(({ name, href }) => ({ name, href }));

    return <HeaderClient navigation={navigation} />;
}
