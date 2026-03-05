import { Metadata } from 'next';
import { getPageContent } from '@/lib/database';

export const metadata: Metadata = {
    title: 'Privacy Policy | Chrixlin IT Solutions',
    description: 'Privacy Policy for Chrixlin IT Solutions',
};

export default async function PrivacyPolicyPage() {
    const pageData = await getPageContent('privacy-policy');
    const data = pageData?.content || {};

    return (
        <div className="container-custom py-24 min-h-screen">
            <div className="max-w-4xl mx-auto glass-strong p-8 md:p-12 rounded-3xl mt-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text-primary text-center">
                    {data.title || 'Privacy Policy'}
                </h1>

                {data.content ? (
                    <div className="space-y-8 text-muted-foreground prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />
                ) : (
                    <div className="space-y-8 text-muted-foreground">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
                            <p className="leading-relaxed">
                                Welcome to Chrixlin IT Solutions. We respect your privacy and are committed to protecting your personal data.
                            </p>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
