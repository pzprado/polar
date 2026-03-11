import { GeneratedFile } from "@/lib/types";

export function assembleNextProject(
  frontendFiles: GeneratedFile[],
  contractAddress: string,
  appName: string,
): Record<string, string> {
  const files: Record<string, string> = {};

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
        ethers: "^6.16.0",
      },
      devDependencies: {
        typescript: "^5.4.0",
        "@types/react": "^18.3.0",
        "@types/node": "^20.0.0",
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

  // app/layout.tsx
  files["app/layout.tsx"] = `export const metadata = {
  title: "${appName}",
  description: "Built with Polar on Avalanche",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
`;

  // app/page.tsx — imports the generated App component
  files["app/page.tsx"] = `"use client";

import App from "../generated/App";

export default function Page() {
  return <App />;
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
