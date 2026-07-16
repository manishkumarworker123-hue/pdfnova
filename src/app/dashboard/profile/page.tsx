"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { updateProfile, updatePassword, deleteUser } from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { 
  User, ShieldAlert, Key, LogOut, Trash2, ArrowLeft, Save, Shield
} from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const router = useRouter();
  const toast = useToast();
  const { user, loading, logOut } = useAuth();
  
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    } else if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !displayName) return;

    setUpdatingProfile(true);
    try {
      await updateProfile(user, { displayName });
      // Sync to Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName,
        updatedAt: new Date()
      });
      toast.success("Profile Updated", "Your details have been saved successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Update Failed", "Could not sync display name details.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !password) return;

    if (password.length < 6) {
      toast.warning("Validation Error", "Password must be at least 6 characters.");
      return;
    }

    setUpdatingPassword(true);
    try {
      await updatePassword(user, password);
      setPassword("");
      toast.success("Password Updated", "Your account credentials have been successfully updated.");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/requires-recent-login") {
        toast.error("Re-authentication Needed", "For security, please log out and log back in to change password.");
      } else {
        toast.error("Password Update Failed", "An error occurred while modifying password.");
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmDelete = window.confirm("Are you absolutely sure you want to delete your PDFNova account? This action is permanent and deletes all process logs.");
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const uid = user.uid;
      // Delete from Firestore
      await deleteDoc(doc(db, "users", uid));
      // Delete Firebase Auth User
      await deleteUser(user);
      toast.success("Account Deleted", "Your PDFNova account was removed. Sorry to see you go!");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/requires-recent-login") {
        toast.error("Re-authentication Needed", "For security, please log out and login again before deleting account.");
      } else {
        toast.error("Deletion Failed", "An error occurred while deleting your profile data.");
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        <div>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Account settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your personal workspace and security credentials.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Info */}
          <div className="flex flex-col gap-4">
            <Card className="p-6 border border-border/50 bg-card">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Verification Status</h3>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Verified Email Profile</p>
                  <p className="text-muted-foreground mt-0.5">{user.email}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Column 2 & 3: Settings Panel */}
          <div className="md:col-span-2 flex flex-col gap-8">
            {/* Display Name Settings */}
            <Card className="border border-border/50 bg-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Profile Settings</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                <Button type="submit" size="sm" isLoading={updatingProfile}>
                  <Save className="w-4 h-4 mr-2" /> Save Details
                </Button>
              </form>
            </Card>

            {/* Security password settings */}
            <Card className="border border-border/50 bg-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Security & Credentials</h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm" isLoading={updatingPassword}>
                  <Key className="w-4 h-4 mr-2" /> Change Password
                </Button>
              </form>
            </Card>

            {/* Dangerous Zone */}
            <Card className="border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 mb-2">Dangerous Zone</h3>
              <p className="text-xs text-muted-foreground mb-6">
                Deleting your account will purge all associated document compilation history logs from the platform.
              </p>
              <Button variant="destructive" size="sm" onClick={handleDeleteAccount} isLoading={deleting}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account Permanently
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
