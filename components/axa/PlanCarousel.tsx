"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PlanCarouselCard } from "./PlanCarouselCard";

export interface Plan {
  id: string;
  name: string;
  price: number;
}

interface PlanCarouselProps {
  plans: Plan[];
  selectedPlanId: string;
  onSelectPlan: (planId: string) => void;
  className?: string;
}

export function PlanCarousel({
  plans,
  selectedPlanId,
  onSelectPlan,
  className,
}: PlanCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll to center the selected plan
  const scrollToCenter = useCallback((planId: string) => {
    const container = scrollContainerRef.current;
    const card = cardRefs.current.get(planId);
    if (!container || !card) return;

    const containerWidth = container.clientWidth;
    const cardRect = card.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Current position of card relative to container's visible area
    const cardLeftRelative = cardRect.left - containerRect.left;
    const cardCenter = cardLeftRelative + cardRect.width / 2;
    const containerCenter = containerWidth / 2;
    
    // How much we need to scroll to center the card
    const scrollAdjustment = cardCenter - containerCenter;
    const newScrollPosition = container.scrollLeft + scrollAdjustment;
    
    container.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  }, []);

  // Scroll to selected plan on mount and when selection changes
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCenter(selectedPlanId);
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedPlanId, scrollToCenter]);

  // Handle plan selection
  const handleSelectPlan = (planId: string) => {
    onSelectPlan(planId);
  };

  // Set ref for a card
  const setCardRef = (planId: string) => (el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(planId, el);
    } else {
      cardRefs.current.delete(planId);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Scrollable Cards Container */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex gap-4 items-start">
          {/* Left spacer to allow first card to center */}
          <div className="shrink-0" style={{ width: "calc(50vw - 103.5px)" }} />
          
          {plans.map((plan) => (
            <div key={plan.id} ref={setCardRef(plan.id)} className="shrink-0">
              <PlanCarouselCard
                name={plan.name}
                price={plan.price}
                isSelected={plan.id === selectedPlanId}
                onSelect={() => handleSelectPlan(plan.id)}
              />
            </div>
          ))}
          
          {/* Right spacer to allow last card to center */}
          <div className="shrink-0" style={{ width: "calc(50vw - 103.5px)" }} />
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-3 items-center justify-center py-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => handleSelectPlan(plan.id)}
            className={cn(
              "size-2.5 rounded-full transition-colors",
              plan.id === selectedPlanId
                ? "bg-[#00008F]"
                : "bg-[#CCCCCC]"
            )}
            aria-label={`Select ${plan.name} plan`}
          />
        ))}
      </div>
    </div>
  );
}
