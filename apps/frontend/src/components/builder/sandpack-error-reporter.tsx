"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";

interface SandpackErrorReporterProps {
  onError: (error: string) => void;
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
    (message: string) => {
      // Don't report the same error twice within the same mount cycle
      if (reportedErrorRef.current === message) return;

      // Clear any pending debounce
      if (debounceRef.current) clearTimeout(debounceRef.current);

      // Wait 3s for Sandpack to settle before reporting
      debounceRef.current = setTimeout(() => {
        reportedErrorRef.current = message;
        onError(message);
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

  // Detect bundler/compile errors
  useEffect(() => {
    if (sandpack.error?.message) {
      reportError(sandpack.error.message);
    }
  }, [sandpack.error, reportError]);

  // Detect runtime errors via Sandpack message listener
  useEffect(() => {
    const unsub = listen((msg) => {
      const m = msg as { type: string; action?: string; message?: string; title?: string };
      if (m.type === "action" && m.action === "show-error" && (m.message || m.title)) {
        reportError(m.message || m.title || "Runtime error");
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
