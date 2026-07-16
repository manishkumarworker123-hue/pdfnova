"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Check, Sparkles, Shield, Zap, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center">
        <div className="text-center max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4"
          >
            A plan for every workspace.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Whether you are a student processing homework or a legal team securing confidential documents.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-20">
          
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full p-8 border border-border/60 bg-card flex flex-col justify-between relative overflow-hidden">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Free Sandbox</h3>
                <p className="text-xs text-muted-foreground mb-6">For individuals and students needing occasional PDF changes.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-foreground">$0</span>
                  <span className="text-xs text-muted-foreground">/ forever</span>
                </div>
                
                <hr className="border-border/50 mb-8" />

                <ul className="space-y-4">
                  {[
                    "Local-first client-side processing",
                    "Max file upload size: 10MB",
                    "Merge, Split, Rotate, Delete pages",
                    "Instant document compilation",
                    "Ad-supported dashboard view"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button variant="outline" className="w-full mt-8 border-border/80 text-foreground hover:bg-muted">
                Get Started
              </Button>
            </Card>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full p-8 border-2 border-primary bg-card/50 flex flex-col justify-between relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-lg">
                Recommended
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  Pro Workspace <Sparkles className="w-4 h-4 text-primary" />
                </h3>
                <p className="text-xs text-muted-foreground mb-6">For business lawyers, government agents, and power office workers.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-foreground">$9</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                
                <hr className="border-border/50 mb-8" />

                <ul className="space-y-4">
                  {[
                    "Uncapped local & cloud files limits",
                    "Max file upload size: 5GB",
                    "Cloud-fallback heavy OCR utility support",
                    "Batch file queue operations",
                    "Premium direct-download cloud buckets",
                    "Priority workspace email support",
                    "Ad-free premium interface"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button className="w-full mt-8">
                Upgrade to Pro
              </Button>
            </Card>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
