'use client';

import * as React from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme | string) => void;
};

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

function readStoredTheme(defaultTheme: Theme): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  return defaultTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  /** Kept for API compatibility with next-themes usage sites */
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);

  React.useEffect(() => {
    const initial = readStoredTheme(defaultTheme);
    setThemeState(initial);
    applyTheme(initial);
  }, [defaultTheme]);

  const setTheme = React.useCallback((next: Theme | string) => {
    const value: Theme = next === 'light' ? 'light' : 'dark';
    setThemeState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    applyTheme(value);
  }, []);

  const value = React.useMemo(
    () => ({ theme, resolvedTheme: theme, setTheme }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  return {
    theme: ctx.theme,
    resolvedTheme: ctx.resolvedTheme,
    setTheme: ctx.setTheme,
    systemTheme: undefined as Theme | undefined,
    themes: ['light', 'dark'] as const,
  };
}
