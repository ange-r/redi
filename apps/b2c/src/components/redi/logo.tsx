"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
  src?: string // fallback when no theme-specific image provided
  srcLight?: string
  srcDark?: string
  alt?: string
  className?: string
  /**
   * shape of the container; circle by default for older usages
   */
  shape?: "circle" | "rect"
}

export function Logo({ src, srcLight, srcDark, alt, className = "", shape = "circle" }: LogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  let displaySrc = src
  if (mounted) {
    if (theme === "dark" && srcDark) {
      displaySrc = srcDark
    } else if (theme === "light" && srcLight) {
      displaySrc = srcLight
    }
  }

  return (
    <div
      className={`${
        shape === "rect" ? "rounded-none" : "rounded-full"
      } bg-transparent overflow-hidden ${className}`.trim()}
    >
      {displaySrc ? (
        <img
          src={displaySrc}
          alt={alt || "logo"}
          className="w-full h-full object-contain"
        />
      ) : null}
    </div>
  )
}
