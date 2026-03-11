/**
 * Theme presets for the shadcn/ui CSS variable system.
 *
 * Each preset defines a full set of HSL-based CSS variables that control
 * the appearance of all UI components. Variables store raw HSL values
 * (e.g. "0 72% 57%") without the hsl() wrapper so Tailwind can compose them.
 */

export interface ThemePreset {
  name: string;
  label: string;
  cssVariables: Record<string, string>;
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  polar: {
    name: "polar",
    label: "Polar",
    cssVariables: {
      "--background": "0 0% 100%",
      "--foreground": "20 14.3% 4.1%",
      "--card": "0 0% 100%",
      "--card-foreground": "20 14.3% 4.1%",
      "--primary": "0 72% 57%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "20 5.9% 90%",
      "--secondary-foreground": "24 9.8% 10%",
      "--muted": "20 5.9% 90%",
      "--muted-foreground": "25 5.3% 44.7%",
      "--accent": "20 5.9% 90%",
      "--accent-foreground": "24 9.8% 10%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "20 5.9% 90%",
      "--input": "20 5.9% 85%",
      "--ring": "0 72% 57%",
      "--radius": "0.5rem",
    },
  },
  cool: {
    name: "cool",
    label: "Cool",
    cssVariables: {
      "--background": "0 0% 100%",
      "--foreground": "222.2 84% 4.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "222.2 84% 4.9%",
      "--primary": "217 91% 60%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "210 40% 96.1%",
      "--secondary-foreground": "222.2 47.4% 11.2%",
      "--muted": "210 40% 96.1%",
      "--muted-foreground": "215.4 16.3% 46.9%",
      "--accent": "210 40% 96.1%",
      "--accent-foreground": "222.2 47.4% 11.2%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "214.3 31.8% 91.4%",
      "--input": "214.3 31.8% 85%",
      "--ring": "217 91% 60%",
      "--radius": "0.5rem",
    },
  },
  warm: {
    name: "warm",
    label: "Warm",
    cssVariables: {
      "--background": "0 0% 100%",
      "--foreground": "20 14.3% 4.1%",
      "--card": "0 0% 100%",
      "--card-foreground": "20 14.3% 4.1%",
      "--primary": "25 95% 53%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "30 33% 93%",
      "--secondary-foreground": "20 14.3% 10%",
      "--muted": "30 33% 93%",
      "--muted-foreground": "25 5.3% 44.7%",
      "--accent": "30 33% 93%",
      "--accent-foreground": "20 14.3% 10%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "30 20% 90%",
      "--input": "30 20% 85%",
      "--ring": "25 95% 53%",
      "--radius": "0.75rem",
    },
  },
  minimal: {
    name: "minimal",
    label: "Minimal",
    cssVariables: {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 3.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 3.9%",
      "--primary": "0 0% 9%",
      "--primary-foreground": "0 0% 98%",
      "--secondary": "0 0% 96.1%",
      "--secondary-foreground": "0 0% 9%",
      "--muted": "0 0% 96.1%",
      "--muted-foreground": "0 0% 45.1%",
      "--accent": "0 0% 96.1%",
      "--accent-foreground": "0 0% 9%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "0 0% 89.8%",
      "--input": "0 0% 85%",
      "--ring": "0 0% 9%",
      "--radius": "0.25rem",
    },
  },
};

export type ThemeName = keyof typeof THEME_PRESETS;

export const DEFAULT_THEME: ThemeName = "polar";

/** Generate a CSS :root block with theme variables. */
export function getThemeCssVariables(theme: ThemeName = DEFAULT_THEME): string {
  const preset = THEME_PRESETS[theme] || THEME_PRESETS[DEFAULT_THEME];
  const vars = Object.entries(preset.cssVariables)
    .map(([key, value]) => `    ${key}: ${value};`)
    .join("\n");
  return `:root {\n${vars}\n  }`;
}
