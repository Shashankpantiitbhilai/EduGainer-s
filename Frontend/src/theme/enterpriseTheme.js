import { createTheme } from '@mui/material/styles';

// Base colors that work in both light and dark modes - updated with lighter tones
const baseColors = {
  primary: {
    main: "#3b82f6",
    light: "#60a5fa", 
    dark: "#2563eb",
  },
  secondary: {
    main: "#f97316",
    light: "#fb923c",
    dark: "#ea580c",
  },
  success: "#22c55e",
  warning: "#f59e0b", 
  error: "#f87171",
  info: "#06b6d4",
};

// Light theme colors - softer and lighter
const lightColors = {
  ...baseColors,
  primary: {
    main: "#6366f1",
    light: "#818cf8", 
    dark: "#4f46e5",
  },
  secondary: {
    main: "#f97316",
    light: "#fb923c",
    dark: "#ea580c",
  },
  background: {
    default: "#ffffff",
    paper: "#fafbfc",
    subtle: "#f7f8fa",
  },
  text: {
    primary: "#374151",
    secondary: "#6b7280", 
    disabled: "#9ca3af",
    inverse: "#ffffff",
  },
  divider: "#e5e7eb",
  border: "#e5e7eb",
  neutral: {
    50: "#fafbfc",
    100: "#f7f8fa", 
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

// Dark theme colors  
const darkColors = {
  ...baseColors,
  background: {
    default: "#0f172a",
    paper: "#1e293b", 
    subtle: "#334155",
  },
  text: {
    primary: "#f8fafc",
    secondary: "#cbd5e1",
    disabled: "#64748b",
    inverse: "#0f172a",
  },
  divider: "#334155",
  border: "#334155",
  neutral: {
    50: "#0f172a",
    100: "#1e293b",
    200: "#334155",
    300: "#475569",
    400: "#64748b",
    500: "#94a3b8",
    600: "#cbd5e1",
    700: "#e2e8f0",
    800: "#f1f5f9",
    900: "#f8fafc",
  },
};

// Design tokens
export const designTokens = {
  spacing: {
    xs: 4,
    sm: 8, 
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
};

// Export colors object for backward compatibility - updated with lighter colors
export const colors = {
  primary: {
    main: "#6366f1",
    light: "#818cf8", 
    dark: "#4f46e5",
  },
  secondary: {
    main: "#f97316",
    light: "#fb923c",
    dark: "#ea580c",
  },
  accent: {
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#f87171",
    info: "#06b6d4",
  },
  background: {
    default: "#ffffff",
    paper: "#fafbfc",
    subtle: "#f7f8fa",
  },
  text: {
    primary: "#374151",
    secondary: "#6b7280",
    disabled: "#9ca3af",
    inverse: "#ffffff",
  },
  border: {
    light: "#e5e7eb",
    medium: "#d1d5db",
    dark: "#9ca3af",
  },
  neutral: lightColors.neutral,
  shadow: designTokens.shadows,
  gradient: {
    primary: `linear-gradient(135deg, #6366f1 0%, #818cf8 100%)`,
    secondary: `linear-gradient(135deg, #f97316 0%, #fb923c 100%)`,
    success: `linear-gradient(135deg, #22c55e 0%, #4ade80 100%)`,
    error: `linear-gradient(135deg, #f87171 0%, #fca5a5 100%)`,
  },
};

// Create theme function
export const createEnterpriseTheme = (mode = 'light') => {
  const themeColors = mode === 'dark' ? darkColors : lightColors;
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: themeColors.primary.main,
        light: themeColors.primary.light,
        dark: themeColors.primary.dark,
        contrastText: themeColors.text.inverse,
      },
      secondary: {
        main: themeColors.secondary.main,
        light: themeColors.secondary.light, 
        dark: themeColors.secondary.dark,
        contrastText: mode === 'dark' ? themeColors.text.primary : themeColors.text.inverse,
      },
      background: {
        default: themeColors.background.default,
        paper: themeColors.background.paper,
      },
      text: {
        primary: themeColors.text.primary,
        secondary: themeColors.text.secondary,
        disabled: themeColors.text.disabled,
      },
      divider: themeColors.divider,
      success: { main: themeColors.success },
      warning: { main: themeColors.warning },
      error: { main: themeColors.error },
      info: { main: themeColors.info },
    },
    typography: {
      fontFamily: designTokens.typography.fontFamily,
      h1: { 
        fontWeight: designTokens.typography.fontWeight.bold,
        fontSize: designTokens.typography.fontSize["4xl"],
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      h2: { 
        fontWeight: designTokens.typography.fontWeight.bold,
        fontSize: designTokens.typography.fontSize["3xl"],
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      h3: { 
        fontWeight: designTokens.typography.fontWeight.bold,
        fontSize: designTokens.typography.fontSize["2xl"],
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      h4: { 
        fontWeight: designTokens.typography.fontWeight.semibold,
        fontSize: designTokens.typography.fontSize.xl,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      h5: { 
        fontWeight: designTokens.typography.fontWeight.semibold,
        fontSize: designTokens.typography.fontSize.lg,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      h6: { 
        fontWeight: designTokens.typography.fontWeight.semibold,
        fontSize: designTokens.typography.fontSize.base,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      body1: {
        fontSize: designTokens.typography.fontSize.base,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      body2: {
        fontSize: designTokens.typography.fontSize.sm,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
    },
    shape: {
      borderRadius: designTokens.borderRadius.md,
    },
    shadows: [
      'none',
      designTokens.shadows.sm,
      designTokens.shadows.md,
      designTokens.shadows.lg,
      designTokens.shadows.xl,
      ...Array(20).fill(designTokens.shadows.xl),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: themeColors.primary.main,
            boxShadow: designTokens.shadows.md,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: designTokens.typography.fontWeight.medium,
            borderRadius: designTokens.borderRadius.lg,
            transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.xl,
            border: `1px solid ${themeColors.border}`,
            transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
          },
        },
      },
    },
  });
};

// Export theme instances
export const lightTheme = createEnterpriseTheme('light');
export const darkTheme = createEnterpriseTheme('dark');

// Helper function to get colors based on theme mode
export const getColors = (mode = 'light') => mode === 'dark' ? darkColors : lightColors;

// Utility functions for backward compatibility - updated for lighter colors
export const glassMorphism = (opacity = 0.1, mode = 'light') => ({
  background: mode === 'dark' 
    ? `rgba(30, 41, 59, ${opacity})` 
    : `rgba(255, 255, 255, ${opacity + 0.1})`,
  backdropFilter: 'blur(12px)',
  border: mode === 'dark'
    ? `1px solid rgba(203, 213, 225, ${opacity * 1.5})`
    : `1px solid rgba(229, 231, 235, ${opacity * 2})`,
  borderRadius: designTokens.borderRadius.xl,
});

export const hoverScale = (scale = 1.02) => ({
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:hover': {
    transform: `scale(${scale}) translateY(-2px)`,
    cursor: 'pointer',
    boxShadow: designTokens.shadows.md,
  },
});

export const gradientText = (gradient = colors.gradient.primary) => ({
  background: gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: designTokens.typography.fontWeight.semibold,
});

export const fadeIn = (duration = designTokens.animation.duration.normal) => ({
  opacity: 0,
  animation: `fadeIn ${duration} ${designTokens.animation.easing.default} forwards`,
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
});
