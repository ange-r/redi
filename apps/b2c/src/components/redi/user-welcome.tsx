"use client"

import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { AuthMenuButtons } from "./auth-menu-buttons"
import { CheckCircle } from "lucide-react"
import { Logo } from "./logo"

export function UserWelcome() {
  const { user, setScreen } = useApp()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* theme & language controls */}
      <div className="flex justify-end px-5 py-3">
        <AuthMenuButtons />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-6 pb-12">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-accent" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground text-center text-balance mb-2">
          {t("welcomeTitle")}, {user.name}!
        </h1>
        <p className="text-muted-foreground text-center mb-10">{t("welcomeMsg")}</p>

        <button
          onClick={() => setScreen("user-dashboard")}
          className="w-full max-w-sm py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
        >
          {t("goToReserve")}
        </button>
      </div>

      {/* Logo at bottom only */}
      <div className="pb-8 text-center">
        <Logo
          srcLight="/images/logo-ligth-tr.png"
          srcDark="/images/logo-dark-tr.png"
          className="inline-block w-30 h-15"
        />
      </div>
    </div>
  )
}
