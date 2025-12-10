"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dates: { start: string; end: string }) => void;
  selectedDates?: { start: string; end: string } | null;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDisplayDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]}, ${date.getDate()}, ${date.getFullYear()}`;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  return date > start && date < end;
}

// Helper to chunk array into weeks
function chunkIntoWeeks<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function DateRangePicker({
  isOpen,
  onClose,
  onSelect,
}: DateRangePickerProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Get days for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Previous month days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  // Second month
  const secondMonthDays = useMemo(() => {
    const nextMonth = currentMonth + 1;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const adjustedMonth = nextMonth % 12;

    const firstDay = new Date(nextYear, adjustedMonth, 1);
    const lastDay = new Date(nextYear, adjustedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    const prevMonthLastDay = new Date(nextYear, adjustedMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(nextYear, adjustedMonth - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(nextYear, adjustedMonth, i),
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextYear, adjustedMonth + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (date < startDate) {
      setStartDate(date);
      setEndDate(null);
    } else {
      setEndDate(date);
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleConfirm = () => {
    if (startDate && endDate) {
      onSelect({
        start: formatDate(startDate),
        end: formatDate(endDate),
      });
      onClose();
    }
  };

  // Check if a week row contains any dates in the selection range
  const getWeekRangeInfo = (week: Array<{ date: Date; isCurrentMonth: boolean }>) => {
    let hasStart = false;
    let hasEnd = false;
    let hasInRange = false;
    let startIndex = -1;
    let endIndex = -1;

    week.forEach((day, idx) => {
      if (startDate && isSameDay(day.date, startDate)) {
        hasStart = true;
        startIndex = idx;
      }
      if (endDate && isSameDay(day.date, endDate)) {
        hasEnd = true;
        endIndex = idx;
      }
      if (isInRange(day.date, startDate, endDate)) {
        hasInRange = true;
      }
    });

    return { hasStart, hasEnd, hasInRange, startIndex, endIndex };
  };

  const renderWeek = (week: Array<{ date: Date; isCurrentMonth: boolean }>, weekIndex: number) => {
    const { hasStart, hasEnd, hasInRange, startIndex, endIndex } = getWeekRangeInfo(week);
    const needsRangeBackground = hasStart || hasEnd || hasInRange;

    return (
      <div key={weekIndex} className="relative flex">
        {/* Range background layer - continuous blue band */}
        {needsRangeBackground && startDate && endDate && (
          <div
            className="absolute inset-y-0 bg-[rgba(142,187,255,0.2)]"
            style={{
              left: hasStart ? `${startIndex * 48}px` : 0,
              right: hasEnd ? `${(6 - endIndex) * 48}px` : 0,
              borderTopLeftRadius: hasStart ? '4px' : 0,
              borderBottomLeftRadius: hasStart ? '4px' : 0,
              borderTopRightRadius: hasEnd ? '4px' : 0,
              borderBottomRightRadius: hasEnd ? '4px' : 0,
            }}
          />
        )}

        {/* Day cells */}
        {week.map((day, dayIndex) => {
          const isStart = startDate && isSameDay(day.date, startDate);
          const isEnd = endDate && isSameDay(day.date, endDate);
          const inRange = isInRange(day.date, startDate, endDate);
          const isToday = isSameDay(day.date, today);

          return (
            <button
              key={day.date.toISOString()}
              type="button"
              onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
              disabled={!day.isCurrentMonth}
              className={cn(
                "w-[38px] h-[39px] flex items-center justify-center text-base relative z-10 mx-[5px]",
                !day.isCurrentMonth && "text-[#CCCCCC] cursor-default",
                day.isCurrentMonth && !isStart && !isEnd && !inRange && !isToday && "text-black hover:bg-[#F0F0F0] rounded-full",
                isToday && !isStart && !isEnd && "border border-[#5C5CB7] rounded text-[#5C5CB7]",
                isStart && "bg-[#1F1F9C] text-white rounded-l",
                isEnd && "bg-[#1F1F9C] text-white rounded-r",
                inRange && "text-black"
              )}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    );
  };

  const calendarWeeks = chunkIntoWeeks(calendarDays.slice(0, 42), 7);
  const secondMonthWeeks = chunkIntoWeeks(secondMonthDays.slice(0, 42), 7);

  const nextMonth = currentMonth + 1 > 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth + 1 > 11 ? currentYear + 1 : currentYear;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-center relative">
        <h2 className="text-xl font-bold leading-7 text-[#111B1D] text-center">
          Select your dates
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-6 p-1 rounded hover:bg-[#F0F0F0] transition-colors"
        >
          <X className="size-6 text-[#343C3D]" />
        </button>
      </div>

      {/* Date inputs */}
      <div className="px-4 pb-4 flex gap-2">
        <div className="flex-1 h-16 px-4 py-3 rounded-lg border border-[#CCCCCC] bg-white flex flex-col justify-center">
          <span className="text-xs text-[#757575] leading-4">Start date</span>
          <span className={cn(
            "text-base leading-6",
            startDate ? "text-[#111B1D]" : "text-[#757575]"
          )}>
            {startDate ? formatDisplayDate(startDate) : ""}
          </span>
        </div>
        <div className="flex-1 h-16 px-4 py-3 rounded-lg border border-[#CCCCCC] bg-white flex flex-col justify-center">
          <span className="text-xs text-[#757575] leading-4">End date</span>
          <span className={cn(
            "text-base leading-6",
            endDate ? "text-[#111B1D]" : "text-[#757575]"
          )}>
            {endDate ? formatDisplayDate(endDate) : ""}
          </span>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-auto px-[17px]">
        {/* First Month */}
        <div className="mb-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4 w-[326px]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="size-6 flex items-center justify-center"
            >
              <ChevronLeft className="size-6 text-[#111B1D]" />
            </button>
            <span className="text-xl font-semibold leading-7 text-[#111B1D]">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="size-6 flex items-center justify-center"
            >
              <ChevronRight className="size-6 text-[#111B1D]" />
            </button>
          </div>

          {/* Weekdays */}
          <div className="flex w-[326px]">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="w-[38px] h-[24px] flex items-center justify-center text-base font-semibold text-[#111B1D] mx-[5px]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E5E5E5] my-4 w-[326px]" />

          {/* Days by week */}
          <div className="flex flex-col gap-[10px] w-[326px]">
            {calendarWeeks.map((week, idx) => renderWeek(week, idx))}
          </div>
        </div>

        {/* Second Month */}
        <div className="mb-4 pt-4">
          <div className="flex items-center justify-center mb-4 w-[326px]">
            <span className="text-xl font-semibold leading-7 text-[#111B1D]">
              {MONTHS[nextMonth]} {nextMonthYear}
            </span>
          </div>

          {/* Weekdays */}
          <div className="flex w-[326px]">
            {WEEKDAYS.map((day) => (
              <div
                key={`second-${day}`}
                className="w-[38px] h-[24px] flex items-center justify-center text-base font-semibold text-[#111B1D] mx-[5px]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E5E5E5] my-4 w-[326px]" />

          {/* Days by week */}
          <div className="flex flex-col gap-[10px] w-[326px]">
            {secondMonthWeeks.map((week, idx) => renderWeek(week, idx + 10))}
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="px-6 py-4 flex gap-2">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 h-12 px-6 rounded-lg border border-[#00008F] bg-white text-sm font-semibold uppercase tracking-[1px] text-[#343C3D] flex items-center justify-center hover:bg-[#F0F0F0] transition-colors"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!startDate || !endDate}
          className={cn(
            "flex-1 h-12 px-6 rounded-lg text-sm font-semibold uppercase tracking-[1px] text-white flex items-center justify-center transition-colors",
            startDate && endDate
              ? "bg-[#00008F] hover:bg-[#1F1F9C]"
              : "bg-[#F0F0F0] text-[#CCCCCC] cursor-not-allowed"
          )}
        >
          {startDate && endDate ? "Continue" : "Select dates"}
        </button>
      </div>
    </div>
  );
}
