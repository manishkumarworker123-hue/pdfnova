import React from "react";
import { Metadata } from "next";
import Header from "@/components/Header";
import { toolsList } from "@/config/tools";
import Footer from "@/components/Footer";
import ToolWorkspaceClient from "@/components/tools/ToolWorkspaceClient";
import { seoContentRegistry } from "@/config/seoContent";
import { ChevronRight, Layers, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

interface ToolPageProps {
  params: Promise<{
    toolId: string;
  }>;
}

// Next.js App Router dynamic metadata generator
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const toolId = resolvedParams.toolId;
  const content = seoContentRegistry[toolId];

  if (!content) {
    return {
      title: "PDF Tool Workspace - PDFNova",
      description: "Secure, client-side browser PDF tool sandbox."
    };
  }

  return {
    title: content.title,
    description: content.metaDesc,
    alternates: {
      canonical: `https://pdfnova.com/tool/${toolId}`
    },
    openGraph: {
      title: content.title,
      description: content.metaDesc,
      url: `https://pdfnova.com/tool/${toolId}`,
      siteName: "PDFNova",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.metaDesc
    }
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const toolId = resolvedParams.toolId;
  const content = seoContentRegistry[toolId];
  const tool = toolsList.find(t => t.id === toolId);

  if (!content || !tool) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 bg-background text-foreground">
        <h1 className="text-xl font-bold">Tool Not Found</h1>
        <Link href="/" className="text-primary hover:underline mt-4">Back to Homepage</Link>
      </div>
    );
  }

  // Schema Markup (JSON-LD)
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.name,
    "operatingSystem": "All",
    "applicationCategory": "Utility",
    "browserRequirements": "Requires HTML5 and WebAssembly compatibility.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://pdfnova.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://pdfnova.com#tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.name,
        "item": `https://pdfnova.com/tool/${toolId}`
      }
    ]
  };

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      {/* Inject Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-16">
        
        {/* Breadcrumb Navigation UI */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href="/#tools" className="hover:text-foreground transition-colors">Tools</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold">{tool.name}</span>
        </nav>

        {/* 1. Main Workspace Component Container (Dynamic Client-Side WASM sandbox) */}
        <section className="flex flex-col gap-6" aria-label="Tool Workspace">
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{content.h1}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{content.intro}</p>
          </div>

          <ToolWorkspaceClient toolId={toolId} />
        </section>

        {/* 2. Content Sections - Technical SEO Content Engine (Pre-rendered on Server) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-border/60 pt-16">
          
          {/* Main Info Blocks (Cols 1 & 2) */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Steps & Guide */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground">How to use {tool.name}</h2>
              <ol className="list-decimal pl-5 space-y-3.5 text-sm text-muted-foreground">
                {content.steps.map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    <span className="text-foreground font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Benefits & Use Cases Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Benefits</h3>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {content.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Common Use Cases</h3>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {content.useCases.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQs Accordion Block */}
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold text-foreground">Frequently Asked Questions</h2>
              <div className="flex flex-col gap-4">
                {content.faqs.map((faq, i) => (
                  <div key={i} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-2">
                    <h4 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-primary shrink-0" /> {faq.q}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6 border-l border-primary/20">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Tips & Related Tools (Col 3) */}
          <div className="flex flex-col gap-8">
            {/* Quick Tips */}
            <Card className="border border-border/50 bg-card/40 p-6 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Tips</h3>
              <ul className="list-disc pl-5 space-y-3 text-xs text-muted-foreground leading-relaxed">
                {content.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </Card>

            {/* Related Tools Links */}
            <Card className="border border-border/50 bg-card/40 p-6 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Related Tools</h3>
              <div className="flex flex-col gap-2.5">
                {content.relatedTools.map((id) => {
                  const related = toolsList.find(t => t.id === id);
                  if (!related) return null;
                  return (
                    <Link
                      key={id}
                      href={`/tool/${id}`}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:border-primary/20 hover:bg-muted/10 text-xs font-medium text-muted-foreground hover:text-foreground transition-all group"
                    >
                      <span className="flex items-center gap-2">
                        <related.icon className="w-3.5 h-3.5 text-primary shrink-0" /> {related.name}
                      </span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
