"use client";

import React, { useCallback, useEffect, useState } from "react";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { PlanCarouselCard } from "./PlanCarouselCard";

// ============================================
// Types
// ============================================

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
  options?: EmblaOptionsType;
  className?: string;
}

// ============================================
// useDotButton Hook (from Embla docs)
// ============================================

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
  initialIndex: number = 0
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const updateScrollSnaps = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    const updateSelectedIndex = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Subscribe to events
    emblaApi
      .on("reInit", updateScrollSnaps)
      .on("reInit", updateSelectedIndex)
      .on("select", updateSelectedIndex);

    // Defer initial state update to satisfy lint rule
    const rafId = requestAnimationFrame(() => {
      if (emblaApi.scrollSnapList().length > 0) {
        updateScrollSnaps();
        updateSelectedIndex();
      }
    });

    // Return cleanup function
    return () => {
      cancelAnimationFrame(rafId);
      emblaApi
        .off("reInit", updateScrollSnaps)
        .off("reInit", updateSelectedIndex)
        .off("select", updateSelectedIndex);
    };
  }, [emblaApi]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

// ============================================
// PlanCarousel Component
// ============================================

export function PlanCarousel({
  plans,
  selectedPlanId,
  onSelectPlan,
  options,
  className,
}: PlanCarouselProps) {
  // Get the initial index from options or find it from selectedPlanId
  const initialIndex = options?.startIndex ?? plans.findIndex((p) => p.id === selectedPlanId);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    startIndex: initialIndex >= 0 ? initialIndex : 0,
  });

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi, initialIndex >= 0 ? initialIndex : 0);

  // Sync parent state when carousel selection changes
  useEffect(() => {
    const currentPlan = plans[selectedIndex];
    if (currentPlan && currentPlan.id !== selectedPlanId) {
      onSelectPlan(currentPlan.id);
    }
  }, [selectedIndex, plans, selectedPlanId, onSelectPlan]);

  // Handle click on a card
  const handleCardClick = (index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  };

  return (
    <section className={cn("embla", className)}>
      {/* Viewport */}
      <div className="embla__viewport" ref={emblaRef}>
        {/* Container */}
        <div className="embla__container gap-4">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={cn(
                "embla__slide",
                index === selectedIndex
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-70"
              )}
              style={{ transition: "transform 0.3s ease-out, opacity 0.3s ease-out" }}
            >
              <PlanCarouselCard
                name={plan.name}
                price={plan.price}
                isSelected={index === selectedIndex}
                isRecommended={plan.isRecommended}
                onSelect={() => handleCardClick(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onDotButtonClick(index)}
            className={cn(
              "embla__dot",
              index === selectedIndex && "embla__dot--selected"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
