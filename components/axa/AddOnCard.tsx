"use client";

import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface AddOnCardProps {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  isIncluded?: boolean;
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  className?: string;
}

export function AddOnCard({
  name,
  description,
  price,
  currency = "€",
  isIncluded = false,
  isEnabled = false,
  onToggle,
  className,
}: AddOnCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border border-border bg-card",
        isIncluded && "bg-axa-green/5 border-axa-green/30",
        className
      )}
    >
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2">
          <h4 className="text-base font-medium text-foreground">{name}</h4>
          {isIncluded && (
            <span className="text-xs font-medium text-axa-green bg-axa-green/10 px-2 py-0.5 rounded">
              Included
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {!isIncluded && (
          <span className="text-base font-semibold text-foreground whitespace-nowrap">
            +{currency}{price}
          </span>
        )}
        {!isIncluded && onToggle && (
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
          />
        )}
      </div>
    </div>
  );
}

