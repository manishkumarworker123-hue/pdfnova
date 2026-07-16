"use client";

import React, { createContext, useContext, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { Shield, Mail, Sparkles } from "lucide-react";

interface AuthModalContextType {
  showAuthModal: (message?: string) => void;
  hideAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  const { signInWithGoogle } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const showAuthModal = (message = "Sign in to save processing history and access premium features.") => {
    setModalMessage(message);
    setIsOpen(true);
  };

  const hideAuthModal = () => {
    setIsOpen(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success("Welcome back", "Signed in successfully with Google.");
      setIsOpen(false);
    } catch (e: any) {
      console.error(e);
      toast.error("Google Sign In Failed", e.message || "Authentication process was cancelled or failed.");
    }
  };

  const handleEmailLogin = () => {
    setIsOpen(false);
    router.push("/auth/login");
  };

  return (
    <AuthModalContext.Provider value={{ showAuthModal, hideAuthModal }}>
      {children}
      
      <Modal isOpen={isOpen} onClose={hideAuthModal} title="Unlock Premium Features">
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-bold text-foreground flex items-center justify-center gap-1.5">
              Secure Document Workspace <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {modalMessage}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
            <Button size="md" className="w-full" onClick={handleGoogleLogin}>
              Continue with Google
            </Button>
            
            <Button size="md" variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleEmailLogin}>
              <Mail className="w-4 h-4" /> Continue with Email
            </Button>
            
            <Button size="md" variant="ghost" className="w-full text-muted-foreground hover:text-foreground" onClick={hideAuthModal}>
              Skip for now
            </Button>
          </div>
        </div>
      </Modal>
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
