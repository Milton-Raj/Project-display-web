import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getBlogBySlug } from '@/lib/supabase-db';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Always fetch fresh from Supabase

interface BlogPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    if (!blog) return { title: 'Blog Not Found' };

    return {
        title: `${blog.title} | Chrixlin IT Solutions`,
        description: blog.title,
    };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog || blog.status !== 'published') {
        notFound();
    }

    return (
        <article className="min-h-screen pb-24">
            {/* Hero Header */}
            <div className="relative h-[50vh] min-h-[400px] w-full mt-20">
                {blog.header_image ? (
                    <Image
                        src={blog.header_image}
                        alt={blog.title}
                        fill
                        priority
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-accent/20" />
                )}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container-custom max-w-4xl px-4 text-center space-y-6">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center text-primary hover:text-white transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Back to Insights
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                            {blog.title}
                        </h1>
                        <div className="flex items-center justify-center space-x-4 text-white/80 font-medium">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-primary" />
                                {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom max-w-4xl px-4 -mt-20 relative z-10">
                <div className="glass-strong p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div
                        className="prose prose-invert prose-lg max-w-none 
              prose-headings:gradient-text-primary prose-headings:font-bold 
              prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-a:text-primary hover:prose-a:text-white prose-a:transition-colors
              prose-img:rounded-3xl prose-img:border prose-img:border-white/10
              prose-strong:text-white prose-blockquote:border-primary prose-blockquote:bg-white/5 prose-blockquote:rounded-r-2xl prose-blockquote:py-1
            "
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

                {/* Share/Meta Footer could go here */}
                <div className="mt-12 text-center">
                    <Link href="/blogs">
                        <Button variant="outline" size="lg" className="rounded-full px-8">
                            Read More Insights
                        </Button>
                    </Link>
                </div>
            </div>
        </article>
    );
}

// Minimal Button shim if not using UI component or to ensure it works
function Button({ children, variant, size, className, ...props }: any) {
    const variants: any = {
        outline: "border border-white/10 bg-transparent hover:bg-white/5 text-white transition-smooth"
    };
    const sizes: any = {
        lg: "h-12 px-8 text-base font-semibold"
    };
    return (
        <button className={`${variants[variant]} ${sizes[size]} ${className} inline-flex items-center justify-center`} {...props}>
            {children}
        </button>
    );
}
