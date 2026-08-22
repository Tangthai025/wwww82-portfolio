"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Terminal,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [botField, setBotField] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);

  const router = useRouter();
  const { success, error } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutCountdown > 0) {
      timer = setInterval(() => {
        setLockoutCountdown((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setErrorMessage("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, botField }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed");
        error(data.error || "Access Denied");

        if (data.isLocked) {
          setIsLocked(true);
          setLockoutCountdown(data.remainingSeconds || 900);
        } else if (typeof data.remainingAttempts === "number") {
          setRemainingAttempts(data.remainingAttempts);
        }
      } else {
        success("Access granted. Initializing Admin Session...");
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setErrorMessage("Secure network communication failure");
      error("Authentication network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#07090D] text-text selection:bg-primary selection:text-black">
      {/* Background Cyber Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#151e28_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md p-8 rounded-cyber border border-border bg-[#0B0E14]/95 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Terminal Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex p-3 rounded-cyber bg-surface border border-primary/40 text-primary shadow-cyber-sm">
            <Shield className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold font-mono text-text tracking-wider uppercase">
              wwww82 :: SEC_PORTAL
            </h1>
            <p className="text-[11px] font-mono text-muted mt-0.5">
              Restricted Access Administration Console
            </p>
          </div>

          {/* Security Telemetry Badges */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>TLS 1.3 Strict</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
              <KeyRound className="w-3 h-3" />
              <span>JWT Signed</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary border border-border text-muted">
              <span>Anti-Brute Force</span>
            </span>
          </div>
        </div>

        {/* Error / Lockout Alert */}
        {errorMessage && (
          <div
            className={`p-3.5 rounded-cyber border text-xs font-mono flex items-start gap-2.5 ${
              isLocked
                ? "bg-red-950/70 border-red-700 text-red-200"
                : "bg-amber-950/60 border-amber-800 text-amber-200"
            }`}
          >
            {isLocked ? (
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div>{errorMessage}</div>
              {isLocked && lockoutCountdown > 0 && (
                <div className="text-[11px] text-red-400 font-bold">
                  Cooldown active: {Math.floor(lockoutCountdown / 60)}m {lockoutCountdown % 60}s
                </div>
              )}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot hidden input for automated bot traps */}
          <input
            type="text"
            name="botField"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Email Input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider">
              Operator Identifier (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="operator@domain.sec"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLocked}
                autoComplete="off"
                className="w-full pl-10 pr-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm font-mono text-text placeholder:text-muted/40 focus:outline-none focus:border-primary focus:shadow-cyber-sm transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider">
                Security Passkey
              </label>
              {remainingAttempts !== null && remainingAttempts < 5 && !isLocked && (
                <span className="text-[10px] font-mono text-amber-400">
                  {remainingAttempts} attempt(s) left
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter security passkey"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLocked}
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-2.5 bg-surface border border-border rounded-cyber text-sm font-mono text-text placeholder:text-muted/40 focus:outline-none focus:border-primary focus:shadow-cyber-sm transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-mono mt-2 shadow-cyber-sm"
            isLoading={isLoading}
            disabled={isLocked}
          >
            <Terminal className="w-4 h-4 mr-2" />
            {isLocked ? "Access Locked" : "Authenticate Session"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Security Audit Footer */}
        <div className="pt-3 border-t border-border/40 text-center space-y-1 font-mono text-[10px] text-muted">
          <div className="flex items-center justify-center gap-1 text-muted/80">
            <Lock className="w-3 h-3 text-primary" />
            <span>Encrypted Session • Rate-Limited • IP Telemetry Logged</span>
          </div>
        </div>
      </div>
    </div>
  );
}
