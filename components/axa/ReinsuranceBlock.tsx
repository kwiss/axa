"use client";

import { cn } from "@/lib/utils";

const reinsuranceItems = [
  {
    id: "quick",
    title: "Quick and easy",
    description: "Quote in 2 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6V12L16 14" stroke="#5C5CB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#5C5CB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "free",
    title: "Free quote",
    description: "No commitment",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#5C5CB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="#5C5CB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 15L11 17L15 13" stroke="#5C5CB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "personalised",
    title: "Personalised offer",
    description: "Tailored to your needs",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#5C5CB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="#5C5CB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 15L11 17L15 13" stroke="#5C5CB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

interface ReinsuranceBlockProps {
  className?: string;
}

export function ReinsuranceBlock({ className }: ReinsuranceBlockProps) {
  return (
    <div className={cn("flex flex-col gap-4 px-6 py-4 rounded-md", className)}>
      {reinsuranceItems.map((item) => (
        <div key={item.id} className="flex gap-2.5 items-center">
          {/* Icon container - 52x52 */}
          <div className="size-[52px] bg-[#E8F1FF] rounded-lg flex items-center justify-center flex-shrink-0">
            {item.icon}
          </div>
          
          {/* Text content */}
          <div className="flex flex-col">
            <p className="text-xl font-semibold leading-7 text-[#111B1D]">
              {item.title}
            </p>
            <p className="text-base leading-6 text-[#757575]">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

