import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type ThemeColor = "default" | "red" | "rose" | "orange" | "green" | "blue" | "yellow" | "violet" 

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultThemeColor?: ThemeColor
  storageKey?: string
  storageKeyColor?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
   themeColor: ThemeColor
  setThemeColor: (themeColor: ThemeColor) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  themeColor: "default",
  setThemeColor: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultThemeColor = "default",
  storageKey = "vite-ui-theme",
  storageKeyColor = "vite-ui-theme-color",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [themeColor, setThemeColor] = useState<ThemeColor>(
    () => (localStorage.getItem(storageKey) as ThemeColor) || defaultThemeColor
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    const allThemeClasses = [
     "light", "dark",
     "theme-default", "theme-red", "theme-rose", "theme-orange", 
     "theme-green", "theme-blue", "theme-yellow", "theme-violet"
    ]
     root.classList.remove(...allThemeClasses)

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }
    root.classList.add(theme)
    root.classList.add(`theme-${themeColor}`)
  }, [theme, themeColor])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    themeColor,
    setThemeColor: (themeColor: ThemeColor) => {
      localStorage.setItem(storageKeyColor, themeColor)
      setThemeColor(themeColor)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}