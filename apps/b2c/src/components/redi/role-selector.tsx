"use client"

import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { AuthMenuButtons } from "./auth-menu-buttons"
import { User, Store, TrendingUp } from "lucide-react"
import { Logo } from "./logo"

const roles = [
  { role: "user" as const, icon: User, key: "roleUser", descKey: "roleUserDesc" },
  { role: "merchant" as const, icon: Store, key: "roleMerchant", descKey: "roleMerchantDesc" },
  { role: "investor" as const, icon: TrendingUp, key: "roleInvestor", descKey: "roleInvestorDesc" },
]

export function RoleSelector() {
  const { setRole, setScreen } = useApp()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* theme & language controls */}
      <div className="flex justify-end px-5 py-3">
        <AuthMenuButtons />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-6 pb-12">
        <div className="mb-2">
          <Logo
            srcLight="/images/logo-ligth-tr.png"
            srcDark="/images/logo-dark-tr.png"
            className="w-50 h-30 mx-auto"
          />
        </div>
        <p className="text-muted-foreground text-base mb-10">{t("tagline")}</p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          {roles.map((r) => {
            const Icon = r.icon
            return (
              <button
                key={r.role}
                onClick={() => {
                  setRole(r.role)
                  setScreen("register")
                }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-card-foreground">{t(r.key)}</div>
                  <div className="text-sm text-muted-foreground">{t(r.descKey)}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
