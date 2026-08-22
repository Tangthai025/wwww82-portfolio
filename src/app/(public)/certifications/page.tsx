import React from "react";
import { db } from "@/lib/db";
import { CertificationCard } from "@/components/public/certification-card";
import { Award, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Industry Certifications — wwww82",
  description: "Verified cybersecurity certifications including OSCP, CRTE, eWPTXv2, CISSP, AWS Security Specialty, and BSCP earned by wwww82.",
};

export default async function CertificationsPage() {
  const certifications = await db.certification.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
          <Award className="w-4 h-4" />
          <span>Accreditations & Credentials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-text">
          Verified Certifications
        </h1>
        <p className="text-sm text-muted max-w-3xl leading-relaxed font-sans">
          Industry-standard offensive security, red teaming, cloud security, and penetration testing accreditations with verifiable credentials.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <CertificationCard
            key={cert.id}
            id={cert.id}
            title={cert.title}
            issuer={cert.issuer}
            issueDate={cert.issueDate}
            expiryDate={cert.expiryDate}
            credentialId={cert.credentialId}
            credentialUrl={cert.credentialUrl}
            certificateImage={cert.certificateImage}
            description={cert.description}
          />
        ))}
      </div>
    </div>
  );
}
