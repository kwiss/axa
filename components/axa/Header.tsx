"use client";

import { ChevronLeft, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
  showBack?: boolean;
  showHelp?: boolean;
  className?: string;
}

export function Header({ 
  currentStep,
  totalSteps,
  onBack, 
  showBack = true, 
  showHelp = true,
  className,
}: HeaderProps) {
  return (
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
          <button className="bg-[#138636] rounded-full px-2.5 py-1.5 flex items-center gap-1 hover:bg-[#138636]/90 transition-colors">
            <Phone className="size-3 text-white" />
            <span className="text-xs text-white font-normal">Call</span>
          </button>
        )}
      </div>
    </header>
  );
}
