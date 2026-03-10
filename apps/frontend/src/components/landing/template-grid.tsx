"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/landing/template-card";
import { communityTemplates } from "@/lib/templates/community";
import { ContractCategory } from "@/lib/types";

type Filter = "all" | ContractCategory;

const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "game", label: "Games" },
  { id: "token", label: "Tokens" },
  { id: "nft", label: "NFTs" },
  { id: "tipping", label: "Payments" },
];

export function TemplateGrid() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filteredTemplates = useMemo(() => {
    if (activeFilter === "all") return communityTemplates;
    return communityTemplates.filter((template) => template.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="space-y-6 py-10 sm:py-14">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">From the Community</h2>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            type="button"
            variant={activeFilter === filter.id ? "default" : "outline"}
            className={
              activeFilter === filter.id
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </section>
  );
}
