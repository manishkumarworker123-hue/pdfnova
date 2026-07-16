"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Shield, Zap, Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4"
          >
            We believe in document privacy.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            PDFNova was founded in 2026 to fix legacy document editors that upload user data to remote databases. By moving compilation engines directly into browser caches, we protect user privacy without sacrificing processing speed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <Card className="p-6 border border-border/50 bg-card">
            <Shield className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Privacy first</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We leverage browser sandbox features to execute edits locally. Legal forms, identification files, and contracts remain private to the user's viewport.
            </p>
          </Card>
          <Card className="p-6 border border-border/50 bg-card">
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Performance driven</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Using Rust and WebAssembly, compilation happens instantly. No file upload limits, network delays, or processing queues.
            </p>
          </Card>
        </div>

        <div className="flex flex-col gap-6 text-left max-w-2xl mx-auto border-t border-border/60 pt-10">
          <h2 className="text-xl font-bold text-foreground">The PDFNova Story</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Existing PDF management software is slow, cluttered with advertisements, and requires uploading confidential files. PDFNova replaces these complex servers with lightweight, fast client-side applications.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            From merge tools to advanced password encryption, we construct document utilities that execute inside standard caches. We are expanding to support offline client execution, making PDFNova the premium choice.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
