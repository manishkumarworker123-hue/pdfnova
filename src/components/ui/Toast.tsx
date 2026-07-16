"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (type: ToastType, title: string, description?: string, duration?: number) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, title: string, description?: string, duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, description, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback((title: string, description?: string) => toast("success", title, description), [toast]);
  const error = useCallback((title: string, description?: string) => toast("error", title, description), [toast]);
  const warning = useCallback((title: string, description?: string) => toast("warning", title, description), [toast]);
  const info = useCallback((title: string, description?: string) => toast("info", title, description), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={`pointer-events-auto p-4 rounded-xl shadow-xl border flex gap-3 items-start backdrop-blur-md ${
                t.type === "success"
                  ? "bg-green-50/90 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/30 text-green-800 dark:text-green-300"
                  : t.type === "error"
                  ? "bg-red-50/90 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/30 text-red-800 dark:text-red-300"
                  : t.type === "warning"
                  ? "bg-amber-50/90 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30 text-amber-800 dark:text-amber-300"
                  : "bg-blue-50/90 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/30 text-blue-800 dark:text-blue-300"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
                {t.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {t.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-tight">{t.title}</h4>
                {t.description && <p className="text-xs mt-1 opacity-90 leading-normal">{t.description}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 p-0.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
