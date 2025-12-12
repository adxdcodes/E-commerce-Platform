import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeName = 
  | 'cyber-dark' 
  | 'cyber-light' 
  | 'ocean-depths' 
  | 'sunset-blaze' 
  | 'forest-mist' 
  | 'royal-purple';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: { name: ThemeName; label: string; preview: { bg: string; primary: string; secondary: string } }[];
}

const themes: ThemeContextType['themes'] = [
  { 
    name: 'cyber-dark', 
    label: 'Cyber Dark', 
    preview: { bg: '#0A0A0F', primary: '#1A9FFF', secondary: '#A259FF' } 
  },
  { 
    name: 'cyber-light', 
    label: 'Cyber Light', 
    preview: { bg: '#F8FAFC', primary: '#0EA5E9', secondary: '#8B5CF6' } 
  },
  { 
    name: 'ocean-depths', 
    label: 'Ocean Depths', 
    preview: { bg: '#0C1222', primary: '#06B6D4', secondary: '#22D3EE' } 
  },
  { 
    name: 'sunset-blaze', 
    label: 'Sunset Blaze', 
    preview: { bg: '#1A0A0A', primary: '#F97316', secondary: '#EF4444' } 
  },
  { 
    name: 'forest-mist', 
    label: 'Forest Mist', 
    preview: { bg: '#0A120A', primary: '#22C55E', secondary: '#84CC16' } 
  },
  { 
    name: 'royal-purple', 
    label: 'Royal Purple', 
    preview: { bg: '#0F0A1A', primary: '#A855F7', secondary: '#EC4899' } 
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as ThemeName) || 'cyber-dark';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    
    // Remove all theme classes
    document.documentElement.classList.remove(
      'theme-cyber-dark',
      'theme-cyber-light',
      'theme-ocean-depths',
      'theme-sunset-blaze',
      'theme-forest-mist',
      'theme-royal-purple'
    );
    
    // Add current theme class
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
