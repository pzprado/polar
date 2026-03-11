import { GeneratedFile } from "@/lib/types";

/**
 * Known npm packages the AI commonly uses, mapped to their latest versions.
 * This acts as an allowlist — we only auto-add packages we recognize.
 */
const KNOWN_PACKAGES: Record<string, string> = {
  // Icons
  "lucide-react": "^0.460.0",
  "react-icons": "^5.4.0",

  // UI primitives (Radix)
  "@radix-ui/react-dialog": "^1.1.0",
  "@radix-ui/react-dropdown-menu": "^2.1.0",
  "@radix-ui/react-popover": "^1.1.0",
  "@radix-ui/react-tooltip": "^1.1.0",
  "@radix-ui/react-tabs": "^1.1.0",
  "@radix-ui/react-accordion": "^1.2.0",
  "@radix-ui/react-select": "^2.1.0",
  "@radix-ui/react-switch": "^1.1.0",
  "@radix-ui/react-checkbox": "^1.1.0",
  "@radix-ui/react-slider": "^1.2.0",
  "@radix-ui/react-avatar": "^1.1.0",
  "@radix-ui/react-progress": "^1.1.0",
  "@radix-ui/react-separator": "^1.1.0",
  "@radix-ui/react-slot": "^1.1.0",
  "@radix-ui/react-label": "^2.1.0",
  "@radix-ui/react-toast": "^1.2.0",
  "radix-ui": "^1.1.0",

  // Animation
  "framer-motion": "^11.15.0",
  "motion": "^11.15.0",

  // Utilities
  "clsx": "^2.1.0",
  "class-variance-authority": "^0.7.0",
  "tailwind-merge": "^2.6.0",
  "date-fns": "^4.1.0",
  "zustand": "^5.0.0",
  "sonner": "^1.7.0",
  "react-hot-toast": "^2.4.0",
  "qrcode.react": "^4.2.0",
  "react-qr-code": "^2.0.0",

  // Charts
  "recharts": "^2.15.0",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",

  // Forms
  "react-hook-form": "^7.54.0",
  "zod": "^3.24.0",
  "@hookform/resolvers": "^3.9.0",

  // Blockchain (already in base deps, listed for completeness)
  "wagmi": "^2.14.0",
  "viem": "^2.21.0",
  "@tanstack/react-query": "^5.62.0",
};

/**
 * Packages that are provided by the framework and should NOT be added as dependencies.
 */
const BUILT_IN_PACKAGES = new Set([
  "react",
  "react-dom",
  "react/jsx-runtime",
  "next",
  "next/link",
  "next/image",
  "next/navigation",
]);

/**
 * Scans generated files for import statements and returns the npm packages
 * they reference (excluding relative imports and built-ins).
 */
export function detectImports(files: GeneratedFile[]): Set<string> {
  const packages = new Set<string>();

  for (const file of files) {
    const importRegex = /import\s+(?:[\s\S]*?\s+from\s+)?["']([^"'.][^"']*)["']/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(file.content)) !== null) {
      const specifier = match[1];

      // Skip relative imports
      if (specifier.startsWith(".") || specifier.startsWith("/")) continue;

      // Get the package name (handle scoped packages like @radix-ui/react-dialog)
      const packageName = specifier.startsWith("@")
        ? specifier.split("/").slice(0, 2).join("/")
        : specifier.split("/")[0];

      if (!BUILT_IN_PACKAGES.has(packageName) && !BUILT_IN_PACKAGES.has(specifier)) {
        packages.add(packageName);
      }
    }
  }

  return packages;
}

/**
 * Given generated files, returns a dependencies object with resolved versions
 * for all detected imports. Unrecognized packages use "latest".
 */
export function resolveDependencies(files: GeneratedFile[]): Record<string, string> {
  const detected = detectImports(files);
  const deps: Record<string, string> = {};

  for (const pkg of detected) {
    deps[pkg] = KNOWN_PACKAGES[pkg] || "latest";
  }

  return deps;
}

/**
 * Base dependencies that are always included regardless of what the AI generates.
 */
export const BASE_DEPENDENCIES: Record<string, string> = {
  wagmi: "^2.14.0",
  viem: "^2.21.0",
  "@tanstack/react-query": "^5.62.0",
};

/**
 * Returns the full dependency map for Sandpack or deployed projects:
 * base deps + detected deps from generated code.
 */
export function getAllDependencies(files: GeneratedFile[]): Record<string, string> {
  return {
    ...BASE_DEPENDENCIES,
    ...resolveDependencies(files),
  };
}
