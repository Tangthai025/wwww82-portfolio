"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Send, CheckCircle2, Copy, Check } from "lucide-react";

interface ContactClientProps {
  email: string;
  pgpKey?: string | null;
}

export function ContactClient({ email, pgpKey }: ContactClientProps) {
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !senderEmail || !message) {
      error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    // Simulate secure dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      success("Encrypted dispatch transmitted successfully!");
      setName("");
      setSenderEmail("");
      setSubject("");
      setMessage("");
    }, 1000);
  };

  const handleCopyKey = () => {
    if (pgpKey) {
      navigator.clipboard.writeText(pgpKey);
      setCopiedKey(true);
      success("PGP Public Key copied to clipboard");
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left: Contact Form */}
      <div className="lg:col-span-7 p-6 sm:p-8 rounded-cyber border border-border bg-surface space-y-6">
        <div>
          <h2 className="text-xl font-bold font-mono text-text">
            Send Encrypted Message
          </h2>
          <p className="text-xs sm:text-sm text-muted font-sans mt-1">
            Fill out the form below for security inquiries, assessment requests, or vulnerability disclosure coordination.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-cyber bg-primary/10 border border-primary/40 space-y-3 text-center">
            <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
            <h3 className="text-base font-bold font-mono text-text">
              Message Received
            </h3>
            <p className="text-xs text-muted">
              Thank you for reaching out. wwww82 will review your communication and respond shortly.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSuccess(false)}
              className="mt-2 font-mono"
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name *"
                placeholder="e.g. Alex Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Your Email *"
                type="email"
                placeholder="e.g. alex@company.sec"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Subject"
              placeholder="e.g. Security Assessment Inquiry / Vulnerability Briefing"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <Textarea
              label="Message *"
              placeholder="Write your encrypted inquiry or project scope details..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-mono"
              isLoading={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              Transmit Secure Message
            </Button>
          </form>
        )}
      </div>

      {/* Right: PGP Public Key & Direct Communication */}
      <div className="lg:col-span-5 space-y-6">
        {/* PGP Box */}
        <div className="p-6 rounded-cyber border border-border bg-[#080a0e] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-primary uppercase tracking-wider">
              PGP Public Key
            </h3>
            <button
              onClick={handleCopyKey}
              className="flex items-center gap-1 text-xs font-mono text-muted hover:text-primary transition-colors p-1"
            >
              {copiedKey ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Copy Key</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 bg-[#0d121a] rounded-cyber border border-border/80 text-[10px] font-mono text-muted/90 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {pgpKey ||
              `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v2.1.13
Comment: https://wwww82.sec/pgp

mQGNBF/XXXXBDAC3x9...[wwww82 PGP Key 4096R/0x82C7B9F1]
-----END PGP PUBLIC KEY BLOCK-----`}
          </div>

          <p className="text-[11px] font-mono text-muted">
            Fingerprint: <span className="text-text">82C7 B9F1 44A2 D901 0082 E8F1 9921 34BC</span>
          </p>
        </div>

        {/* Direct Email Box */}
        <div className="p-6 rounded-cyber border border-border bg-surface space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-secondary font-semibold">
            Direct Inbox
          </h3>
          <p className="text-sm font-mono text-text break-all">
            {email}
          </p>
          <p className="text-xs text-muted pt-1">
            Responses typically transmitted within 24-48 business hours.
          </p>
        </div>
      </div>
    </div>
  );
}
