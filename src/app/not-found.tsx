"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 w-[300px] h-[300px] top-1/3 left-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <Card className="p-8 shadow-2xl border border-border/50">
          <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">404 - Page Not Found</h1>
          <p className="text-sm text-muted-foreground mb-8">
            The document workspace or resource you are looking for has been moved, deleted, or does not exist.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" /> Go Home
              </Button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm border border-border hover:bg-muted text-foreground rounded-lg transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
