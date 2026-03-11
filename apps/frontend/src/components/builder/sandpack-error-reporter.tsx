"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";

export interface SandpackErrorDetail {
  message: string;
  title?: string;
  path?: string;
  line?: number;
  column?: number;
}

interface SandpackErrorReporterProps {
  onError: (error: SandpackErrorDetail) => void;
}

/**
 * Headless component that sits inside SandpackProvider and detects
 * bundler/compile errors + runtime errors, then reports them via onError.
 * Debounces to avoid rapid-fire reports during Sandpack hot-reload cycles.
 *
 * Because the parent uses a `key` on SandpackProvider, this component
 * remounts on every file change — so reportedErrorRef starts fresh each time.
 */
export function SandpackErrorReporter({ onError }: SandpackErrorReporterProps) {
  const { sandpack, listen } = useSandpack();
  const reportedErrorRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reportError = useCallback(
    (detail: SandpackErrorDetail) => {
      // Don't report the same error twice within the same mount cycle
      if (reportedErrorRef.current === detail.message) return;

      // Clear any pending debounce
      if (debounceRef.current) clearTimeout(debounceRef.current);

      // Wait 3s for Sandpack to settle before reporting
      debounceRef.current = setTimeout(() => {
        reportedErrorRef.current = detail.message;
        onError(detail);
      }, 3000);
    },
    [onError],
  );

  // Reset when error clears (new code loaded successfully)
  useEffect(() => {
    if (!sandpack.error) {
      reportedErrorRef.current = null;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    }
  }, [sandpack.error]);

  // Detect bundler/compile errors — includes file path, line, column
  useEffect(() => {
    if (sandpack.error?.message) {
      reportError({
        message: sandpack.error.message,
        title: sandpack.error.title,
        path: sandpack.error.path,
        line: sandpack.error.line,
        column: sandpack.error.column,
      });
    }
  }, [sandpack.error, reportError]);

  // Detect runtime errors via Sandpack message listener
  useEffect(() => {
    const unsub = listen((msg) => {
      const m = msg as {
        type: string;
        action?: string;
        message?: string;
        title?: string;
        path?: string;
        line?: number;
        column?: number;
      };
      if (m.type === "action" && m.action === "show-error" && (m.message || m.title)) {
        reportError({
          message: m.message || m.title || "Runtime error",
          title: m.title,
          path: m.path,
          line: m.line,
          column: m.column,
        });
      }
    });
    return unsub;
  }, [listen, reportError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return null;
}
