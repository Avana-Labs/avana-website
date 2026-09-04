"use client"

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"
import { THEME_STORAGE_KEY } from "@/lib/theme"

export type ThemePreference = "light" | "dark" | "system"

type ThemeContextValue = {
  theme?: string
  setTheme: Dispatch<SetStateAction<string>>
  resolvedTheme?: string
  systemTheme?: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextValue>({
  setTheme: () => {},
})

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system"

  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    if (value === "light" || value === "dark" || value === "system") return value
  } catch {}

  return "system"
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolveTheme(theme: ThemePreference): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme
}

let themeTransitionLock: HTMLStyleElement | null = null
let themeTransitionUnlock: number | null = null

function disableThemeTransitions() {
  if (typeof document === "undefined") return

  if (!themeTransitionLock) {
    themeTransitionLock = document.createElement("style")
    themeTransitionLock.setAttribute("data-avana-theme-lock", "")
    themeTransitionLock.appendChild(
      document.createTextNode("*,*::before,*::after{transition:none!important}"),
    )
  }

  if (!themeTransitionLock.isConnected) {
    document.head.appendChild(themeTransitionLock)
  }

  if (themeTransitionUnlock !== null) {
    window.cancelAnimationFrame(themeTransitionUnlock)
  }

  themeTransitionUnlock = window.requestAnimationFrame(() => {
    themeTransitionUnlock = window.requestAnimationFrame(() => {
      themeTransitionLock?.remove()
      themeTransitionUnlock = null
    })
  })
}

function applyResolvedTheme(resolved: "light" | "dark") {
  const root = document.documentElement
  const isDark = resolved === "dark"

  if (root.classList.contains("dark") === isDark) return

  disableThemeTransitions()
  root.classList.toggle("dark", isDark)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() =>
    typeof window === "undefined" ? "system" : readStoredTheme(),
  )
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
    typeof window === "undefined" ? "light" : getSystemTheme(),
  )

  if (typeof document !== "undefined") {
    applyResolvedTheme(resolveTheme(theme))
  }

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onSystemChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light")
    }

    media.addEventListener("change", onSystemChange)
    return () => media.removeEventListener("change", onSystemChange)
  }, [])

  useLayoutEffect(() => {
    const sync = () => applyResolvedTheme(resolveTheme(theme))
    sync()

    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [theme, systemTheme])

  const setTheme = useCallback<Dispatch<SetStateAction<string>>>((value) => {
    setThemeState((current) => {
      const next =
        typeof value === "function"
          ? (value(current) as ThemePreference)
          : (value as ThemePreference)
      const normalized: ThemePreference =
        next === "light" || next === "dark" || next === "system" ? next : current

      try {
        localStorage.setItem(THEME_STORAGE_KEY, normalized)
      } catch {}

      applyResolvedTheme(resolveTheme(normalized))
      return normalized
    })
  }, [])

  const resolvedTheme = theme === "system" ? systemTheme : theme

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
    }),
    [theme, setTheme, resolvedTheme, systemTheme],
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

export function readResolvedThemeFromDocument(): "light" | "dark" {
  if (typeof document === "undefined") return "light"
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}
