"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Info } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mt-1">Last Updated: July 16, 2026</p>
        </div>

        <Card className="p-4 border border-blue-500/20 bg-blue-500/5 flex gap-3 items-start text-blue-800 dark:text-blue-300">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">Local-First Data Policy</p>
            <p className="mt-1 opacity-90 leading-relaxed">
              PDFNova processes core operations (merge, split, compress, watermark, rotate) entirely inside your web browser. Your document payloads are not uploaded to our cloud servers.
            </p>
          </div>
        </Card>

        <article className="prose dark:prose-invert max-w-none text-sm text-muted-foreground space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">1. Data We Collect</h2>
            <p>
              We collect minimal analytical metadata to troubleshoot crashes and improve WebAssembly execution speeds. When you create an account, we store your email address and profile name to sync preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">2. Document Storage Policy</h2>
            <p>
              Free utility files remain inside your local browser cache memory. In advanced OCR conversions, document content is uploaded to secure, encrypted Firebase Storage directories, processed, and completely deleted within 2 hours of completion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">3. Analytics and Cookies</h2>
            <p>
              We utilize Google Analytics to monitor traffic counts and device categories (for mobile WebView compatibility). You can disable cookies in browser options without impacting document workspace tools.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
