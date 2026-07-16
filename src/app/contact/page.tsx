"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { Mail, MessageSquare, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;

    setSubmitting(true);
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);

    setName("");
    setEmail("");
    setMsg("");
    toast.success("Message Transmitted", "Thank you! Our support engineers will contact you shortly.");
  };

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4"
          >
            Get in touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Have a question about plan licensing, API structures, or custom enterprise terms?
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="md:col-span-2">
            <Card className="p-8 border border-border/50 bg-card">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Message Body
                  </label>
                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Provide details about your query..."
                    rows={5}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={submitting}>
                  Transmit Message <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </Card>
          </div>

          {/* Quick Info Cards */}
          <div className="flex flex-col gap-6">
            <Card className="p-6 border border-border/50 bg-card flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-foreground text-sm">Direct Support Email</h4>
                <p className="text-xs text-muted-foreground mt-1">support@pdfnova.com</p>
                <p className="text-[10px] text-muted-foreground mt-2">Response within 24 hours.</p>
              </div>
            </Card>
            <Card className="p-6 border border-border/50 bg-card flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-foreground text-sm">Legal Operations</h4>
                <p className="text-xs text-muted-foreground mt-1">legal@pdfnova.com</p>
                <p className="text-[10px] text-muted-foreground mt-2">For NDA, GDPR, and DPAs.</p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
