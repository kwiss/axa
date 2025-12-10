"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PlanFeature {
  label: string;
  included: boolean;
}

interface PlanCardProps {
  name: string;
  price: number;
  currency?: string;
  period?: string;
  features: PlanFeature[];
  isPopular?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function PlanCard({
  name,
  price,
  currency = "€",
  period = "/person",
  features,
  isPopular = false,
  isSelected = false,
  onSelect,
  className,
}: PlanCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative rounded-xl border-2 p-5 cursor-pointer transition-all",
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-border bg-card hover:border-primary/50",
        className
      )}
    >
      {isPopular && (
        <Badge 
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-axa-green text-white px-3 py-1"
        >
          Most Popular
        </Badge>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-primary">{currency}{price}</span>
            <span className="text-sm text-muted-foreground">{period}</span>
          </div>
        </div>
        
        <div className={cn(
          "size-6 rounded-full border-2 flex items-center justify-center transition-colors",
          isSelected 
            ? "border-primary bg-primary" 
            : "border-grey-400"
        )}>
          {isSelected && <Check className="size-4 text-white" />}
        </div>
      </div>
      
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={cn(
              "size-5 rounded-full flex items-center justify-center",
              feature.included ? "bg-axa-green/10" : "bg-grey-200"
            )}>
              {feature.included ? (
                <Check className="size-3 text-axa-green" />
              ) : (
                <span className="size-2 bg-grey-400 rounded-full" />
              )}
            </div>
            <span className={cn(
              "text-sm",
              feature.included ? "text-foreground" : "text-muted-foreground line-through"
            )}>
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

