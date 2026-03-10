// Theme configuration
export type ThemeId = 0 | 1 | 2;

export interface ThemeColors {
  // Terminal colors
  terminal: string;
  terminalText: string;
  terminalDim: string;
  terminalAccent: string;
  terminalError: string;
  terminalWarning: string;
  terminalSuccess: string;
  
  // Background gradients
  bgGradientStart: string;
  bgGradientMid1: string;
  bgGradientMid2: string;
  bgGradientMid3: string;
  bgGradientEnd: string;
  
  // Terminal window
  terminalWindowBg: string;
  terminalWindowBorder: string;
  terminalWindowShadow: string;
  
  // Terminal header
  terminalHeaderBg: string;
  terminalHeaderBgGradient: string; // Full gradient string for header
  terminalHeaderBorder: string;
  
  // Accent colors for links and highlights
  accentColor: string;
  accentHover: string;
  accentGlow: string;
  accentGlow30: string; // 30% opacity variant
  accentGlow80: string; // 80% opacity variant
  accentHoverGlow60: string; // 60% opacity variant
  
  // Shadow variants
  windowShadow15: string; // 15% opacity variant
  windowShadow5: string; // 5% opacity variant
  
  // Snow effect (only for winter theme)
  showSnow: boolean;
}

export const themes: Record<ThemeId, ThemeColors> = {
  // Theme 0: Neutral (Green theme - original)
  0: {
    terminal: '#0D1117',
    terminalText: '#4AF626',
    terminalDim: '#2EA043',
    terminalAccent: '#58A6FF',
    terminalError: '#F85149',
    terminalWarning: '#F0883E',
    terminalSuccess: '#3FB950',
    bgGradientStart: '#0a0e14',
    bgGradientMid1: '#0D1117',
    bgGradientMid2: '#0f1620',
    bgGradientMid3: '#0a0f18',
    bgGradientEnd: '#0a0e14',
    terminalWindowBg: '#0D1117',
    terminalWindowBorder: 'rgba(74, 246, 38, 0.3)',
    terminalWindowShadow: 'rgba(74, 246, 38, 0.2)',
    terminalHeaderBg: 'rgba(46, 160, 67, 0.15)',
    terminalHeaderBgGradient: 'linear-gradient(90deg, rgba(46, 160, 67, 0.15) 0%, rgba(74, 246, 38, 0.2) 50%, rgba(46, 160, 67, 0.15) 100%)',
    terminalHeaderBorder: 'rgba(74, 246, 38, 0.3)',
    accentColor: '#4AF626',
    accentHover: '#5AFF36',
    accentGlow: 'rgba(74, 246, 38, 0.5)',
    accentGlow30: 'rgba(74, 246, 38, 0.3)',
    accentGlow80: 'rgba(74, 246, 38, 0.8)',
    accentHoverGlow60: 'rgba(90, 255, 54, 0.6)',
    windowShadow15: 'rgba(74, 246, 38, 0.15)',
    windowShadow5: 'rgba(74, 246, 38, 0.05)',
    showSnow: false,
  },
  
  // Theme 1: Winter (white and blue theme)
  1: {
    terminal: '#0D1117',
    terminalText: '#E6F3FF', // Very light blue/white
    terminalDim: '#B3D9FF', // Light blue
    terminalAccent: '#87CEEB', // Sky blue
    terminalError: '#F85149',
    terminalWarning: '#FFB347',
    terminalSuccess: '#4FC3F7', // Light blue (no green)
    bgGradientStart: '#0a0e14',
    bgGradientMid1: '#0D1117',
    bgGradientMid2: '#0f1620',
    bgGradientMid3: '#0a0f18',
    bgGradientEnd: '#0a0e14',
    terminalWindowBg: '#0D1117',
    terminalWindowBorder: 'rgba(179, 217, 255, 0.3)', // Light blue border
    terminalWindowShadow: 'rgba(135, 206, 235, 0.4)',
    terminalHeaderBg: 'rgba(135, 206, 235, 0.15)',
    terminalHeaderBgGradient: 'linear-gradient(90deg, rgba(135, 206, 235, 0.15) 0%, rgba(179, 217, 255, 0.2) 50%, rgba(135, 206, 235, 0.15) 100%)',
    terminalHeaderBorder: 'rgba(179, 217, 255, 0.3)',
    accentColor: '#B3D9FF', // Light blue accent
    accentHover: '#E6F3FF', // Very light blue/white on hover
    accentGlow: 'rgba(179, 217, 255, 0.5)',
    accentGlow30: 'rgba(179, 217, 255, 0.3)',
    accentGlow80: 'rgba(179, 217, 255, 0.8)',
    accentHoverGlow60: 'rgba(230, 243, 255, 0.6)',
    windowShadow15: 'rgba(135, 206, 235, 0.15)',
    windowShadow5: 'rgba(135, 206, 235, 0.05)',
    showSnow: true,
  },
  
  // Theme 2: Summer (Green theme - original)
// Theme 2: Sunny Beach Day (Peach Sky → Blue Ocean → Sand)
2: {
  terminal: '#1E293B',

  // Text
  terminalText: '#1E293B',
  terminalDim: '#475569',
  terminalAccent: '#FB923C',   // soft beach orange

  // Status
  terminalError: '#F43F5E',
  terminalWarning: '#FACC15',
  terminalSuccess: '#38BDF8',  // ocean blue

  // Background: TOP = sky, MID = ocean, BOTTOM = sand
  bgGradientStart: '#FFE8D6',   // peach sky
  bgGradientMid1: '#D6F0FF',    // baby blue ocean
  bgGradientMid2: '#B3E5FF',    // deeper water blue
  bgGradientMid3: '#FFF3C4',    // warm sand
  bgGradientEnd: '#FFF8E7',     // beach cream

  // Cards
  terminalWindowBg: 'rgba(255,255,255,0.9)',
  terminalWindowBorder: 'rgba(251,146,60,0.35)',
  terminalWindowShadow: 'rgba(251,146,60,0.2)',

  // Header
  terminalHeaderBg: 'rgba(255,243,196,0.85)',
  terminalHeaderBgGradient:
    'linear-gradient(90deg, rgba(255,243,196,0.85) 0%, rgba(251,146,60,0.4) 50%, rgba(255,243,196,0.85) 100%)',
  terminalHeaderBorder: 'rgba(251,146,60,0.45)',

  // Accent
  accentColor: '#FB923C',
  accentHover: '#1E293B',

  accentGlow: 'rgba(251,146,60,0.5)',
  accentGlow30: 'rgba(251,146,60,0.3)',
  accentGlow80: 'rgba(251,146,60,0.75)',
  accentHoverGlow60: 'rgba(30,41,59,0.2)',

  // Shadows
  windowShadow15: 'rgba(251,146,60,0.15)',
  windowShadow5: 'rgba(251,146,60,0.08)',

  showSnow: false,
},


};

export const getTheme = (): ThemeId => {
  const themeEnv = import.meta.env.VITE_THEME;
  const themeId = themeEnv ? parseInt(themeEnv, 10) : 1; // Default to winter theme (1)
  
  // Validate theme ID
  if (themeId === 0 || themeId === 1 || themeId === 2) {
    return themeId as ThemeId;
  }
  
  // Fallback to winter theme if invalid
  return 1;
};

