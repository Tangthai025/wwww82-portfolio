import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "wwww82 — Cybersecurity Portfolio & Technical Write-ups",
  description: "Cybersecurity portfolio, vulnerability research, penetration testing case studies, and technical write-ups by wwww82.",
  keywords: ["Cybersecurity", "Security Research", "Penetration Testing", "Web Security", "CTF", "eBPF", "wwww82"],
  authors: [{ name: "wwww82" }],
  openGraph: {
    title: "wwww82 — Cybersecurity Portfolio & Technical Write-ups",
    description: "Cybersecurity portfolio, vulnerability research, penetration testing case studies, and technical write-ups.",
    type: "website",
    siteName: "wwww82 Security",
  },
  twitter: {
    card: "summary_large_image",
    title: "wwww82 — Cybersecurity Portfolio",
    description: "Cybersecurity portfolio, vulnerability research, and technical write-ups by wwww82.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let themeSetting = null;

  try {
    themeSetting = await db.themeSetting.findFirst();
  } catch (err) {
    console.error("Failed to load theme settings from DB:", err);
  }

  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans bg-background text-text">
        <ThemeProvider initialTheme={(themeSetting as any) || undefined}>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
