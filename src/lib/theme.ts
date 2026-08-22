export interface ThemePreset {
  id: string;
  preset?: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  surfaceSecondaryColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  fontSans: string;
  fontMono: string;
  borderRadius: string;
  glowIntensity: "none" | "subtle" | "normal" | "intense";
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  "cyber-green": {
    id: "cyber-green",
    name: "Cyber Green (Default)",
    primaryColor: "#39FF88",
    secondaryColor: "#00D9FF",
    backgroundColor: "#090B0F",
    surfaceColor: "#10141A",
    surfaceSecondaryColor: "#151A21",
    textColor: "#E8EDF2",
    mutedColor: "#7D8996",
    borderColor: "#26313A",
    fontSans: "Inter",
    fontMono: "JetBrains Mono",
    borderRadius: "6px",
    glowIntensity: "normal",
  },
  "cyber-blue": {
    id: "cyber-blue",
    name: "Cyber Blue",
    primaryColor: "#00D9FF",
    secondaryColor: "#3988FF",
    backgroundColor: "#070D18",
    surfaceColor: "#0E182A",
    surfaceSecondaryColor: "#13223B",
    textColor: "#E6F0FA",
    mutedColor: "#7B8FA6",
    borderColor: "#1F3554",
    fontSans: "Inter",
    fontMono: "JetBrains Mono",
    borderRadius: "6px",
    glowIntensity: "normal",
  },
  "cyber-purple": {
    id: "cyber-purple",
    name: "Cyber Purple",
    primaryColor: "#B34DF7",
    secondaryColor: "#FF2E93",
    backgroundColor: "#0C0814",
    surfaceColor: "#171026",
    surfaceSecondaryColor: "#201636",
    textColor: "#F1ECF8",
    mutedColor: "#8E82A1",
    borderColor: "#362454",
    fontSans: "Inter",
    fontMono: "JetBrains Mono",
    borderRadius: "8px",
    glowIntensity: "normal",
  },
  "monochrome": {
    id: "monochrome",
    name: "Monochrome Stealth",
    primaryColor: "#FFFFFF",
    secondaryColor: "#9E9E9E",
    backgroundColor: "#0A0A0A",
    surfaceColor: "#141414",
    surfaceSecondaryColor: "#1E1E1E",
    textColor: "#FAFAFA",
    mutedColor: "#888888",
    borderColor: "#2E2E2E",
    fontSans: "Inter",
    fontMono: "JetBrains Mono",
    borderRadius: "4px",
    glowIntensity: "subtle",
  },
};

export function getGlowAlpha(intensity: string): string {
  switch (intensity) {
    case "none":
      return "0";
    case "subtle":
      return "0.15";
    case "intense":
      return "0.45";
    case "normal":
    default:
      return "0.25";
  }
}

export function generateCssVariables(theme: ThemePreset | Partial<ThemePreset>): string {
  const glowAlpha = getGlowAlpha(theme.glowIntensity || "normal");
  return `
    --background: ${theme.backgroundColor || "#090B0F"};
    --surface: ${theme.surfaceColor || "#10141A"};
    --surface-secondary: ${theme.surfaceSecondaryColor || "#151A21"};
    --primary: ${theme.primaryColor || "#39FF88"};
    --secondary: ${theme.secondaryColor || "#00D9FF"};
    --text: ${theme.textColor || "#E8EDF2"};
    --muted: ${theme.mutedColor || "#7D8996"};
    --border: ${theme.borderColor || "#26313A"};
    --radius: ${theme.borderRadius || "6px"};
    --primary-glow: ${theme.primaryColor || "#39FF88"}${Math.round(parseFloat(glowAlpha) * 255).toString(16).padStart(2, '0')};
    --secondary-glow: ${theme.secondaryColor || "#00D9FF"}${Math.round(parseFloat(glowAlpha) * 255).toString(16).padStart(2, '0')};
  `;
}
