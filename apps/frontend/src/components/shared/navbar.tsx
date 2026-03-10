import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <Button asChild className="bg-[#E84142] text-white hover:bg-[#d13a3b]">
          <Link href="#prompt">Start Building</Link>
        </Button>
      </div>
    </header>
  );
}
