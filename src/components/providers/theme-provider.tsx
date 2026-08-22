"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { THEME_PRESETS, ThemePreset, generateCssVariables } from "@/lib/theme";

interface ThemeContextType {
  theme: ThemePreset;
  mode: "dark" | "light" | "system";
  setThemePreset: (presetId: string) => void;
  setMode: (mode: "dark" | "light" | "system") => void;
  customTheme: Partial<ThemePreset>;
  updateCustomTheme: (tokens: Partial<ThemePreset>) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: Partial<ThemePreset>;
}) {
  const [theme, setTheme] = useState<ThemePreset>(
    (initialTheme && THEME_PRESETS[initialTheme.preset || initialTheme.id || "cyber-green"]) || THEME_PRESETS["cyber-green"]
  );
  const [mode, setMode] = useState<"dark" | "light" | "system">("dark");
  const [customTheme, setCustomTheme] = useState<Partial<ThemePreset>>(initialTheme || {});

  // Apply CSS custom variables dynamically
  useEffect(() => {
    const root = document.documentElement;
    const activeTokens = { ...theme, ...customTheme };
    const cssVars = generateCssVariables(activeTokens);

    // Apply inline style string to root
    const styleElId = "wwww82-theme-override";
    let styleEl = document.getElementById(styleElId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleElId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `:root { ${cssVars} }`;

    // Handle light / dark class
    if (mode === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [theme, customTheme, mode]);

  const setThemePreset = (presetId: string) => {
    if (THEME_PRESETS[presetId]) {
      setTheme(THEME_PRESETS[presetId]);
      setCustomTheme(THEME_PRESETS[presetId]);
    }
  };

  const updateCustomTheme = (tokens: Partial<ThemePreset>) => {
    setCustomTheme((prev) => ({ ...prev, ...tokens }));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        setThemePreset,
        setMode,
        customTheme,
        updateCustomTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
