"use client";

import { cn } from "@/lib/utils";

interface StratisIconProps {
  icon: { name: string; data: string };
  className?: string;
}

export function StratisIcon({ icon, className }: StratisIconProps) {
  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      dangerouslySetInnerHTML={{ __html: icon.data }}
    />
  );
}
