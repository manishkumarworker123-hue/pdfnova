"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, Mail, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const toast = useToast();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
      toast.success("Reset Link Sent", "Please check your email address for a link to reset your password.");
    } catch (err: any) {
      console.error(err);
      toast.error("Error Sending Link", "We couldn't send the password reset email. Please verify the email is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative min-h-screen">
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 w-[300px] h-[300px] top-1/3 left-1/2 -translate-x-1/2" />

      <Link href="/auth/login" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-2xl border border-border/50">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter your email and we'll send a secure reset link</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={loading}>
                <Key className="w-4 h-4 mr-2" /> Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center p-4 bg-muted/20 border border-border rounded-xl">
              <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground text-sm">Check your inbox</h3>
              <p className="text-xs text-muted-foreground mt-2">
                We have emailed a password reset link to <span className="text-foreground font-semibold">{email}</span>. Follow the link to select a new password.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" size="sm" className="mt-4">
                Enter different email
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
