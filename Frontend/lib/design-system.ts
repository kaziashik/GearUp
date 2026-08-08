/**
 * GearUp Design System Configuration
 * 3-Color Palette + Neutral Gray
 */

export const designSystem = {
  colors: {
    // Primary: Teal (brand, CTAs, links)
    primary: {
      light: "hsl(160 84% 39%)",
      DEFAULT: "hsl(160 70% 45%)",
      dark: "hsl(160 60% 35%)",
    },
    // Secondary: Orange (accents, highlights)
    secondary: {
      light: "hsl(24 95% 60%)",
      DEFAULT: "hsl(24 95% 53%)",
      dark: "hsl(24 95% 45%)",
    },
    // Accent: Blue (info, secondary actions)
    accent: {
      light: "hsl(199 89% 55%)",
      DEFAULT: "hsl(199 89% 48%)",
      dark: "hsl(199 89% 40%)",
    },
    // Neutral: Gray scale
    neutral: {
      50: "hsl(210 40% 98%)",
      100: "hsl(214 32% 91%)",
      200: "hsl(213 27% 84%)",
      300: "hsl(211 25% 73%)",
      400: "hsl(214 20% 59%)",
      500: "hsl(215 16% 47%)",
      600: "hsl(215 19% 35%)",
      700: "hsl(215 25% 27%)",
      800: "hsl(217 33% 17%)",
      900: "hsl(222 47% 11%)",
    },
  },

  spacing: {
    section: "80px",
    container: "1280px",
    cardGap: "24px",
  },

  borderRadius: {
    card: "12px",
    button: "8px",
    input: "8px",
  },

  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export const cardStyles = {
  base: "rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1",
  padding: "p-4",
  aspectRatio: "aspect-[4/3]",
} as const;

export const buttonStyles = {
  primary: "bg-primary hover:bg-primary/90 text-white",
  secondary: "bg-secondary hover:bg-secondary/90 text-white",
  accent: "bg-accent hover:bg-accent/90 text-white",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
} as const;
