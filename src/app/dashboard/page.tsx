"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import Header from "@/components/Header";
import { toolsList } from "@/config/tools";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { 
  User, LayoutDashboard, History, Download, Star, Settings, ShieldAlert,
  HardDrive, ChevronRight, Layers, File, Sparkles, Clock, Trash2, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

interface HistoryRecord {
  id: string;
  toolType: string;
  createdAt: any;
  status: string;
  outputFile?: {
    fileName: string;
    fileSize: number;
    downloadUrl: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const toast = useToast();
  const { user, loading } = useAuth();
  const { showAuthModal } = useAuthModal();
  
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  // Auth Redirect protection
  useEffect(() => {
    if (!loading && !user) {
      setShowPlaceholder(true);
      showAuthModal("Please sign in to view your dashboard workspace and synced processing history.");
    }
  }, [user, loading, showAuthModal]);

  // Load user history and favorites
  useEffect(() => {
    if (!user) return;

    const loadUserData = async (retries = 3) => {
      try {
        // Query user processing history
        const q = query(
          collection(db, "sessions"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const records: HistoryRecord[] = [];
        querySnapshot.forEach((doc) => {
          records.push({ id: doc.id, ...doc.data() } as HistoryRecord);
        });
        setHistory(records);

        // Fetch favorites from localStorage
        const savedFavs = localStorage.getItem(`favs_${user.uid}`);
        if (savedFavs) {
          setFavorites(JSON.parse(savedFavs));
        } else {
          const defaultFavs = ["merge-pdf", "compress-pdf", "protect-pdf"];
          setFavorites(defaultFavs);
          localStorage.setItem(`favs_${user.uid}`, JSON.stringify(defaultFavs));
        }
      } catch (err: any) {
        if ((err?.code === "unavailable" || err?.message?.includes("offline")) && retries > 0) {
          // Firestore temporarily offline (common after hot reload) — retry silently
          setTimeout(() => loadUserData(retries - 1), 2000);
          return;
        }
        // Non-retryable error — just show empty state, don't crash
        console.warn("Dashboard data load skipped:", err?.code || err?.message);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadUserData();
  }, [user]);

  const toggleFavorite = (toolId: string) => {
    if (!user) return;
    const nextFavs = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    setFavorites(nextFavs);
    localStorage.setItem(`favs_${user.uid}`, JSON.stringify(nextFavs));
    toast.success(
      favorites.includes(toolId) ? "Removed from Favorites" : "Added to Favorites",
      `Successfully updated your dashboard shortcuts.`
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground font-medium">Loading your workspace...</span>
        </div>
      </div>
    );
  }

  if (showPlaceholder && !user) {
    return (
      <div className="flex-1 flex flex-col bg-background min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 border border-border/50 shadow-2xl flex flex-col items-center text-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-foreground">Sign In Required</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You must be logged in to view your dashboard workspace, document processing history, and favorite shortcuts.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 w-full">
              <Button size="md" className="w-full" onClick={() => showAuthModal("Please sign in to view your dashboard workspace and synced processing history.")}>
                Sign In to PDFNova
              </Button>
              <Link href="/" className="w-full">
                <Button size="md" variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                  Go Back to Tools
                </Button>
              </Link>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Safely cast user as non-null since guards verified presence
  const activeUser = user!;

  // Calculate storage usage (simulated dashboard quota)
  const usedStorageMB = history.reduce((acc, h) => acc + (h.outputFile?.fileSize || 0), 0) / (1024 * 1024);
  const totalStorageMB = activeUser.email?.includes("pro") ? 5000 : 100; // 100MB Free / 5GB Pro
  const storagePercentage = Math.min((usedStorageMB / totalStorageMB) * 100, 100);

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              Welcome back, {activeUser.displayName || "Nova User"} <Sparkles className="w-5 h-5 text-primary" />
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Here is a summary of your PDF workspaces and activity.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline" size="sm">Go to Homepage</Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button size="sm">Account Settings</Button>
            </Link>
          </div>
        </section>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Quick Access, History, Details */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Favorites & Quick Access */}
            <section className="flex flex-col gap-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Favorite PDF Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {toolsList
                  .filter(t => favorites.includes(t.id))
                  .slice(0, 3)
                  .map((tool) => (
                    <Card key={tool.id} className="relative group p-4 border border-border/50 bg-card hover:border-primary/20 transition-all flex flex-col justify-between">
                      <button
                        onClick={() => toggleFavorite(tool.id)}
                        className="absolute top-3 right-3 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star className="w-4.5 h-4.5 fill-amber-500" />
                      </button>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <tool.icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground mb-1">{tool.name}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{tool.desc}</p>
                      </div>
                      <Link href={`/tool/${tool.id}`} className="mt-4">
                        <Button variant="ghost" size="sm" className="w-full text-xs h-8">Open Workspace</Button>
                      </Link>
                    </Card>
                  ))}
                {favorites.length === 0 && (
                  <div className="col-span-3 text-center p-6 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                    No tools added to favorites yet. Use stars on the homepage or header.
                  </div>
                )}
              </div>
            </section>

            {/* Processing History */}
            <section className="flex flex-col gap-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> Recent PDF Operations
              </h2>
              <Card className="p-0 border border-border/60 overflow-hidden bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/40 border-b border-border/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">Operation</th>
                        <th className="px-5 py-3.5">Processed File</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {loadingHistory ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground text-xs">
                            Querying records...
                          </td>
                        </tr>
                      ) : history.length > 0 ? (
                        history.map((record) => (
                          <tr key={record.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-5 py-3.5 font-semibold text-foreground flex items-center gap-2">
                              <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
                              {toolsList.find(t => t.id === record.toolType)?.name || record.toolType}
                            </td>
                            <td className="px-5 py-3.5 text-muted-foreground max-w-[200px] truncate">
                              {record.outputFile?.fileName || "ProcessedDocument.pdf"}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                record.status === "completed"
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                  : "bg-red-500/10 border-red-500/20 text-red-500"
                              }`}>
                                {record.status === "completed" ? "Completed" : "Failed"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              {record.status === "completed" && record.outputFile?.downloadUrl ? (
                                <a href={record.outputFile.downloadUrl} download className="inline-flex items-center text-primary hover:underline gap-1 text-xs">
                                  <Download className="w-3 h-3" /> Fetch File
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground">&mdash;</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                            <Clock className="w-8 h-8 mx-auto text-muted-foreground/60 mb-2" />
                            <p className="text-sm font-semibold">No recent activity</p>
                            <p className="text-xs mt-1 text-muted-foreground/75">Process a PDF using our client utilities to log data.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>
          </div>

          {/* Column 3: Sidebar Details, Account, Storage, Plan Status */}
          <div className="flex flex-col gap-6">
            
            {/* Account Summary Card */}
            <Card className="border border-border/50 bg-card p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Workspace Profile</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shrink-0">
                  {(activeUser.displayName || activeUser.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-foreground text-sm truncate">{activeUser.displayName || "Nova User"}</h4>
                  <p className="text-xs text-muted-foreground truncate">{activeUser.email}</p>
                </div>
              </div>
              
              <hr className="border-border/50" />
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Account Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5" /> {activeUser.email?.includes("pro") ? "Pro Workspace" : "Free Tier"}
                </span>
              </div>
            </Card>

            {/* Storage Usage Visual Card */}
            <Card className="border border-border/50 bg-card p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nova Storage</h3>
                <HardDrive className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-foreground">{usedStorageMB.toFixed(2)} MB of {totalStorageMB} MB used</span>
                  <span className="text-muted-foreground">{storagePercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-muted border border-border/40 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${storagePercentage}%` }} />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal">
                PDFNova deletes temporary files from Firebase Storage automatically after 2 hours. File histories store download URL meta references.
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
