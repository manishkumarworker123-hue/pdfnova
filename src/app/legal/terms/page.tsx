"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mt-1">Last Updated: July 16, 2026</p>
        </div>

        <article className="prose dark:prose-invert max-w-none text-sm text-muted-foreground space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">1. User Agreements</h2>
            <p>
              By accessing PDFNova, you agree to comply with local document handling laws. You represent that you own or have permission to process uploaded document content.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">2. Usage Limits</h2>
            <p>
              Free accounts are limited to processing files smaller than 10MB. Automated scraping or submitting rapid batch calls that disrupt client-side performance is prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">3. Liability</h2>
            <p>
              PDFNova compiles documents on an "as-is" basis. Since operations run client-side, we are not responsible for local data crashes, browser cache clearing, or formatting discrepancies.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
