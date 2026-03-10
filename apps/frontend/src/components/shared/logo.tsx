import Link from "next/link";
import { Mountain } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-gray-900 transition-colors hover:text-gray-700">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#E84142] text-white">
        <Mountain className="h-4 w-4" />
      </span>
      <span className="text-lg font-semibold tracking-tight">Polar</span>
    </Link>
  );
}
