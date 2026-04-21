"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "parchment";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  toggle: () => {},
});

function applyThemeAttr(t: Theme) {
  if (typeof document === "undefined") return;
  if (t === "parchment") {
    document.documentElement.setAttribute("data-theme", "parchment");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("luxor-theme") as Theme | null;
    if (saved === "dark" || saved === "parchment") {
      setThemeState(saved);
      applyThemeAttr(saved);
      return;
    }
    // No saved preference — respect prefers-color-scheme
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (prefersLight) {
      setThemeState("parchment");
      applyThemeAttr("parchment");
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyThemeAttr(t);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("luxor-theme", t);
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "parchment" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
