"use client"

import { useState, useEffect, useRef } from "react"
import { useApp } from "@/context/app-context"
import { useTheme } from "next-themes"
import { Menu, Sun, Moon, Globe, X } from "lucide-react"

export function HamburgerMenu() {
  const { lang, setLang } = useApp()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
        aria-label="Menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-52 rounded-2xl bg-card border border-border shadow-xl z-50 p-2">
          {/* Theme toggle */}
          <button
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark")
              setOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-card-foreground"
          >
            {!mounted ? (
              <div className="w-5 h-5" />
            ) : theme === "dark" ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
            <span className="text-sm font-medium">
              {!mounted ? "..." : theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </button>

          {/* Language toggle */}
          <button
            onClick={() => {
              setLang(lang === "es" ? "en" : "es")
              setOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-card-foreground"
          >
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              {lang === "es" ? "English" : "Espanol"}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
