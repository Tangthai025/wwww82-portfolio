"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    warning: (msg) => addToast(msg, "warning"),
    info: (msg) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          let borderStyle = "border-border";
          let icon = <Info className="w-4 h-4 text-secondary shrink-0" />;

          if (t.type === "success") {
            borderStyle = "border-primary/60 bg-surface/95 text-text";
            icon = <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />;
          } else if (t.type === "error") {
            borderStyle = "border-red-500/60 bg-red-950/80 text-red-200";
            icon = <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
          } else if (t.type === "warning") {
            borderStyle = "border-amber-500/60 bg-amber-950/80 text-amber-200";
            icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-cyber border bg-surface/95 backdrop-blur-md shadow-lg text-sm font-mono ${borderStyle} transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
            >
              <div className="flex items-center gap-2.5">
                {icon}
                <span className="text-xs">{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-muted hover:text-text ml-2 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
