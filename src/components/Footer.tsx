"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                N
              </div>
              <span className="font-sans font-bold text-lg text-foreground">
                PDF<span className="text-primary font-medium">Nova</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium browser-based PDF processing. Fast, secure, private, and zero server uploads for core editing.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Convert</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/tool/pdf-to-word" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link href="/tool/word-to-pdf" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Word to PDF
                </Link>
              </li>
              <li>
                <Link href="/tool/jpg-to-pdf" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  JPG to PDF
                </Link>
              </li>
              <li>
                <Link href="/tool/pdf-to-jpg" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  PDF to JPG
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Edit & Security</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/tool/merge-pdf" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/tool/split-pdf" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href="/tool/compress-pdf" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/tool/protect-pdf" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Protect PDF
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog & Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ & Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-border/60 my-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} PDFNova. All rights reserved. Made for productivity.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
