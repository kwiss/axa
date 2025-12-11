"use client";

import { Check, Plus, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Icons for each add-on type - use currentColor to inherit text color
function SportIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-6", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2C12 2 16 6 16 12C16 18 12 22 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LuggageIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-6", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 21V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 7H20C20.5523 7 21 7.44772 21 8V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V8C3 7.44772 3.44772 7 4 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 21V18M14 21V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-6", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 16V8C21 6.9 20.1 6 19 6H15.5L14 8L12.5 6H9L7.5 8L6 6H2.5C2.22386 6 2 6.22386 2 6.5V7.5C2 7.77614 2.22386 8 2.5 8H6L4 12H2V14H5L7 10V14L5 16V18H19C20.1 18 21 17.1 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TrainIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-6", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 11V15C4 16.1 4.9 17 6 17H7L6 20H8L9 17H15L16 20H18L17 17H18C19.1 17 20 16.1 20 15V11C20 8.8 18.2 7 16 7H8C5.8 7 4 8.8 4 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 4H15V7H9V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="14" r="1" fill="currentColor"/>
      <circle cx="16" cy="14" r="1" fill="currentColor"/>
    </svg>
  );
}

function LaptopIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-6", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V14H4V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17H22V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Check circle icon for benefits
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-6 text-[#138636]", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
    </svg>
  );
}

export type AddOnType = 
  | "sport" 
  | "luggages" 
  | "cancel-any-reason" 
  | "missed-connection" 
  | "electronics";

export interface AddOnBenefit {
  label: string;
  highlight?: string;
}

export interface AddOnCardV2Props {
  type: AddOnType;
  title: string;
  titleSecondLine?: string;
  price: string;
  benefits: AddOnBenefit[];
  isSelected?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  className?: string;
}

const iconMap: Record<AddOnType, React.FC<{ className?: string }>> = {
  sport: SportIcon,
  luggages: LuggageIcon,
  "cancel-any-reason": PlaneIcon,
  "missed-connection": TrainIcon,
  electronics: LaptopIcon,
};

export function AddOnCardV2({
  type,
  title,
  titleSecondLine,
  price,
  benefits,
  isSelected = false,
  onAdd,
  onRemove,
  className,
}: AddOnCardV2Props) {
  const Icon = iconMap[type];

  return (
    <div 
      className={cn(
        "flex flex-col w-full shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div 
        className={cn(
          "p-4 flex items-end justify-between border border-[rgba(92,92,183,0.1)] rounded-t-lg text-[#00008F]",
          isSelected ? "bg-[#DCF8E5]" : "bg-[#E8F1FF]"
        )}
      >
        {/* Title and Icon */}
        <div className="flex flex-col items-start justify-end">
          <div className="flex items-start gap-2">
            <Icon className="size-6 flex-shrink-0" />
            <div className="flex flex-col">
              <p className="text-lg font-bold leading-7">
                {title}
              </p>
              {titleSecondLine && (
                <p className="text-lg font-bold leading-7">
                  {titleSecondLine}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Price */}
        <p className="text-xl font-semibold leading-7">
          {price}
        </p>
      </div>

      {/* Body */}
      <div className="bg-white p-6 flex flex-col gap-6 rounded-b-lg">
        {/* Benefits List */}
        <div className="flex flex-col gap-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-base font-semibold leading-6 text-[#111B1D] flex-1 pr-2">
                {benefit.label}
                {benefit.highlight && (
                  <>
                    <br />
                    <span className="text-[#138636]">{benefit.highlight}</span>
                  </>
                )}
              </p>
              <CheckCircleIcon className="flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Terms and Conditions Link */}
        <button 
          type="button"
          className="flex items-center gap-2 text-[#00008F] hover:underline"
        >
          <ExternalLink className="size-4" />
          <span className="text-sm font-semibold uppercase tracking-[1px]">
            Terms and conditions
          </span>
        </button>

        {/* Action Buttons */}
        <div className="flex gap-6">
          {isSelected ? (
            <>
              {/* Added Button (Green) - also acts as toggle */}
              <button
                type="button"
                onClick={onRemove}
                className="w-[136px] h-12 bg-[#138636] text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[1px] hover:bg-[#0f7a2e] transition-colors cursor-pointer"
              >
                <Check className="size-6" />
                Added
              </button>
              
              {/* Remove Button (Text only) */}
              <button
                type="button"
                onClick={onRemove}
                className="w-[136px] h-12 flex items-center justify-center text-sm font-semibold uppercase tracking-[1px] text-[#00008F] hover:underline"
              >
                Remove
              </button>
            </>
          ) : (
            /* Add Button (Blue) */
            <button
              type="button"
              onClick={onAdd}
              className="w-[136px] h-12 bg-[#1F1F9C] text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[1px] hover:bg-[#00008F] transition-colors"
            >
              <Plus className="size-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
