"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { Mail, ArrowRight, RotateCw } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const router = useRouter();
  const toast = useToast();
  const { user, sendVerification } = useAuth();
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await sendVerification();
      toast.success("Verification Sent", "A new verification email has been sent to your inbox.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to Send", "Too many requests. Please wait before trying again.");
    } finally {
      setResending(false);
    }
  };

  const handleRefresh = () => {
    // Reload window to force reload user profile token/verification check
    window.location.reload();
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative min-h-screen">
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 w-[300px] h-[300px] top-1/3 left-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-2xl border border-border/50 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">Verify your email</h1>
          <p className="text-sm text-muted-foreground mb-6">
            We have sent a verification link to your registered email address. Please click the link to activate your workspace profile.
          </p>

          {user && (
            <div className="bg-muted/30 border border-border rounded-xl p-3 mb-6 text-xs text-muted-foreground truncate">
              Sent to: <span className="text-foreground font-semibold">{user.email}</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={handleRefresh} className="w-full">
              I have verified my email <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={handleResend}
              isLoading={resending}
              className="w-full border-border/70 text-foreground hover:bg-muted"
            >
              <RotateCw className="w-4 h-4 mr-2" /> Resend Verification Email
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Want to login with a different email?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-semibold">
              Go to Login
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
