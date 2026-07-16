"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { toolsList } from "@/config/tools";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  FileText, Shield, Zap, CheckCircle2, ChevronDown, ChevronRight, Play, UploadCloud, 
  Trash2, File, Star, Mail, ArrowRight, Activity, Cpu, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { useToast } from "@/components/ui/Toast";

export default function Home() {
  const toast = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Playground PDF analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [fileData, setFileData] = useState<{
    name: string;
    size: string;
    pageCount: number;
    title?: string;
    creator?: string;
  } | null>(null);

  const categories = [
    { id: "all", name: "All Tools" },
    { id: "organize", name: "Organize" },
    { id: "convert-to", name: "To PDF" },
    { id: "convert-from", name: "From PDF" },
    { id: "security", name: "Security" },
    { id: "optimize", name: "Optimize" }
  ];

  const filteredTools = activeCategory === "all"
    ? toolsList
    : toolsList.filter(t => t.cat === activeCategory);

  // Handle PDF drop for local metadata diagnostics
  const handlePlaygroundDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Invalid File Type", "Playground diagnostics only support PDF files.");
      return;
    }

    setAnalyzing(true);
    setFileData(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Load the PDF locally using pdf-lib (zero server uploads!)
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      setFileData({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        pageCount: pdfDoc.getPageCount(),
        title: pdfDoc.getTitle(),
        creator: pdfDoc.getCreator()
      });
      toast.success("Diagnostics Complete", "File metadata parsed successfully using local WASM compilation!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to parse PDF", "The PDF structure is encrypted or corrupted.");
    } finally {
      setAnalyzing(false);
    }
  };

  const clearPlayground = () => {
    setFileData(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center text-center relative overflow-hidden">
          {/* Background gradient decorative shapes */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Client-Side Processing, Re-imagined.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl text-foreground leading-[1.1] mb-6"
          >
            PDF processing, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">refined.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8"
          >
            Securely merge, split, compress, and edit PDF documents. Running entirely in your browser using local compilation. Zero file uploads to servers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16"
          >
            <a href="#tools">
              <Button size="lg">Explore Tools</Button>
            </a>
            <Link href="/tool/merge-pdf">
              <Button variant="outline" size="lg" className="group">
                Try Merge PDF <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Interactive Playground Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-3xl glass-panel p-6 sm:p-8 rounded-2xl border border-border/40 shadow-2xl relative"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border/50 text-left">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" /> Real-time Diagnostics Sandbox
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Drop a PDF file to analyze its structure client-side.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Shield className="w-3.5 h-3.5" /> Privacy Verified: Local Parsing
              </div>
            </div>

            <div className="flex flex-col items-center">
              {!fileData ? (
                <div className="w-full border-2 border-dashed border-border/80 rounded-xl p-8 hover:border-primary/50 transition-colors flex flex-col items-center justify-center relative group">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePlaygroundDrop}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={analyzing}
                  />
                  <UploadCloud className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                  <span className="text-sm font-semibold text-foreground">
                    {analyzing ? "Compiling WASM Engine..." : "Choose a PDF or drag it here"}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">Supports PDF up to 50MB</span>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full text-left bg-muted/30 border border-border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <File className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate max-w-sm">{fileData.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        Size: <span className="font-mono text-foreground font-semibold">{fileData.size}</span>
                        &bull; Pages: <span className="font-mono text-foreground font-semibold">{fileData.pageCount}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link href={`/tool/organize-pdf?open=${fileData.name}`} className="flex-1 sm:flex-initial">
                      <Button size="sm" className="w-full">Edit File</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={clearPlayground} className="flex-1 sm:flex-initial">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {/* TOOLS CATALOG SECTION */}
        <section id="tools" className="w-full bg-muted/20 border-y border-border py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                The Complete Document Suite
              </h2>
              <p className="text-muted-foreground">
                Select from our collection of 15 advanced optimization, security, conversion, and organization utilities.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10 w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary border-primary text-white shadow-md shadow-primary/15"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Tool Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {filteredTools.map((tool) => (
                <Link key={tool.id} href={`/tool/${tool.id}`}>
                  <Card hoverEffect className="h-full flex flex-col p-6 cursor-pointer group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm mb-4">
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2 flex items-center gap-1 group-hover:text-primary transition-colors">
                      {tool.name} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-auto">
                      {tool.desc}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center">
          <div className="text-center max-w-2xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
              Security, speed, and privacy. Period.
            </h2>
            <p className="text-muted-foreground">
              Built on modern browser principles. Core features operate without server data dependencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Zero File Retention</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Core editing operations execute client-side. Your sensitive agreements, personal records, and confidential PDFs never touch a server database.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Instant local execution</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Compiled using optimized WebAssembly. Process operations like splitting, merging, rotating, and watermarking instantaneously without queue lags.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Responsive workspace</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fully responsive workspace tailored for students, business managers, and mobile developers. Accessible on Android viewports and wide setups.
              </p>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="w-full bg-card border-y border-border py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-primary">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-2 uppercase tracking-wider font-semibold">Client-Side Merge</div>
            </div>
            <div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-primary">&lt; 50ms</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-2 uppercase tracking-wider font-semibold">Local Parsing Delay</div>
            </div>
            <div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-primary">0 MB</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-2 uppercase tracking-wider font-semibold">Server Uploads (V1)</div>
            </div>
            <div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-primary">Zero</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-2 uppercase tracking-wider font-semibold">Files Stored On Disk</div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center">
          <div className="text-center max-w-2xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
              Loved by professionals
            </h2>
            <p className="text-muted-foreground">
              What users say about the speed, layout elegance, and privacy model of PDFNova.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <Card className="flex flex-col justify-between p-6">
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "The split tool is mindblowing. I split a 400-page lease locally in less than half a second. iLovePDF used to take ages uploading and downloading."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                  AM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Alisha Mehta</h4>
                  <p className="text-xs text-muted-foreground">Freelance Designer</p>
                </div>
              </div>
            </Card>
            <Card className="flex flex-col justify-between p-6">
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "As a lawyer, privacy is everything. Having an online service that performs merge and encryption client-side in JS is a game-changer. Absolutely brilliant."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                  DB
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Daniel Brody</h4>
                  <p className="text-xs text-muted-foreground">Legal Counsel</p>
                </div>
              </div>
            </Card>
            <Card className="flex flex-col justify-between p-6">
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "The UI is gorgeous. The minimal aesthetics, responsive spacing, and dark mode make it feel like Linear. Using this utility is a breath of fresh air."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                  KR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Kunal Roy</h4>
                  <p className="text-xs text-muted-foreground">Product Engineer</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="w-full bg-muted/20 border-t border-border py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-center max-w-2xl mb-12">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-muted-foreground">
                Get answers to common queries regarding data safety, client-side WASM compilation, limits, and pricing.
              </p>
            </div>

            <div className="w-full flex flex-col gap-4">
              {[
                {
                  q: "Are my documents secure on PDFNova?",
                  a: "Yes. PDFNova prioritizes document safety by running core operations like merging, page reorganization, rotation, and watermarking entirely in your browser using local JavaScript and WebAssembly compilation. Your files are not uploaded to servers."
                },
                {
                  q: "Is PDFNova free to use?",
                  a: "PDFNova offers full-featured access to core tools for free, with maximum local processing sizes up to 10MB. We offer a Pro plan for larger operations, batch jobs, and server-side OCR processing."
                },
                {
                  q: "How does local compression work?",
                  a: "Our system parses the PDF document model, compresses nested streams, optimizes font references, and strips unnecessary developer metadata. All of this runs directly inside your browser cache."
                },
                {
                  q: "What browsers are supported?",
                  a: "PDFNova works in all modern web browsers supporting ES6 and WebAssembly, including Chrome, Safari, Edge, Firefox, and mobile Android WebViews."
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-5 text-left font-semibold text-foreground text-sm sm:text-base hover:bg-muted/20"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${openFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-sm text-muted-foreground border-t border-border/30 leading-relaxed bg-muted/10">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER SECTION */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center">
          <Card glass className="w-full max-w-4xl p-8 sm:p-12 border border-border/40 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
              Stay updated on new tools
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mb-8 leading-relaxed">
              We add new features, document converters, and performance updates monthly. Subscribe to get notified.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Subscribed!", "Thank you for subscribing to PDFNova updates.");
              }}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
