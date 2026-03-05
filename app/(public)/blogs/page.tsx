import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getAllBlogs } from '@/lib/supabase-db';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog | Chrixlin IT Solutions',
    description: 'Read the latest insights and updates from Chrixlin IT Solutions.',
};

export default async function BlogsPage() {
    const allBlogs = await getAllBlogs();
    const publishedBlogs = allBlogs.filter(b => b.status === 'published');

    return (
        <div className="container-custom py-24 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold gradient-text-primary">
                        Our Insights
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Stay updated with the latest trends, tips, and news in the world of web and mobile development.
                    </p>
                </div>

                {publishedBlogs.length === 0 ? (
                    <div className="text-center py-20 glass rounded-3xl">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">No posts found</h2>
                        <p className="text-muted-foreground">Check back later for new content!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {publishedBlogs.map((blog) => (
                            <Link
                                key={blog.id}
                                href={`/blogs/${blog.slug}`}
                                className="group flex flex-col glass overflow-hidden rounded-3xl transition-smooth hover:scale-[1.02] border border-white/5 hover:border-primary/20"
                            >
                                <div className="aspect-[16/9] relative overflow-hidden bg-white/5">
                                    {blog.header_image ? (
                                        <Image
                                            src={blog.header_image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FileText className="w-12 h-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center space-x-2 text-sm text-primary mb-4 font-medium">
                                        <Calendar className="w-4 h-4" />
                                        <span>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4 line-clamp-2 transition-colors group-hover:text-primary">
                                        {blog.title}
                                    </h3>

                                    <div className="mt-auto pt-4 flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                                        Read More
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
