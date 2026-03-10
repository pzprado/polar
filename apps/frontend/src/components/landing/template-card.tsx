"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Coins, Gamepad2, Heart, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CommunityTemplate } from "@/lib/types";

interface TemplateCardProps {
  template: CommunityTemplate;
}

const categoryMeta: Record<CommunityTemplate["category"], { label: string; icon: ReactNode }> = {
  token: { label: "Token", icon: <Coins className="h-4 w-4" /> },
  nft: { label: "NFT", icon: <ImageIcon className="h-4 w-4" /> },
  game: { label: "Game", icon: <Gamepad2 className="h-4 w-4" /> },
  tipping: { label: "Payments", icon: <Heart className="h-4 w-4" /> },
};

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();
  const meta = categoryMeta[template.category];

  return (
    <Card
      onClick={() => router.push(`/app/new?prompt=${encodeURIComponent(template.prompt)}`)}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/app/new?prompt=${encodeURIComponent(template.prompt)}`);
        }
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-600">
          {meta.icon}
        </span>
        <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          {meta.label}
        </Badge>
      </div>
      <h3 className="text-base font-semibold text-gray-900">{template.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{template.description}</p>
    </Card>
  );
}
