import Link from "next/link";
import { Snowflake } from "lucide-react";

interface LogoProps {
  variant?: "light" | "dark";
}

export function Logo({ variant = "dark" }: LogoProps) {
  const textColor = variant === "dark" ? "text-[#1C1917]" : "text-gray-900";
  const hoverColor = variant === "dark" ? "hover:text-[#57534E]" : "hover:text-gray-700";

  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${textColor} ${hoverColor} transition-colors`}>
      <Snowflake className="h-5 w-5 text-[#E84142]" />
      <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk, inherit)" }}>
        POLAR
      </span>
    </Link>
  );
}
