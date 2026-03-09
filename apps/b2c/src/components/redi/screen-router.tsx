"use client"

import { useApp } from "@/context/app-context"
import { RediHeader } from "./header"
import { RoleSelector } from "./role-selector"
import { UserRegister } from "./user-register"
import { UserWelcome } from "./user-welcome"
import { UserDashboard } from "./user-dashboard"
import { UserDeposit } from "./user-deposit"
import { UserPayments } from "./user-payments"
import { UserConfirm } from "./user-confirm"
import { UserProfile } from "./user-profile"
import { MerchantWelcome } from "./merchant-welcome"
import { MerchantDashboard } from "./merchant-dashboard"
import { MerchantQR } from "./merchant-qr"
import { MerchantProfile } from "./merchant-profile"
import { InvestorWelcome } from "./investor-welcome"
import { InvestorView } from "./investor-view"
import { InvestorProfile } from "./investor-profile"
import { BottomNav } from "./bottom-nav"
import { useTranslation } from "@/hooks/use-translation"
import { UserWithdraw } from "./user-withdraw"

function UserMovements() {
  const { transactions } = useApp()
  const { t } = useTranslation()
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <RediHeader showNav />
      <div className="px-5">
        <h1 className="text-2xl font-bold text-foreground mb-5">{t("navMovements")}</h1>
        {transactions.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border p-6 text-center text-muted-foreground text-sm">
            {t("noPurchases")}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {[...transactions].reverse().map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-2xl bg-card border border-border p-4">
                <div>
                  <div className="font-medium text-card-foreground">{tx.merchantName}</div>
                  <div className="text-xs text-muted-foreground">{tx.installments}x &middot; {tx.date}</div>
                </div>
                <span className="font-semibold text-card-foreground">
                  ${new Intl.NumberFormat("es-AR").format(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav variant="user" />
    </div>
  )
}

function MerchantSalesDetail() {
  const { merchantSales } = useApp()
  const { t } = useTranslation()

  const totalSettled = merchantSales.filter(s => s.status === "settled").reduce((sum, s) => sum + s.amount, 0)
  const totalPending = merchantSales.filter(s => s.status === "pending" || s.status === "approved").reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <RediHeader showNav />
      <div className="px-5">
        <h1 className="text-2xl font-bold text-foreground mb-5">{t("salesDetail")}</h1>
        <div className="flex gap-3 mb-5">
          <div className="flex-1 rounded-2xl bg-card border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">{t("totalSettled")}</p>
            <p className="text-lg font-bold text-primary">${new Intl.NumberFormat("es-AR").format(totalSettled)}</p>
          </div>
          <div className="flex-1 rounded-2xl bg-card border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">{t("totalPending")}</p>
            <p className="text-lg font-bold text-amber-400">${new Intl.NumberFormat("es-AR").format(totalPending)}</p>
          </div>
        </div>
        {merchantSales.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border p-6 text-center text-muted-foreground text-sm">
            {t("noSales")}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {merchantSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between rounded-2xl bg-card border border-border p-4">
                <div>
                  <div className="font-medium text-card-foreground">{sale.description || "Venta"}</div>
                  <div className="text-xs text-muted-foreground">{sale.installments}x &middot; {sale.date}</div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-card-foreground">${new Intl.NumberFormat("es-AR").format(sale.amount)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    sale.status === "approved" ? "bg-success/20 text-success"
                    : sale.status === "pending" ? "bg-amber-400/20 text-amber-400"
                    : "bg-primary/20 text-primary"
                  }`}>
                    {sale.status === "approved" ? t("approved") : sale.status === "pending" ? t("pendingStatus") : t("settledStatus")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav variant="merchant" />
    </div>
  )
}

// Auth screens have no header (only hamburger inside them)
const authScreens = new Set([
  "role-selector",
  "register",
  "user-welcome",
  "merchant-welcome",
  "investor-welcome",
])

const screens: Record<string, React.ComponentType> = {
  "role-selector": RoleSelector,
  "register": UserRegister,
  "user-welcome": UserWelcome,
  "user-dashboard": UserDashboard,
  "user-deposit": UserDeposit,
  "user-payments": UserPayments,
  "user-confirm": UserConfirm,
  "user-profile": UserProfile,
  "user-movements": UserMovements,
  "merchant-welcome": MerchantWelcome,
  "merchant-dashboard": MerchantDashboard,
  "merchant-qr": MerchantQR,
  "merchant-sales": MerchantSalesDetail,
  "merchant-profile": MerchantProfile,
  "investor-welcome": InvestorWelcome,
  "investor-view": InvestorView,
  "investor-profile": InvestorProfile,
  "user-withdraw": UserWithdraw,
}

export function ScreenRouter() {
  const { screen } = useApp()
  const CurrentScreen = screens[screen] || RoleSelector

  // Auth / onboarding screens manage their own layout (hamburger menu only)
  if (authScreens.has(screen)) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-background relative">
        <CurrentScreen />
      </div>
    )
  }

  // All other screens manage their own header + bottom nav internally
  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative">
      <CurrentScreen />
    </div>
  )
}
