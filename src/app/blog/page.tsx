"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookOpen, Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  cat: string;
  date: string;
  readTime: string;
  author: string;
}

const postsList: Post[] = [
  {
    id: "how-to-compress-pdf-without-losing-quality",
    title: "How to Compress PDF Files Without Losing Text Quality",
    excerpt: "Learn how browser-side compilation optimizes PDF file sizes by compressing resource streams and stripping redundant metadata streams.",
    cat: "PDF Tips",
    date: "July 15, 2026",
    readTime: "4 min read",
    author: "Kunal Roy"
  },
  {
    id: "complete-guide-to-pdf-security",
    title: "The Complete Guide to PDF Security: Passwords & Permissions",
    excerpt: "Explore the differences between owner and user passwords, and understand how to encrypt sensitive office documents client-side.",
    cat: "Document Guides",
    date: "July 12, 2026",
    readTime: "6 min read",
    author: "Daniel Brody"
  },
  {
    id: "optimizing-office-workflows-with-pdf-merging",
    title: "Optimizing Office Workflows with Fast Browser Merging",
    excerpt: "Consolidate your monthly invoices, client pitches, and structural agreements into clean document templates instantly.",
    cat: "Office Tutorials",
    date: "July 08, 2026",
    readTime: "3 min read",
    author: "Alisha Mehta"
  },
  {
    id: "student-guide-organizing-digital-notes",
    title: "Student Guide: Organizing Digital PDF Notes for Exams",
    excerpt: "Discover tips for splitting large syllabi textbooks, reordering exam slides, and merging research papers locally.",
    cat: "Student Guides",
    date: "July 02, 2026",
    readTime: "5 min read",
    author: "Kunal Roy"
  }
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    "all",
    "PDF Tips",
    "Document Guides",
    "Office Tutorials",
    "Student Guides",
    "Productivity",
    "How-To Articles"
  ];

  const filteredPosts = activeCategory === "all"
    ? postsList
    : postsList.filter(p => p.cat === activeCategory);

  const featured = postsList[0];

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-16">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-4">
            PDFNova Journal & Guides
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Tips, tutorials, and deep-dives on browser WebAssembly, document security, and productivity workflows.
          </p>
        </div>

        {/* Featured Post */}
        {activeCategory === "all" && featured && (
          <section className="w-full">
            <Card className="p-0 border border-border/50 bg-card overflow-hidden grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 sm:p-12 flex flex-col justify-between h-full">
                <div className="flex flex-col gap-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Tag className="w-3.5 h-3.5" /> Featured Post &bull; {featured.cat}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight hover:text-primary transition-colors">
                    <Link href={`/blog/${featured.id}`}>{featured.title}</Link>
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    {featured.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-border/40 pt-6 mt-8">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="w-3.5 h-3.5" /> {featured.author}
                    <span className="text-muted-foreground/50">&bull;</span>
                    <Calendar className="w-3.5 h-3.5" /> {featured.date}
                  </div>
                  <Link href={`/blog/${featured.id}`}>
                    <Button variant="ghost" size="sm" className="group">
                      Read Article <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-tr from-primary/10 to-blue-500/10 border-t lg:border-t-0 lg:border-l border-border/50 min-h-[300px] flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-primary/20" />
              </div>
            </Card>
          </section>
        )}

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full pb-4 border-b border-border/40">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                activeCategory === cat
                  ? "bg-primary border-primary text-white"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat === "all" ? "All Posts" : cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-6 border border-border/60 bg-card/40 flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-semibold text-primary">{post.cat}</span>
                <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors leading-tight">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border/30 pt-4 mt-6">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
                <Link href={`/blog/${post.id}`} className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
