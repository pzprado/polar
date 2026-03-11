import { GeneratedFile } from "@/lib/types";
import { resolveDependencies } from "./dependency-resolver";

export function assembleNextProject(
  frontendFiles: GeneratedFile[],
  contractAddress: string,
  appName: string,
): Record<string, string> {
  const files: Record<string, string> = {};

  // Detect extra dependencies from AI-generated code
  const extraDeps = resolveDependencies(frontendFiles);

  // package.json
  files["package.json"] = JSON.stringify(
    {
      name: slugify(appName),
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      dependencies: {
        next: "^14.2.0",
        react: "^18.3.0",
        "react-dom": "^18.3.0",
        wagmi: "^2.14.0",
        viem: "^2.21.0",
        "@tanstack/react-query": "^5.62.0",
        ...extraDeps,
      },
      devDependencies: {
        typescript: "^5.4.0",
        "@types/react": "^18.3.0",
        "@types/node": "^20.0.0",
        tailwindcss: "^3.4.0",
        postcss: "^8.4.0",
        autoprefixer: "^10.4.0",
      },
    },
    null,
    2,
  );

  // next.config.js
  files["next.config.js"] = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
`;

  // tsconfig.json
  files["tsconfig.json"] = JSON.stringify(
    {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
      exclude: ["node_modules"],
    },
    null,
    2,
  );

  // tailwind.config.js
  files["tailwind.config.js"] = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./generated/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        polar: { DEFAULT: "#E84142", dark: "#c7282a" },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
`;

  // postcss.config.js
  files["postcss.config.js"] = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  // app/globals.css
  files["app/globals.css"] = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  min-height: 100vh;
}
`;

  // app/layout.tsx
  files["app/layout.tsx"] = `import "./globals.css";

export const metadata = {
  title: "${appName}",
  description: "Built with Polar on Avalanche",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
`;

  // app/providers.tsx — wagmi + react-query setup
  files["app/providers.tsx"] = `"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const config = createConfig({
  chains: [avalancheFuji],
  transports: {
    [avalancheFuji.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
`;

  // app/page.tsx — imports the generated App component
  files["app/page.tsx"] = `"use client";

import App from "../generated/App";
import { Providers } from "./providers";

export default function Page() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}
`;

  // generated/polar-config.js — injects contract address + chain config
  files["generated/polar-config.js"] = `if (typeof window !== "undefined") {
  window.__POLAR_CONTRACT_ADDRESS__ = "${contractAddress}";
  window.__POLAR_CHAIN__ = {
    id: 43113,
    name: "Avalanche Fuji",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    explorerUrl: "https://testnet.snowtrace.io",
  };
}
`;

  // Map AI-generated files into generated/ directory
  for (const file of frontendFiles) {
    // /App.jsx -> generated/App.jsx, /components/Foo.jsx -> generated/components/Foo.jsx
    const destPath = `generated${file.path}`;
    files[destPath] = file.content;
  }

  return files;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
