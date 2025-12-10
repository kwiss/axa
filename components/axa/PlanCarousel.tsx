"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { PlanCarouselCard } from "./PlanCarouselCard";

export interface Plan {
  id: string;
  name: string;
  price: number;
  isRecommended?: boolean;
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: false, // Allow scrolling past edges to center first/last
    loop: false,
    skipSnaps: false,
    startIndex: plans.findIndex((p) => p.id === selectedPlanId),
    duration: 30, // Smooth slide animation (higher = slower/smoother)
  });

  const [selectedIndex, setSelectedIndex] = useState(
    plans.findIndex((p) => p.id === selectedPlanId)
  );

  // Sync selected index when embla settles
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    // Update parent state with the new selected plan
    if (plans[index]) {
      onSelectPlan(plans[index].id);
    }
  }, [emblaApi, plans, onSelectPlan]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Scroll to selected plan when it changes from outside
  useEffect(() => {
    if (!emblaApi) return;
    const targetIndex = plans.findIndex((p) => p.id === selectedPlanId);
    if (targetIndex !== -1 && targetIndex !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(targetIndex);
    }
  }, [emblaApi, selectedPlanId, plans]);

  // Handle click on a card
  const handleCardClick = (index: number, planId: string) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
    onSelectPlan(planId);
  };

  // Handle click on pagination dot
  const handleDotClick = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Embla Carousel */}
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={cn(
                "flex-none transition-all duration-300 ease-out",
                index === selectedIndex
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-70"
              )}
              style={{ width: "207px" }}
            >
              <PlanCarouselCard
                name={plan.name}
                price={plan.price}
                isSelected={index === selectedIndex}
                isRecommended={plan.isRecommended}
                onSelect={() => handleCardClick(index, plan.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-3 items-center justify-center py-4">
        {plans.map((plan, index) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => handleDotClick(index)}
            className={cn(
              "size-2.5 rounded-full transition-colors",
              index === selectedIndex
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
