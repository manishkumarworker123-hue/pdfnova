"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { 
  Sun, Moon, Menu, X, ChevronDown, Search, History, Settings, LogOut, LayoutDashboard,
  Layers, Scissors, Minimize2, FileText, Lock, Unlock, Stamp, Type, RefreshCw, Trash2, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toolsList } from "@/config/tools";

export default function Header() {
  const pathname = usePathname();
  const { user, logOut, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
    setAvatarDropdownOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const filteredTools = searchQuery
    ? toolsList.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    : toolsList;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/25">
              N
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              PDF<span className="text-primary font-medium">Nova</span>
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                onMouseEnter={() => setToolsDropdownOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground h-16 transition-colors"
              >
                Tools <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {toolsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setToolsDropdownOpen(false)}
                    className="absolute left-0 mt-0 w-[580px] bg-card border border-border rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-4 backdrop-blur-xl"
                  >
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Popular Tools</h4>
                      <div className="flex flex-col gap-2">
                        {toolsList.slice(0, 5).map((tool) => (
                          <Link
                            key={tool.id}
                            href={`/tool/${tool.id}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/80 group transition-all"
                          >
                            <div className="p-1.5 rounded bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <tool.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-foreground">{tool.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{tool.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">All Categories</h4>
                      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                        {toolsList.slice(5).map((tool) => (
                          <Link
                            key={tool.id}
                            href={`/tool/${tool.id}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/80 group transition-all"
                          >
                            <div className="p-1.5 rounded bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                              <tool.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-foreground">{tool.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{tool.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            aria-label="Search Tools"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* User Auth Info */}
          {!loading && (
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                    className="w-9 h-9 rounded-full bg-primary/10 border border-border flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-primary">
                        {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {avatarDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-1 backdrop-blur-xl"
                      >
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-xs text-muted-foreground">Signed in as</p>
                          <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                          <Settings className="w-4 h-4" /> Profile
                        </Link>
                        <button
                          onClick={() => logOut()}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">PDF Tools</span>
                <div className="grid grid-cols-2 gap-2">
                  {toolsList.slice(0, 8).map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tool/${tool.id}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm font-medium text-foreground transition-all"
                    >
                      <tool.icon className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <hr className="border-border/50" />
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground px-2">
                Pricing
              </Link>
              <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground px-2">
                Blog
              </Link>
              <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-foreground px-2">
                FAQ
              </Link>
              <hr className="border-border/50" />
              {!loading && (
                <div className="flex flex-col gap-2 px-2">
                  {user ? (
                    <>
                      <div className="text-xs text-muted-foreground">Logged in as <span className="font-semibold text-foreground">{user.email}</span></div>
                      <Link href="/dashboard" className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/dashboard/profile" className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                        <Settings className="w-4 h-4" /> Profile
                      </Link>
                      <button
                        onClick={() => logOut()}
                        className="flex items-center gap-2 py-2 text-sm text-red-600 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-4">
                      <Link href="/auth/login" className="flex-1">
                        <Button variant="outline" className="w-full">Sign In</Button>
                      </Link>
                      <Link href="/auth/signup" className="flex-1">
                        <Button className="w-full">Get Started</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Command Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-card border border-border w-full max-w-xl rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search PDF tools (e.g., Merge, OCR, Compress)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-base"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2 max-h-80 overflow-y-auto">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tool/${tool.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/80 group transition-all"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <tool.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{tool.name}</div>
                        <div className="text-xs text-muted-foreground">{tool.desc}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No tools found for "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
