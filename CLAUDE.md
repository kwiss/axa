# AXA Travel Insurance Funnel

## Project Overview
Next.js 16 (App Router) travel insurance quote funnel with AXA branding. Mobile-first progressive form flow.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn UI (new-york style) + Custom AXA components
- **Font principale**: Source Sans Pro (Source Sans 3)
- **Font hero**: Publico Headline (local, `/public/fonts/`) - NOT italic
- **Icons**: Lucide React + Custom SVGs

## Critical Rules

1. **NEVER run `npm run dev` or `npm run build` without asking first**
2. **Focus ≠ Selected** - Focus is temporary (shadow), Selected is persistent (background color)
3. **Publico Headline is NEVER italic**
4. **Use real human photos** for avatars, never placeholders with gradients/letters
5. **Icons in buttons = 16px** (`size-4`)

## Commands
```bash
bun dev      # Start dev server (ASK FIRST)
bun build    # Build for production (ASK FIRST)
bun lint     # Run ESLint
```

## Project Structure
```
app/
├── page.tsx              # Home (hero + trip selector + bottom sheet)
├── form/page.tsx         # Progressive form (7 sections with debounce)
├── plans/                # Plan selection
└── globals.css           # AXA theme + Tailwind config

components/
├── ui/                   # Shadcn components (customized)
└── axa/                  # Custom AXA components
    ├── Logo.tsx, Header.tsx, FormHeader.tsx
    ├── YesNoButtons.tsx, SelectableCard.tsx
    ├── InputWithSuffix.tsx, InputField.tsx, SelectField.tsx
    ├── InfoTooltip.tsx, ProgressBar.tsx
    ├── DestinationPicker.tsx, DateRangePicker.tsx, DateSelector.tsx
    ├── PlanCard.tsx, PlanCarousel.tsx, AddOnCard.tsx
    ├── HelpDrawer.tsx, HelpModal.tsx, CoverageDetailDrawer.tsx
    └── ReinsuranceBlock.tsx, TripSummaryBar.tsx, RecapSection.tsx

lib/utils.ts              # cn() utility
public/fonts/             # PublicoHeadline-*.otf
```

## AXA Color Palette
```css
/* Primary - AXA Blue */
--axa-blue-400: #00008F;  /* Main brand */
--axa-blue-300: #1F1F9C;  /* Hover/active */
--axa-blue-200: #3D3DAA;
--axa-blue-100: #5C5CB7;

/* Semantic */
--green: #138636;         /* Success, CTA secondary */
--sienna: #D24723;        /* Destructive, errors */
--teal: #014750;          /* Info tooltip text */
--teal-bg: #D9EAEC;       /* Info tooltip background */
--trustpilot: #00B67A;

/* Grey Scale */
--grey-900: #111B1D;      /* Headings */
--grey-800: #343C3D;      /* Body text */
--grey-600: #757575;      /* Placeholder, borders unselected */
--grey-400: #CCCCCC;      /* Borders disabled */
--grey-300: #E5E5E5;      /* Dividers */
--grey-200: #F0F0F0;      /* Disabled backgrounds */
--grey-100: #FAFAFA;      /* Subtle backgrounds */

/* States */
Selected bg: rgba(142,187,255,0.2) or #E8F1FF
Selected border: #1F1F9C or #00008F
Focus shadow: 0px 0px 0px 3px rgba(0,0,143,0.5)
```

## Typography
```tsx
// Hero (Publico Headline - NOT italic)
className="font-headline text-[32px] font-bold leading-8 text-white"

// Stats numbers (Publico Headline)
className="font-headline text-2xl font-extrabold"

// H1
className="text-2xl font-bold leading-8 text-[#111B1D]"

// H2
className="text-xl font-bold leading-7 text-[#111B1D]"

// Body
className="text-base leading-6 text-[#343C3D]"

// Buttons/Labels (UPPERCASE)
className="text-sm font-semibold uppercase tracking-[1px]"

// Small
className="text-xs leading-4 text-[#757575]"
```

## Component Patterns

### Two Types of Selectable Items

**Form Cards (UPPERCASE, border, rounded):**
```tsx
// Unselected
<button className="w-full flex items-center gap-4 p-1.5 border border-[#757575] bg-white rounded">
  <div className="size-10 rounded bg-[#D9D9D9]" />
  <span className="text-sm font-semibold uppercase tracking-[1px] text-[#343C3D]">SOLO TRIP</span>
</button>

// Selected
<button className="w-full flex items-center gap-4 p-1.5 border border-[#00008F] bg-[#E8F1FF] rounded">
  <div className="size-10 rounded bg-[#94B5E8]" />
  <span className="text-sm font-semibold uppercase tracking-[1px] text-[#00008F]">PARTNER TRIP</span>
</button>
```

**Home Drawer Options (Normal case, no border, rounded-lg):**
```tsx
// Unselected
<button className="w-full flex items-center gap-4 p-1.5 rounded-lg bg-white hover:bg-[#F0F0F0]">
  <div className="size-10 rounded bg-[#E8F1FF]" />
  <span className="text-base leading-6 text-[#343C3D]">Partner trip</span>
</button>

// Selected
<button className="w-full flex items-center gap-4 p-1.5 rounded-lg bg-[rgba(142,187,255,0.2)]">
  <span className="text-base leading-6 text-[#00008F]">Solo trip</span>
</button>
```

### Focus vs Selected States
```tsx
// FOCUS (temporary, on interaction)
focus-visible:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]  // for buttons
focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,143,0.5)]   // for input containers

// SELECTED (persistent, no shadow)
bg-[rgba(142,187,255,0.2)] border-[#1F1F9C]
```

### Page Layout with Sticky Footer
```tsx
<div className="min-h-screen bg-background flex flex-col">
  <Header />
  <ProgressBar />
  <div className="flex-1 px-6 py-6">{/* Content */}</div>
  <div className="sticky bottom-0 px-6 py-4 bg-background border-t">
    <Button fullWidth>CTA</Button>
  </div>
</div>
```

## Imports
```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header, ProgressBar, PlanCard } from "@/components/axa";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
```

## Progressive Form Behavior
- **Number inputs**: Next section appears 1 second after stopping typing (debounce)
- **Buttons (Yes/No)**: Next section appears immediately on click

## Avatar URLs (use real photos)
```tsx
const HELPER_AVATAR = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face";

const TEAM_AVATARS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
];
```

## Do NOT
- Use `opacity-50` for disabled (use exact colors)
- Use `border-2` (use `border` = 1px)
- Put shadow on SELECTED state (shadow = FOCUS only)
- Use Publico Headline in italic
- Use gradient/letter placeholders for avatars
- Use `size-5` or `size-6` for icons in buttons (use `size-4`)
- Run dev/build commands without asking
