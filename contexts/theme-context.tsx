"use client"

import type React from "react"
import { createContext } from "react"

interface ThemeContextType {
  theme: "light"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ theme: "light" }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return { theme: "light" }
}
