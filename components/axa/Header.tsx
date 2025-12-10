"use client";

import { useState } from "react";
import { ChevronLeft, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { HelpDrawer } from "./HelpDrawer";
import { Logo } from "./Logo";

interface HeaderProps {
  variant?: "form" | "plans";
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
  onHelpClick?: () => void;
  showBack?: boolean;
  showHelp?: boolean;
  className?: string;
}

export function Header({ 
  variant = "form",
  currentStep,
  totalSteps,
  onBack, 
  onHelpClick,
  showBack = true, 
  showHelp = true,
  className,
}: HeaderProps) {
  const [helpOpen, setHelpOpen] = useState(false);

  const handleHelpClick = () => {
    if (onHelpClick) {
      onHelpClick();
    } else {
      setHelpOpen(true);
    }
  };

  // Plans variant - Logo + Progress + Help
  if (variant === "plans") {
    return (
      <>
        <header className={cn("sticky top-0 z-50 bg-white", className)}>
          {/* Top row: Logo + Help */}
          <div className="flex items-center justify-between px-5 py-4">
            <Logo size={32} />
            
            {showHelp && (
              <button
                onClick={handleHelpClick}
                className="bg-[#00008F] rounded-full h-8 px-1.5 flex items-center gap-1 hover:bg-[#1F1F9C] transition-colors"
              >
                <Info className="size-4 text-white" />
                <span className="text-xs text-white pr-1">Help</span>
              </button>
            )}
          </div>

          {/* Bottom row: Back + Progress + Steps */}
          <div className="flex items-center gap-1 px-5 pb-2">
            {showBack && (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded hover:bg-[#F0F0F0] transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="size-6 text-[#343C3D]" />
              </button>
            )}
            
            {currentStep && totalSteps && (
              <>
                {/* Progress Bar */}
                <div className="flex-1 h-1.5 bg-[#F0F0F0] rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-[#00008F] rounded-lg transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                
                {/* Step Counter */}
                <span className="text-xs text-[#343C3D] ml-1 min-w-[19px]">
                  {currentStep}/{totalSteps}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Help Drawer - only show if no custom handler */}
        {!onHelpClick && <HelpDrawer open={helpOpen} onOpenChange={setHelpOpen} />}
      </>
    );
  }

  // Default form variant
  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 bg-white px-5 py-4",
        className
      )}>
        <div className="flex items-center justify-between h-6">
          {/* Left: Back + Progress + Steps */}
          <div className="flex items-center gap-0.5">
            {showBack && (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded hover:bg-[#F0F0F0] transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="size-6 text-[#343C3D]" />
              </button>
            )}
            
            {currentStep && totalSteps && (
              <>
                {/* Progress Bar */}
                <div className="w-[211px] h-1.5 bg-[#F0F0F0] rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-[#00008F] rounded-lg transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                
                {/* Step Counter */}
                <span className="text-xs text-[#343C3D] ml-1 min-w-[19px]">
                  {currentStep}/{totalSteps}
                </span>
              </>
            )}
          </div>

          {/* Right: Help Button */}
          {showHelp && (
            <button 
              onClick={handleHelpClick}
              className="bg-[#00008F] rounded-full px-2 py-1.5 flex items-center gap-1 hover:bg-[#1F1F9C] transition-colors"
            >
              <Info className="size-4 text-white" />
              <span className="text-xs text-white font-normal">Help</span>
            </button>
          )}
        </div>
      </header>

      {/* Help Drawer - only show if no custom handler */}
      {!onHelpClick && <HelpDrawer open={helpOpen} onOpenChange={setHelpOpen} />}
    </>
  );
}
