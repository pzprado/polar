import { GeneratedFile } from "@/lib/types";

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates generated frontend files before deploying to Vercel.
 * Catches common issues that would cause the Vercel build to fail.
 */
export function validateFrontendFiles(files: GeneratedFile[]): ValidationResult {
  const errors: string[] = [];

  // Must have an App entry point
  const hasApp = files.some((f) => f.path === "/App.tsx" || f.path === "/App.jsx" || f.path === "/App.js");
  if (!hasApp) {
    errors.push("Missing /App.tsx entry point");
  }

  // Check each file for common issues
  const filePaths = new Set(files.map((f) => f.path));

  for (const file of files) {
    // Empty file content
    if (!file.content.trim()) {
      errors.push(`${file.path} is empty`);
      continue;
    }

    // Check that relative imports reference files that exist
    const importRegex = /import\s+.*?\s+from\s+["'](\.[^"']+)["']/g;
    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(file.content)) !== null) {
      const importPath = match[1];
      const resolved = resolveImport(file.path, importPath);
      if (!fileExists(resolved, filePaths)) {
        errors.push(`${file.path}: imports "${importPath}" but ${resolved} does not exist`);
      }
    }

    // Check for accidental ethers imports (should use wagmi/viem)
    if (/import\s+.*?\s+from\s+["']ethers["']/.test(file.content)) {
      errors.push(`${file.path}: imports ethers — use wagmi/viem instead`);
    }

    // Check for unclosed JSX (basic brace balance)
    const braceBalance = countChar(file.content, "{") - countChar(file.content, "}");
    if (Math.abs(braceBalance) > 0) {
      errors.push(`${file.path}: mismatched braces (${braceBalance > 0 ? "missing }" : "extra }"})`);
    }

    // Check for default export
    if (!file.content.includes("export default")) {
      errors.push(`${file.path}: missing default export`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function resolveImport(fromPath: string, importPath: string): string {
  const fromDir = fromPath.substring(0, fromPath.lastIndexOf("/")) || "/";
  const parts = `${fromDir}/${importPath}`.split("/").filter(Boolean);

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  return "/" + resolved.join("/");
}

function fileExists(resolved: string, filePaths: Set<string>): boolean {
  // Try exact match, then with common extensions
  const extensions = ["", ".jsx", ".js", ".tsx", ".ts"];
  return extensions.some((ext) => filePaths.has(resolved + ext));
}

function countChar(str: string, char: string): number {
  let count = 0;
  for (const c of str) {
    if (c === char) count++;
  }
  return count;
}
