"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { AuthMenuButtons } from "./auth-menu-buttons"

export function UserRegister() {
  const { role, setUser, setMerchantUser, setInvestorUser, setScreen } = useApp()
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    const userData = { name: name || "Usuario", email }

    if (role === "merchant") {
      setMerchantUser(userData)
      setScreen("merchant-welcome")
    } else if (role === "investor") {
      setInvestorUser(userData)
      setScreen("investor-welcome")
    } else {
      setUser(userData)
      setScreen("user-welcome")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* theme & language controls */}
      <div className="flex justify-end px-5 py-3">
        <AuthMenuButtons />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-6 pb-12">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-balance text-center">
          {t("createAccount")}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-sm">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground px-1">
              {t("nickname")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("nicknamePlaceholder")}
              className="w-full px-4 py-3.5 rounded-2xl border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground px-1">
              {t("email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full px-4 py-3.5 rounded-2xl border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity mt-2"
          >
            {t("continue")}
          </button>
          <p className="text-xs text-muted-foreground text-center mt-1">
            {t("walletAuto")}
          </p>
        </form>
      </div>
    </div>
  )
}
