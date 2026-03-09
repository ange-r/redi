"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/context/app-context"
import { useTheme } from "next-themes"
import { Sun, Moon, Settings } from "lucide-react"
import { ProfileAvatar } from "./profile-avatar"
import { NotificationBell } from "./notification-bell"
import { Logo } from "./logo"

export function RediHeader({ showNav = false }: { showNav?: boolean }) {
  const { lang, setLang, setScreen, user, merchantUser, role, profileImage, setProfileImage } = useApp()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const currentName = role === "merchant" ? merchantUser.name : user.name
  const profileScreen =
    role === "merchant" ? "merchant-profile" : role === "investor" ? "investor-profile" : "user-profile"

  return (
    <header className="flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-3">
        {showNav ? (
          <button onClick={() => setScreen(profileScreen)} aria-label="Profile">
            <ProfileAvatar name={currentName} imageUrl={profileImage} size="sm" />
          </button>
        ) : (
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="text-xs font-semibold text-muted-foreground border border-border rounded-lg px-2 py-1 hover:bg-secondary transition-colors"
          >
            {lang === "es" ? "ES" : "EN"}
          </button>
        )}
      </div>

      <div>
        {/* use the final light/dark logo files uploaded to public/images */}
        <Logo
          srcLight="/images/logo-ligth-tr.png"
          srcDark="/images/logo-dark-tr.png"
          shape="rect"
          className="w-20 h-20"
        />
      </div>

      <div className="flex items-center gap-1">
        {showNav && (
          <>
            <NotificationBell />
            <button
              onClick={() => setScreen(profileScreen)}
              className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </>
        )}
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
    </header>
  )
}
