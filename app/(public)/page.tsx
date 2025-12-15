import { HeroSection } from "@/components/home/HeroSection";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { getFeaturedProjects, getAllProjects } from "@/lib/database";
import { getPageContent } from "@/lib/database";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutContent } from "@/components/about/AboutContent";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { ContactContent } from "@/components/contact/ContactContent";
import { WhatIOfferContent } from "@/components/what-i-offer/WhatIOfferContent";

export const revalidate = 60; // Cache for 60 seconds

export default async function HomePage() {
  // Fetch featured projects
  const allFeaturedProjects = await getFeaturedProjects();
  const featuredProjects = allFeaturedProjects.slice(0, 3);
  // Fetch page content
  const pageData = await getPageContent('home');
  const data = pageData?.content || {};

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection
        badge={data.heroBadge}
        title={data.heroTitle}
        subtitle={data.heroSubtitle}
        stats={data.heroStats}
      />

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="container-custom py-12 md:py-20">
          <div className="space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                {data.featuredTitle || (
                  <>
                    Featured <span className="gradient-text">Projects</span>
                  </>
                )}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {data.featuredDescription || "Explore some of my best work showcasing innovation, design, and technical excellence."}
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center pt-8">
              <Link href="/projects">
                <Button variant="gradient" size="lg" className="group">
                  View All Projects
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container-custom py-12 md:py-20">
        <div className="glass-strong rounded-3xl p-12 md:p-16 text-center space-y-8 shadow-premium-lg">
          <h2 className="text-4xl md:text-5xl font-bold">
            {data.ctaTitle || (
              <>
                Ready to Build Something <span className="gradient-text">Amazing?</span>
              </>
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {data.ctaDescription || "Let's collaborate and turn your vision into reality. Get in touch to discuss your next project."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button variant="gradient" size="xl">
                Start a Project
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="xl">
                View Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
