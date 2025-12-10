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
  emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

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
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  // Sync parent state when selection changes
  useEffect(() => {
    if (plans[selectedIndex]) {
      onSelectPlan(plans[selectedIndex].id);
    }
  }, [selectedIndex, plans, onSelectPlan]);

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
