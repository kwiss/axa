"use client";

import { Phone, MessageCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/axa";

// Team avatars - real human photos
const TEAM_AVATARS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
];

// Italy landscape background for the policy card
const ITALY_BACKGROUND = "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800&q=80";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Same as Home page style */}
      <header className="h-[72px] px-6 flex items-center justify-between bg-white border-b border-[#F0F0F0]">
        {/* Logo AXA */}
        <Logo size={48} />

        {/* Menu Button */}
        <button className="size-12 flex items-center justify-center hover:bg-[#F0F0F0] transition-colors rounded">
          <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 16V13.3333H24V16H0ZM0 9.33333V6.66667H24V9.33333H0ZM0 2.66667V0H24V2.66667H0Z" fill="#00008F"/>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-4 pb-8 flex flex-col gap-8">
        {/* Congratulations Section */}
        <div className="flex flex-col gap-6 items-center text-center">
          <h1 className="text-2xl font-bold leading-8 text-[#111B1D]">
            Congratulations! Your trip to Italy is now protected!
          </h1>
          <p className="text-base leading-6 text-[#111B1D]">
            Your travel insurance has been successfully activated. We've sent your travel insurance details to your email.
          </p>
        </div>

        {/* Policy Card with Italy Background */}
        <div className="relative rounded-md overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={ITALY_BACKGROUND}
              alt="Italian landscape"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-4 flex flex-col gap-5">
            <h2 className="text-xl font-bold leading-7 text-white">
              Enjoy your trip to Italy
            </h2>

            <div className="flex flex-col gap-2.5 backdrop-blur-[10px]">
              <p className="text-xs font-semibold uppercase tracking-[1px] text-white">
                Your policy number
              </p>
              <p className="text-2xl font-bold leading-8 text-white">
                098 766 5545 33
              </p>
            </div>

            <Button fullWidth>
              Add to your wallet
            </Button>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#D9EAEC] rounded-md p-4 flex flex-col gap-5">
          {/* Header with Team Avatars */}
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
              Contact
            </h2>
            
            {/* Team Avatars */}
            <div className="flex items-center -space-x-2">
              {TEAM_AVATARS.map((avatar, index) => (
                <div 
                  key={index}
                  className="size-7 rounded-full border-2 border-white overflow-hidden"
                  style={{ zIndex: TEAM_AVATARS.length - index }}
                >
                  <img 
                    src={avatar}
                    alt={`Team member ${index + 1}`}
                    className="size-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contact Hours */}
          <p className="text-base font-semibold leading-6 text-[#111B1D]">
            You can reach us Monday to Friday,<br />
            between 9 a.m. and 7 p.m.
          </p>

          {/* Contact Buttons */}
          <div className="flex flex-col gap-3">
            <Button fullWidth asChild>
              <a href="tel:0890899900">
                <Phone className="size-4" />
                Call 0890 899 900
              </a>
            </Button>

            <Button variant="outline" fullWidth>
              <MessageCircle className="size-4" />
              Chat now
            </Button>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-[#E8F1FF] rounded-md p-4 flex flex-col gap-6">
          <h2 className="text-xl font-bold leading-7 text-[#111B1D]">
            Download your documents
          </h2>

          <div className="flex flex-col gap-3">
            {/* Terms and Conditions Link */}
            <a 
              href="#"
              className="flex items-center gap-2 text-[#00008F] hover:underline"
            >
              <Download className="size-4" />
              <span className="text-sm font-semibold uppercase tracking-[1px]">
                Terms and conditions
              </span>
            </a>

            {/* Policy Documentation Link */}
            <a 
              href="#"
              className="flex items-center gap-2 text-[#00008F] hover:underline"
            >
              <Download className="size-4" />
              <span className="text-sm font-semibold uppercase tracking-[1px]">
                Policy documentation
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
