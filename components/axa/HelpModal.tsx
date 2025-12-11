"use client";

import Image from "next/image";
import { X, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Team avatars
const avatars = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
];

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function HelpModal({ isOpen, onClose, className }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[rgba(17,27,29,0.5)] z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 pb-6",
          className
        )}
      >
        {/* Header with close button */}
        <div className="flex justify-end p-4">
          <button
            type="button"
            onClick={onClose}
            className="size-6 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="size-5 text-[#343C3D]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 flex flex-col gap-8">
          {/* FAQ Section */}
          <div className="flex flex-col gap-8 items-center text-center">
            <h2 className="text-2xl font-bold leading-8 text-[#111B1D]">
              Got a question?
            </h2>
            <p className="text-base leading-6 text-[#111B1D]">
              You can always visit our FAQ for more information.
            </p>
            <button
              type="button"
              className="w-full h-12 px-6 py-4 border border-[#1F1F9C] bg-transparent rounded text-sm font-semibold uppercase tracking-[1px] text-[#343C3D] hover:bg-[#F0F0F0] transition-colors"
            >
              Read our FAQ
            </button>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-6 items-center">
            {/* Agent Avatars */}
            <div className="flex items-center -space-x-3">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className={cn(
                    "size-[58px] rounded-full border-2 border-white overflow-hidden relative",
                    index === 1 && "z-10"
                  )}
                >
                  <Image
                    src={avatar}
                    alt={`Team member ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold leading-8 text-[#111B1D] text-center">
              Contact our team
            </h2>

            <p className="text-base font-semibold leading-6 text-[#111B1D] text-center">
              You can reach us Monday to Friday by phone or chat between 9 a.m. and 7 p.m.
            </p>
          </div>

          {/* Contact Buttons */}
          <div className="flex flex-col gap-2.5">
            {/* Call Button */}
            <a
              href="tel:0890899900"
              className="w-full h-12 px-6 flex items-center justify-center gap-2 bg-[#00008F] rounded-lg text-sm font-semibold uppercase tracking-[1px] text-white hover:bg-[#1F1F9C] transition-colors"
            >
              <Phone className="size-4" />
              Call 0890 899 900
            </a>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/33890899900"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 px-6 flex items-center justify-center gap-2 bg-[#138636] rounded-lg text-sm font-semibold uppercase tracking-[1px] text-white hover:bg-[#0f6b2a] transition-colors"
            >
              {/* WhatsApp icon */}
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              What&apos;s App
            </a>

            {/* Chat Button */}
            <button
              type="button"
              className="w-full h-12 px-6 flex items-center justify-center gap-2 border border-[#1F1F9C] bg-transparent rounded text-sm font-semibold uppercase tracking-[1px] text-[#343C3D] hover:bg-[#F0F0F0] transition-colors"
            >
              <MessageCircle className="size-4" />
              Chat now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
