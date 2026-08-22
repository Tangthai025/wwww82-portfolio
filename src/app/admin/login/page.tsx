"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@wwww82.sec");
  const [password, setPassword] = useState("wwww82_admin_pass!2026");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed");
        error(data.error || "Invalid credentials");
      } else {
        success("Access granted. Initializing Admin Session...");
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setErrorMessage("Network or server communication error");
      error("Authentication network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#07090d] text-text">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md p-8 rounded-cyber border border-border bg-[#0e1218]/90 backdrop-blur-md shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-cyber bg-surface border border-primary/40 text-primary shadow-cyber-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-mono text-text tracking-wide">
            wwww82 CMS
          </h1>
          <p className="text-xs font-mono text-muted">
            Authenticated Administration Portal
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@wwww82.sec"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-mono mt-2"
            isLoading={isLoading}
          >
            <Lock className="w-4 h-4 mr-2" />
            Authenticate Session
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Security Notice */}
        <div className="p-3 rounded bg-surface border border-border/60 text-[11px] font-mono text-muted text-center space-y-1">
          <div>Protected by HTTP-only Session Cookies & Bcrypt</div>
          <div className="text-[10px] text-primary/70">
            Default credentials prefilled for initial deployment test
          </div>
        </div>
      </div>
    </div>
  );
}
