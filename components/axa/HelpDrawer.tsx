"use client";

import Image from "next/image";
import { Phone, X, MessageCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface HelpDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Placeholder avatars (using same person for demo)
const avatars = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
];

export function HelpDrawer({ open, onOpenChange }: HelpDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="bg-white rounded-t-2xl px-0 pt-0 pb-6 max-h-[90vh] overflow-y-auto [&>button]:hidden"
      >
        {/* Header with close button */}
        <div className="flex flex-col items-center pt-4 pb-8 px-6">
          <div className="flex justify-end w-full">
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded hover:bg-[#F0F0F0] transition-colors"
              aria-label="Close"
            >
              <X className="size-6 text-[#343C3D]" />
            </button>
          </div>

          {/* Got a question section */}
          <div className="flex flex-col gap-8 items-start w-full max-w-[342px]">
            <SheetTitle className="text-2xl font-bold leading-8 text-[#111B1D] text-center w-full">
              Got a question?
            </SheetTitle>
            
            <p className="text-base leading-6 text-[#111B1D]">
              You can always visit our FAQ for more information.
            </p>

            <Button variant="outline" fullWidth>
              Read our FAQ
            </Button>
          </div>
        </div>

        {/* Contact our team section */}
        <div className="bg-white flex flex-col gap-8 items-start px-6 pt-4">
          <div className="flex flex-col gap-6 items-center w-full">
            {/* Avatars */}
            <div className="flex items-start pl-0 pr-3">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className="relative shrink-0 size-[58px]"
                  style={{ marginRight: index < avatars.length - 1 ? "-12px" : 0 }}
                >
                  <Image
                    src={avatar}
                    alt={`Team member ${index + 1}`}
                    fill
                    className="rounded-full object-cover border-2 border-white"
                    unoptimized
                  />
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold leading-8 text-[#111B1D] text-center w-full max-w-[342px]">
              Contact our team
            </h2>

            <p className="text-base font-semibold leading-6 text-[#111B1D] text-center max-w-[342px]">
              You can reach us Monday to Friday by phone or chat between 9 a.m. and 7 p.m.
            </p>
          </div>

          {/* Contact buttons */}
          <div className="flex flex-col gap-2.5 items-center w-full">
            {/* Call button */}
            <Button asChild fullWidth>
              <a href="tel:0890899900">
                <Phone className="size-4" />
                Call 0890 899 900
              </a>
            </Button>

            {/* WhatsApp button */}
            <Button variant="success" asChild fullWidth>
              <a
                href="https://wa.me/33890899900"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* WhatsApp icon */}
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                What&apos;s App
              </a>
            </Button>

            {/* Chat button */}
            <Button variant="outline" fullWidth>
              <MessageCircle className="size-4" />
              Chat now
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
