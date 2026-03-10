import { Footer } from "@/components/landing/footer";
import { HeroPrompt } from "@/components/landing/hero-prompt";
import { TemplateGrid } from "@/components/landing/template-grid";
import { Navbar } from "@/components/shared/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <HeroPrompt />
        <TemplateGrid />
      </main>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Footer />
      </div>
    </div>
  );
}
