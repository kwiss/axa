"use client";

import { Logo } from "./Logo";

interface FormHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

export function FormHeader({ currentStep, totalSteps, onBack }: FormHeaderProps) {
  // Calculate progress percentage
  const progressWidth = (currentStep / totalSteps) * 100;

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top row: Logo + Help */}
      <div className="flex items-center justify-between px-5 py-4">
        {/* Logo 32px */}
        <div className="size-8">
          <Logo size={32} />
        </div>

        {/* Help Button - pill style */}
        <button className="h-8 w-[66px] bg-[#00008F] rounded-full flex items-center justify-center gap-[5px] px-[5px] hover:bg-[#1F1F9C] transition-colors">
          {/* Info icon 16x16 */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00049 1.33923C8.92178 1.33927 9.78794 1.51404 10.5981 1.86365C11.4084 2.21331 12.1131 2.68819 12.7124 3.28748C13.3118 3.88689 13.7865 4.59229 14.1362 5.40271C14.4858 6.21294 14.6606 7.07904 14.6606 8.00037C14.6606 8.92165 14.4858 9.78782 14.1362 10.598C13.7865 11.4083 13.3117 12.1129 12.7124 12.7123C12.1131 13.3116 11.4084 13.7864 10.5981 14.1361C9.78794 14.4857 8.92178 14.6605 8.00049 14.6605C7.07916 14.6605 6.21307 14.4857 5.40283 14.1361C4.59242 13.7864 3.88702 13.3117 3.2876 12.7123C2.68831 12.1129 2.21343 11.4083 1.86377 10.598C1.51416 9.78782 1.3394 8.92165 1.33936 8.00037C1.33936 7.07908 1.51422 6.21291 1.86377 5.40271C2.21347 4.59229 2.68818 3.88689 3.2876 3.28748C3.88702 2.68806 4.59242 2.21335 5.40283 1.86365C6.21303 1.5141 7.07921 1.33923 8.00049 1.33923ZM8.00049 2.66052C6.50998 2.66052 5.24693 3.17775 4.2124 4.21228C3.17787 5.24681 2.66064 6.50985 2.66064 8.00037C2.66072 9.49066 3.17806 10.7531 4.2124 11.7875C5.24693 12.822 6.50998 13.3392 8.00049 13.3392C9.49086 13.3392 10.7531 12.8219 11.7876 11.7875C12.8221 10.753 13.3393 9.49074 13.3394 8.00037C13.3394 6.50985 12.8221 5.24681 11.7876 4.21228C10.7532 3.17793 9.49078 2.6606 8.00049 2.66052ZM8.66064 7.33923V11.3275H7.33936V7.33923H8.66064ZM8.00049 4.67322C8.18766 4.67329 8.34472 4.7362 8.47119 4.86267C8.59763 4.98919 8.66064 5.14614 8.66064 5.33337C8.66064 5.52061 8.59763 5.67756 8.47119 5.80408C8.34472 5.93055 8.18766 5.99346 8.00049 5.99353C7.81325 5.99353 7.6563 5.93052 7.52979 5.80408C7.40324 5.67753 7.33936 5.52069 7.33936 5.33337C7.33936 5.14606 7.40324 4.98922 7.52979 4.86267C7.6563 4.73623 7.81325 4.67322 8.00049 4.67322Z" fill="white" stroke="white" strokeWidth="0.0125"/>
          </svg>
          <span className="text-xs text-white leading-4">Help</span>
        </button>
      </div>

      {/* Bottom row: Back + Progress + Steps */}
      <div className="flex items-center gap-1 px-5 pb-2">
        {/* Back button */}
        <button 
          onClick={onBack}
          className="flex items-center justify-center size-6 -ml-1"
          aria-label="Go back"
        >
          {/* West arrow icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L3 12L9 6" stroke="#343C3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 12H21" stroke="#343C3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-[#F0F0F0] rounded-lg overflow-hidden">
          <div 
            className="h-full bg-[#00008F] rounded-lg transition-all duration-300"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        {/* Steps indicator */}
        <span className="text-xs text-[#343C3D] leading-4 ml-1 w-[19px] text-center">
          {currentStep}/{totalSteps}
        </span>
      </div>
    </header>
  );
}

