/**
 * CF Handlooms Admin Design System - Unified Theme Tokens & Reusable Tailwind Utilities
 * Matches the official brand design system of Ecommerce - Website:
 * - Primary Emblem Gold: #F5B815
 * - Highlight Gold: #FEE63E
 * - Deep Amber Gold: #B87802
 * - Medallion Onyx Black: #0C0A07
 * - Foreground Text: #12100D
 * - Warm Ivory Neutral Background: #FAF8F2
 * - Champagne Neutral: #F3EBDD / #F2EBE0
 * - Border Neutral: #E8D8B5
 * - Destructive: #B3261E
 */

export const theme = {
  // 1. Color Palette Tokens based on the Logo & Website
  colors: {
    // Extracted Logo Raw Values
    logoGold: "#F5B815",
    logoGoldBright: "#FEE63E",
    logoGoldDeep: "#B87802",
    logoOnyx: "#0C0A07",
    logoIvory: "#FAF8F2",
    logoChampagne: "#F3EBDD",

    // Semantic Mapping
    primary: "var(--primary)", // Deep Amber Gold (#B87802)
    primaryForeground: "var(--primary-foreground)", // White (#FFFFFF)
    secondary: "var(--secondary)", // Warm Champagne (#F3EBDD)
    secondaryForeground: "var(--secondary-foreground)",
    accent: "var(--gold)", // Royal Gold (#F5B815)
    accentForeground: "var(--gold-foreground)", // Onyx (#0C0A07)
    background: "var(--background)", // Warm Ivory (#FAF8F2)
    surface: "var(--card)", // White (#FFFFFF)
    textPrimary: "var(--foreground)", // Onyx Charcoal (#12100D)
    textSecondary: "var(--muted-foreground)", // Muted Warm Charcoal (#6B6457)
    border: "var(--border)", // Soft Gold-Cream (#E8D8B5)
    ring: "var(--ring)", // Royal Gold (#F5B815)
    buttonPrimary: "#0C0A07", // Medallion Onyx
    buttonHover: "#F5B815", // Royal Gold
    active: "#B87802",
    focus: "#F5B815",

    // Theme references
    gold: "var(--gold)",
    goldLight: "var(--gold-light)",
    goldDeep: "var(--gold-deep)",
    onyx: "var(--onyx)",
    onyxDeep: "var(--onyx-deep)",
    ivory: "var(--ivory)",
    beige: "var(--beige)",

    // Compatibility aliases
    maroon: "var(--maroon)",
    maroonDeep: "var(--maroon-deep)",

    // Status colors (Exact website definitions)
    status: {
      success: "text-emerald-800 bg-emerald-50 border-emerald-200",
      warning: "text-amber-800 bg-amber-50 border-amber-200",
      error: "text-rose-800 bg-rose-50 border-rose-200",
      info: "text-sky-800 bg-sky-50 border-sky-200",
    },
  },

  // 2. Typography Styles
  typography: {
    fontDisplay: "font-display",
    fontBody: "font-body",
    fontCursive: "font-cursive",

    // Cursive flourishes & subtitles
    cursiveEyebrow: "font-cursive text-2xl text-[#B87802]",
    cursiveBanner: "font-cursive text-3xl text-gold sm:text-4xl",
    cursiveBrand: "font-cursive text-3xl leading-none text-[#0C0A07]",

    // Headings
    h1Page: "font-display text-4xl font-semibold text-foreground",
    h1Hero:
      "font-display text-4xl leading-tight font-semibold text-primary-foreground sm:text-6xl",
    h2Section:
      "font-display text-3xl font-semibold text-foreground sm:text-4xl",
    h2Banner:
      "font-display text-4xl font-semibold text-primary-foreground sm:text-5xl",
    h3Card: "font-display text-xl font-semibold text-foreground",
    h3Sidebar:
      "text-xs font-semibold tracking-[0.2em] uppercase text-foreground",

    // Meta & details
    metaFabric: "text-[11px] tracking-[0.2em] uppercase text-muted-foreground",
    metaMuted: "text-xs tracking-widest uppercase text-muted-foreground",
    metaSku: "text-xs tracking-[0.25em] uppercase text-muted-foreground",
    priceBig: "text-3xl font-semibold text-[#B87802]",
    priceStrike: "text-lg text-muted-foreground line-through",
    bodyMuted: "text-sm text-muted-foreground",
    bodyBase: "text-sm leading-relaxed text-foreground/80",
  },

  // 3. Spacing, Radius & Shadows
  spacing: {
    sectionPadding: "py-20",
    pagePadding: "py-10",
    cardPadding: "p-6",
    containerGap: "gap-8",
  },

  borderRadius: {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  },

  shadows: {
    subtle: "shadow-sm",
    card: "shadow",
    hover: "hover:shadow-lg transition-shadow",
    glowGold:
      "shadow-[0_16px_40px_-16px_rgba(184,120,2,0.25)]",
    glowMaroon:
      "shadow-[0_16px_40px_-16px_rgba(184,120,2,0.25)]",
  },

  // 4. Layouts & Section Containers
  layout: {
    pageContainer: "mx-auto max-w-7xl px-4 py-10",
    sectionContainer: "mx-auto max-w-7xl px-4 py-20",
    narrowContainer: "mx-auto max-w-2xl px-4 py-20 text-center",
    emptyState: "mx-auto max-w-2xl px-4 py-24 text-center",

    // Flexbox & Grid helpers
    flexCenter: "flex items-center justify-center",
    flexBetween: "flex items-center justify-between",
    gridCenter: "grid place-items-center",

    // Reusable Grids
    grid4Cols: "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4",
    grid3Cols: "grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3",
    gridFeatures: "grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
  },

  // 5. Buttons & Interactive Controls (Modern Luxury Feel)
  buttons: {
    primary:
      "inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 px-8 py-3.5 text-sm font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:from-[#C98704] hover:to-[#A86E02] hover:shadow-lg hover:shadow-[#B87802]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer text-center shadow-md",
    primaryWide:
      "w-full inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 py-3.5 text-sm font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:from-[#C98704] hover:to-[#A86E02] hover:shadow-lg hover:shadow-[#B87802]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer text-center shadow-md",
    gold:
      "inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 px-8 py-3.5 text-sm font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:from-[#C98704] hover:to-[#A86E02] hover:shadow-lg hover:shadow-[#B87802]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer text-center shadow-md",
    outlineMaroon:
      "inline-flex items-center justify-center rounded-md border border-[#B87802] px-8 py-3 text-sm font-medium tracking-[0.08em] uppercase text-[#B87802] bg-transparent transition-all duration-200 hover:bg-[#B87802] hover:text-white hover:shadow-md hover:shadow-[#B87802]/25 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer text-center",
    outline:
      "inline-flex items-center justify-center rounded-md border border-[#B87802] px-8 py-3 text-sm font-medium tracking-[0.08em] uppercase text-[#B87802] bg-transparent transition-all duration-200 hover:bg-[#B87802] hover:text-white hover:shadow-md hover:shadow-[#B87802]/25 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer text-center",
    outlineLight:
      "inline-flex items-center justify-center rounded-md border border-white/60 bg-white/10 backdrop-blur-sm px-8 py-3.5 text-sm font-medium tracking-[0.08em] uppercase text-white transition-all duration-200 hover:bg-white hover:text-[#0C0A07] hover:border-white hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer text-center",
    actionCard:
      "flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 py-2.5 text-xs font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:from-[#C98704] hover:to-[#A86E02] hover:shadow-lg hover:shadow-[#B87802]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-md",
    actionDark:
      "flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 py-2.5 text-xs font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:from-[#C98704] hover:to-[#A86E02] hover:shadow-lg hover:shadow-[#B87802]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-md",
    iconRound:
      "grid place-items-center rounded-full bg-card/90 shadow-md backdrop-blur-sm transition-all duration-200 cursor-pointer hover:bg-[#F5B815] hover:text-[#0C0A07] hover:scale-110",
    secondarySm:
      "rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-[#B87802] hover:text-[#B87802] hover:shadow-sm active:scale-[0.98] cursor-pointer",
  },

  // 6. Form Elements
  forms: {
    input:
      "w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]",
    inputError:
      "w-full rounded-sm border border-destructive bg-card px-3 py-2.5 text-sm outline-none focus:border-destructive",
    textarea:
      "w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]",
    textareaError:
      "w-full rounded-sm border border-destructive bg-card px-3 py-2.5 text-sm outline-none focus:border-destructive",
    select:
      "appearance-none rounded-sm border border-border bg-card py-2 pr-9 pl-4 text-sm outline-none focus:border-[#B87802] cursor-pointer",
    radio: "accent-[#B87802] cursor-pointer",
    checkbox: "accent-[#B87802] cursor-pointer",
    label: "text-xs font-semibold tracking-[0.15em] uppercase text-foreground",
    errorText: "mt-1 text-xs text-destructive",
  },

  // 7. Cards, Modals & Tables
  cards: {
    base: "rounded-lg border border-border bg-card",
    padded: "rounded-lg border border-border bg-card p-6",
    interactive:
      "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-300 hover:shadow-[0_16px_40px_-16px_rgba(184,120,2,0.25)]",
    feature:
      "rounded-lg border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg hover:border-[#E8D8B5]",
  },
  modal: {
    backdrop: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
    container:
      "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-xl",
    title: "font-display text-2xl font-semibold text-foreground",
    description: "text-sm text-muted-foreground",
  },
  table: {
    container: "w-full overflow-x-auto",
    table: "w-full text-left text-sm",
    th: "border-b border-border py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
    td: "border-b border-border py-3 px-4 text-sm text-foreground",
    trHover: "transition-colors hover:bg-secondary/40",
  },

  // 8. Badges & Chips (Matching Logo Onyx & Gold)
  badges: {
    discount:
      "rounded-sm bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30 px-2 py-1 text-[11px] font-semibold tracking-wide",
    newArrival:
      "rounded-sm bg-[#F5B815] text-[#0C0A07] px-2 py-1 text-[11px] font-bold tracking-wide shadow-sm",
    outOfStock:
      "absolute inset-x-0 bottom-0 bg-[#0C0A07]/80 py-2 text-center text-xs tracking-widest text-[#FAF8F2] uppercase",
    counterMaroon:
      "absolute -top-2 -right-2 grid h-4 w-4 place-items-center rounded-full bg-[#F5B815] text-[10px] font-bold text-[#0C0A07] shadow",
    counterGold:
      "absolute -top-2 -right-2 grid h-4 w-4 place-items-center rounded-full bg-[#F5B815] text-[10px] font-bold text-[#0C0A07] shadow",
    filterChipActive:
      "rounded-full border border-[#0C0A07] bg-[#0C0A07] text-[#F5B815] px-3 py-1 text-xs font-medium transition-colors cursor-pointer shadow-sm",
    filterChipInactive:
      "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-[#B87802] hover:text-[#B87802] transition-colors cursor-pointer",
  },

  // 9. Dividers
  dividers: {
    gold: "divider-gold w-24",
    goldCentered: "divider-gold mx-auto mt-4 w-24",
    goldLeft: "divider-gold mt-3 w-24",
  },
};

export default theme;
