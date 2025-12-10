"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface RecapItem {
  label: string;
  value: string;
  onClick?: () => void;
}

interface RecapSectionProps {
  title?: string;
  items: RecapItem[];
  className?: string;
}

export function RecapSection({ title, items, className }: RecapSectionProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}
      <div className="divide-y divide-border">
        {items.map((item, index) => (
          <div 
            key={index}
            onClick={item.onClick}
            className={cn(
              "flex items-center justify-between px-4 py-3",
              item.onClick && "cursor-pointer hover:bg-accent/50 transition-colors"
            )}
          >
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{item.value}</span>
              {item.onClick && (
                <ChevronRight className="size-4 text-muted-foreground" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

