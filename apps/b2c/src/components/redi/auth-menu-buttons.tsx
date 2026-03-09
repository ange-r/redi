"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/context/app-context"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function AuthMenuButtons() {
  const { lang, setLang } = useApp()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang(lang === "es" ? "en" : "es")}
        className="text-xs font-semibold text-muted-foreground border border-border rounded-lg px-2 py-1 hover:bg-secondary transition-colors"
      >
        {lang === "es" ? "ES" : "EN"}
      </button>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
        aria-label="Toggle theme"
      >
        {!mounted ? (
          <div className="w-5 h-5" />
        ) : theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}
