"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { ChevronDown, HelpCircle, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does PDFNova protect my documents?",
      a: "PDFNova processes your documents locally using WebAssembly and client-side JavaScript. This means actions like merging, splitting, rotating, watermarking, and deleting pages occur entirely inside your browser's local sandbox, without transmitting files to external servers.",
      cat: "security"
    },
    {
      q: "What is client-side processing?",
      a: "Client-side processing refers to running code directly on the user's device (the client) rather than a remote server. For PDFNova, this means your browser executes the calculations required to edit or convert files, which increases processing speed and privacy.",
      cat: "technology"
    },
    {
      q: "Does PDFNova store files on its servers?",
      a: "No. PDFNova does not upload or retain your files on any remote storage disk for core functions. In advanced features (like heavy OCR processing), files are temporarily uploaded to an encrypted Firebase Storage bucket, processed, and deleted automatically within 2 hours.",
      cat: "privacy"
    },
    {
      q: "Can I use PDFNova offline?",
      a: "We are developing full offline Progressive Web App (PWA) support. Currently, you need an internet connection to load the website assets, but once loaded, the processing utilities operate without sending data online.",
      cat: "usage"
    },
    {
      q: "Is there a file size limit?",
      a: "Free accounts can process documents up to 10MB each. Pro accounts support large uploads up to 5GB for heavy server-fallback actions.",
      cat: "billing"
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Support & FAQs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Find detailed information regarding privacy models, WebAssembly processing, and billing options.
          </motion.p>
        </div>

        {/* Search filter input */}
        <div className="relative max-w-md w-full mx-auto">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. privacy, size)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>

        {/* Accordions */}
        <div className="flex flex-col gap-4 max-w-3xl w-full mx-auto">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-foreground hover:bg-muted/20"
                >
                  <span className="flex items-center gap-3 text-sm sm:text-base">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0" /> {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${openIdx === idx ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openIdx === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-sm text-muted-foreground border-t border-border/30 bg-muted/10 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center p-12 text-muted-foreground text-sm">
              No results match your search query.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
