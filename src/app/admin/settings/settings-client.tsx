"use client";

import React, { useState } from "react";
import { Lock, Mail, Shield, Save, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export function SettingsClient({ currentUserEmail }: { currentUserEmail: string }) {
  const [email, setEmail] = useState(currentUserEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      error("New passwords do not match");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      error("New password must be at least 8 characters");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newEmail: email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        success(data.message || "Settings updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        error(data.error || "Failed to update settings");
      }
    } catch {
      error("Network error updating credentials");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <form onSubmit={handleUpdate} className="p-6 rounded-cyber border border-border bg-surface space-y-5">
        <h2 className="text-sm font-bold font-mono text-primary uppercase tracking-wider flex items-center gap-2">
          <KeyRound className="w-4 h-4" />
          <span>Admin Authentication Credentials</span>
        </h2>

        <Input
          label="Admin Login Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="pt-2 border-t border-border/60 space-y-4">
          <span className="text-xs font-mono text-muted uppercase tracking-wider block">
            Change Password (Optional)
          </span>

          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password to authorize changes"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-border">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            className="font-mono"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Update Credentials
          </Button>
        </div>
      </form>
    </div>
  );
}
