"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tripTypes = [
  { id: "solo", label: "Solo trip" },
  { id: "partner", label: "Partner trip" },
  { id: "family", label: "Family trip" },
  { id: "abroad", label: "Trip abroad" },
  { id: "student", label: "Student travel" },
];

export default function Home() {
  const router = useRouter();
  const [selectedTripType, setSelectedTripType] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedTrip = tripTypes.find(t => t.id === selectedTripType);

  const handleSelectTrip = (tripId: string) => {
    setSelectedTripType(tripId);
    setIsDrawerOpen(false);
  };

  const handleGetQuote = () => {
    if (selectedTripType) {
      router.push("/form");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header/Navbar - h-72px px-24 */}
      <header className="h-[72px] px-6 flex items-center justify-between bg-white border-b border-[#F0F0F0]">
        {/* Logo AXA */}
        <div className="size-12 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_axa_logo)">
              <path d="M47.9996 0.000366211H0V47.9999H47.9996V0.000366211Z" fill="#00008F"/>
              <path d="M29.7448 23.7048L48.0002 0H45.3039L26.9883 23.7048H29.7448Z" fill="#FF1721"/>
              <path d="M36.6768 34.2831C37.5135 36.6237 39.2374 42.7149 39.9228 43.2002H35.3968C35.3832 42.6617 35.312 42.1262 35.1844 41.6028C34.9892 40.9066 33.3521 35.6398 33.3521 35.6398H26.163L25.0327 37.2422C25.0327 37.2422 26.3903 41.492 26.4746 41.7004C26.621 42.0758 27.2692 43.2002 27.2692 43.2002H22.9318C22.9318 43.2002 22.8193 42.5512 22.7772 42.2809C22.7432 42.0626 22.3662 40.867 22.3662 40.867C22.3662 40.867 21.3831 41.9443 21.1153 42.4438C20.8448 42.9423 20.725 43.2002 20.725 43.2002H17.3317C17.3317 43.2002 17.2184 42.5512 17.1763 42.2809C17.1432 42.0626 16.7281 40.7711 16.7281 40.7711C16.7281 40.7711 15.7782 41.9245 15.5077 42.423C15.239 42.9225 15.1233 43.2002 15.1233 43.2002H11.7673C11.7673 43.2002 12.7156 42.2974 13.0472 41.9096C13.6061 41.2522 15.6889 38.5304 15.6889 38.5304L14.8538 35.6398H7.71916C7.71916 35.6398 3.65122 40.9852 3.49086 41.1506C3.32881 41.3135 2.14315 43.0151 2.11665 43.2002H0V41.8542C0.0262529 41.8256 0.0541256 41.7986 0.0834806 41.7732C0.148843 41.7252 3.16752 37.978 5.94067 34.2831C8.43273 31.0609 10.7709 27.9273 10.976 27.6288C11.4729 26.907 12.1889 25.3485 12.1889 25.3485H15.8773C15.8773 25.3485 15.9915 26.7822 16.099 27.1302C16.1948 27.4378 18.4421 34.8114 18.495 34.8908L19.7377 33.3016L17.6136 26.7631C17.6136 26.7631 17.1159 25.5328 16.9538 25.3485H21.2624C21.2472 25.744 21.2946 26.1394 21.403 26.52C21.5782 27.0592 22.5018 30.3921 22.5018 30.3921C22.5018 30.3921 25.4403 26.7086 25.6123 26.444C25.821 26.114 25.9457 25.7379 25.9753 25.3485H29.5653C29.5653 25.3485 28.908 25.8288 27.7562 27.2857C27.3693 27.776 23.5783 32.5939 23.5783 32.5939C23.5783 32.5939 23.9091 33.7216 24.0703 34.2831C24.1141 34.4443 24.1447 34.5534 24.1447 34.565C24.1447 34.57 24.2282 34.4675 24.372 34.2831C25.3502 33.0436 29.7993 27.2096 30.0689 26.7102C30.2863 26.3068 30.6062 25.8479 30.7939 25.3485H34.2963C34.2963 25.3485 34.3773 26.3944 34.484 26.6838L36.6768 34.2831ZM31.3471 28.7607C30.8328 29.867 27.8058 33.5521 27.8058 33.5521H32.5997C32.5997 33.5521 31.6704 30.6905 31.5083 30.0456C31.4255 29.6332 31.3939 29.2122 31.414 28.7921C31.414 28.7335 31.4033 28.6384 31.3471 28.7607ZM12.9281 28.7607C12.4138 29.867 9.38683 33.5521 9.38683 33.5521H14.1807C14.1807 33.5521 13.2523 30.6905 13.0902 30.0456C13.0074 29.6332 12.9757 29.2122 12.9959 28.7921C12.9959 28.7335 12.9844 28.6384 12.9281 28.7607H12.9281ZM20.1454 39.9343L21.465 38.122C21.3434 37.9913 20.6002 35.7374 20.6002 35.7374L19.3243 37.3927L20.1454 39.9343Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_axa_logo">
                <rect width="48" height="48" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Right: Phone + Menu */}
        <div className="flex items-center gap-4">
          {/* Phone Button */}
          <a 
            href="tel:0975180296"
            className="bg-[#00008F] rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-[#1F1F9C] transition-colors"
          >
            <Phone className="size-5 text-white" />
            <span className="text-xs font-semibold uppercase tracking-[1px] text-white">
              09 75 18 02 96
            </span>
          </a>
          
          {/* Menu Button */}
          <button className="size-12 flex items-center justify-center hover:bg-[#F0F0F0] transition-colors rounded">
            <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 16V13.3333H24V16H0ZM0 9.33333V6.66667H24V9.33333H0ZM0 2.66667V0H24V2.66667H0Z" fill="#00008F"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section - h-457px, px-30 py-40, gap-44 */}
      <div className="relative h-[457px] flex flex-col justify-center px-[30px] py-10 gap-11">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#5f5f5f]" />
          <img 
            src="/hero.jpg" 
            alt="Travelers hiking in mountains"
            className="absolute inset-0 size-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content - gap-24 (24px) */}
        <div className="relative z-10 flex flex-col gap-6 w-[328px]">
          {/* Main Title - Publico Headline Bold 32px, NOT italic */}
          <h1 className="font-headline text-[32px] font-bold leading-8 text-white">
            Wherever you go,<br />
            we're already there.
          </h1>

          {/* Subtitle - Source Sans Pro Regular 20px, leading-28 */}
          <p className="text-xl leading-7 text-white">
            Where your journey begins,<br />
            our protection follows.
          </p>
        </div>

        {/* Stats - gap-16 (16px) */}
        <div className="relative z-10 flex flex-col gap-4 w-full">
          {/* 60 Years - Publico Headline Extrabold 24px + Source Sans SemiBold 16px */}
          <p className="text-white">
            <span className="font-headline text-2xl font-extrabold">60</span>
            <span className="text-base font-semibold ml-1">Years of expertise</span>
          </p>
          {/* 130 Countries */}
          <p className="text-white">
            <span className="font-headline text-2xl font-extrabold">130</span>
            <span className="text-base font-semibold ml-1">Countries worldwide</span>
          </p>
          {/* 24/7 Assistance */}
          <p className="text-white">
            <span className="font-headline text-xl font-extrabold">24/7</span>
            <span className="text-base font-semibold ml-1">Assistance</span>
          </p>
        </div>
      </div>

      {/* Form Section - pt-24 pb-32 px-24, gap-24 */}
      <div className="flex-1 px-6 pt-6 pb-8 flex flex-col gap-6">
        {/* Title - H1: 24px bold, leading-32 */}
        <h2 className="text-2xl font-bold leading-8 text-[#111B1D]">
          What kind of trip are planning?
        </h2>

        {/* Trip Type Selector */}
        <div className="flex flex-col gap-5">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="h-12 rounded border border-[#757575] bg-white flex items-center overflow-hidden hover:border-[#1F1F9C] transition-colors"
          >
            {/* Icon container - square, separated with border */}
            <div className="size-12 flex items-center justify-center border-r border-[#757575]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7805 20.561C6.93116 20.561 3 16.6298 3 11.7805C3 6.93116 6.93116 3 11.7805 3C15.4654 3 18.6202 5.26994 19.9227 8.4878M4.09756 15.0732H6.65854C7.66881 15.0732 8.4878 14.2542 8.4878 13.2439V10.8659C8.4878 9.85557 9.3068 9.03658 10.3171 9.03658H12.1463C13.1566 9.03658 13.9756 8.21759 13.9756 7.20732V4.09756M17.4878 15.2927V15.2267M21 15.2163C21 17.5069 17.4878 20.561 17.4878 20.561C17.4878 20.561 13.9756 17.5069 13.9756 15.2163C13.9756 13.3188 15.5481 11.7805 17.4878 11.7805C19.4275 11.7805 21 13.3188 21 15.2163Z" stroke="#343C3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Text */}
            <span className={cn(
              "flex-1 px-4 text-base text-left leading-6",
              selectedTrip ? "text-[#111B1D]" : "text-[#757575]"
            )}>
              {selectedTrip?.label || "Select your type of trip"}
            </span>
            
            {/* Chevron */}
            <ChevronRight className="size-6 text-[#343C3D] mr-4" />
          </button>
        </div>

        {/* Trustpilot */}
        <div className="flex flex-col gap-2">
          {/* Stars */}
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <div 
                key={star}
                className="size-[18px] bg-[#00B67A] flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 text-white" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            ))}
          </div>
          
          {/* Rating text */}
          <p className="text-xs text-[#111B1D] leading-4">
            Rated 4.6/5 by thousands of travellers
          </p>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-white px-6 py-4">
        <Button 
          fullWidth 
          onClick={handleGetQuote}
          disabled={!selectedTripType}
        >
          Get a quote
        </Button>
      </div>

      {/* Bottom Sheet / Drawer */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[rgba(17,27,29,0.5)] z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 px-4 pt-4 pb-6 flex flex-col items-center gap-6 animate-in slide-in-from-bottom duration-300">
            {/* Handle */}
            <div className="w-[93px] h-1.5 bg-[#D9D9D9] rounded-full" />
            
            {/* Trip Type Options - gap-12 (12px) */}
            <div className="w-full flex flex-col gap-3">
              {tripTypes.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => handleSelectTrip(trip.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-1.5 rounded-lg transition-all",
                    selectedTripType === trip.id
                      ? "bg-[rgba(142,187,255,0.2)]"
                      : "bg-white hover:bg-[#F0F0F0]"
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "size-10 rounded flex items-center justify-center",
                    selectedTripType === trip.id ? "bg-white" : "bg-[#E8F1FF]"
                  )} />
                  
                  {/* Text - 16px Regular (NOT uppercase) */}
                  <span className={cn(
                    "text-base leading-6",
                    selectedTripType === trip.id ? "text-[#00008F]" : "text-[#343C3D]"
                  )}>
                    {trip.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
