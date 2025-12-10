import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold uppercase tracking-[1px] transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#00008F] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary filled button (main CTA)
        default: "bg-[#00008F] text-white rounded-lg hover:bg-[#1F1F9C] active:bg-[#3D3DAA] disabled:bg-[#F0F0F0] disabled:text-[#CCCCCC] disabled:pointer-events-none",
        
        // Outline button (secondary, unselected)
        outline: "border border-[#1F1F9C] bg-transparent text-[#343C3D] rounded hover:bg-[#00008F]/5 active:bg-[#00008F]/10 disabled:border-[#CCCCCC] disabled:text-[#CCCCCC] disabled:pointer-events-none",
        
        // Outline selected button
        selected: "border border-[#1F1F9C] bg-[rgba(142,187,255,0.2)] text-[#1F1F9C] rounded",
        
        // Destructive
        destructive: "bg-[#D24723] text-white rounded-lg hover:bg-[#D24723]/90 disabled:bg-[#F0F0F0] disabled:text-[#CCCCCC] disabled:pointer-events-none",
        
        // Secondary (grey)
        secondary: "bg-[#F0F0F0] text-[#343C3D] rounded-lg hover:bg-[#E5E5E5] active:bg-[#CCCCCC] disabled:text-[#CCCCCC] disabled:pointer-events-none",
        
        // Ghost
        ghost: "hover:bg-[#F0F0F0] hover:text-[#111B1D] rounded-lg",
        
        // Link
        link: "text-[#00008F] underline-offset-4 hover:underline",
        
        // Success (green)
        success: "bg-[#138636] text-white rounded-lg hover:bg-[#138636]/90",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4",
        lg: "h-14 px-8",
        icon: "size-12 rounded-lg",
        "icon-sm": "size-10 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
)

function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
