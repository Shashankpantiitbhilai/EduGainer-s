import {
  WatchLater,
  AcUnit as AcUnitIcon,
  Wifi,
  PowerSettingsNew,
  Weekend,
  MenuBook,
  School,
  EmojiEvents,
  Psychology,
  LocalLibrary,
  Flag,
} from "@mui/icons-material";

export const colors = {
  // Primary brand colors - Modern enterprise palette
  primary: {
    main: "#1e3a8a", // Deep professional blue
    light: "#3b82f6", // Lighter blue for hover states
    dark: "#1e40af", // Darker blue for depth
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
  },
  secondary: {
    main: "#f59e0b", // Professional amber/gold
    light: "#fbbf24", // Lighter amber
    dark: "#d97706", // Darker amber
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
  },
  accent: {
    success: "#10b981", // Modern green for success states
    warning: "#f59e0b", // Amber for warnings
    error: "#ef4444", // Modern red for errors
    info: "#3b82f6", // Blue for info
  },
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  text: {
    primary: "#0f172a", // Dark slate for primary text
    secondary: "#475569", // Medium slate for secondary text
    muted: "#64748b", // Light slate for muted text
    inverse: "#ffffff", // White text for dark backgrounds
  },
  background: {
    default: "#ffffff", // Clean white background
    paper: "#f8fafc", // Very light gray for cards
    subtle: "#f1f5f9", // Subtle background for sections
    dark: "#0f172a", // Dark background option
  },
  border: {
    light: "#e2e8f0",
    medium: "#cbd5e1",
    dark: "#94a3b8",
  },
  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  }
};

// Design tokens for consistent spacing and typography
export const designTokens = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
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
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};

export const libraryFacilities = [
  { icon: <WatchLater />, text: "24/7 Accessibility" },
  { icon: <AcUnitIcon />, text: "Temperature Control (Fans, AC, Heater)" },
  { icon: <Wifi />, text: "High-Speed WiFi" },
  { icon: <Weekend />, text: "Comfortable Seating" },
  { icon: <PowerSettingsNew />, text: "Individual Power Stations" },
  { icon: <MenuBook />, text: "Extensive Study Materials" },
];

export const classesOffered = [
  { icon: <School />, text: "NEET & JEE Preparation" },
  { icon: <MenuBook />, text: "Board Exams Excellence" },
  { icon: <EmojiEvents />, text: "SSC CGL Mastery" },
  { icon: <Flag />, text: "Uttarakhand LT Exam" },
  { icon: <Psychology />, text: "Group C Government Exams" },
  { icon: <LocalLibrary />, text: "General Competitive Exams" },
];
