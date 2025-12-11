"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  label: string;
  value?: Date;
  placeholder?: string;
  className?: string;
}

export function DateSelector({
  label,
  value,
  placeholder = "Select date",
  className,
}: DateSelectorProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <button
        type="button"
        className={cn(
          "flex items-center gap-3 w-full h-12 px-4 rounded-lg border border-input bg-background",
          "text-left transition-colors",
          "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          !value && "text-muted-foreground"
        )}
      >
        <Calendar className="size-5 text-muted-foreground" />
        <span className="flex-1">
          {value ? formatDate(value) : placeholder}
        </span>
      </button>
    </div>
  );
}

