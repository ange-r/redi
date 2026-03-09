"use client"

import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { Home, ArrowLeftRight, CreditCard, User } from "lucide-react"

const userNavItems = [
  { key: "navHome", screen: "user-dashboard", icon: Home },
  { key: "navMovements", screen: "user-movements", icon: ArrowLeftRight },
  { key: "navPayments", screen: "user-payments", icon: CreditCard },
  { key: "navProfile", screen: "user-profile", icon: User },
]

const merchantNavItems = [
  { key: "navHome", screen: "merchant-dashboard", icon: Home },
  { key: "salesDetail", screen: "merchant-sales", icon: ArrowLeftRight },
  { key: "generateQR", screen: "merchant-qr", icon: CreditCard },
  { key: "navProfile", screen: "merchant-profile", icon: User },
]

// new items for investor role
const investorNavItems = [
  { key: "navHome", screen: "investor-view", icon: Home },
  { key: "navProfile", screen: "investor-profile", icon: User },
]

export function BottomNav({ variant = "user" }: { variant?: "user" | "merchant" | "investor" }) {
  const { screen, setScreen } = useApp()
  const { t } = useTranslation()
  const items =
    variant === "user" ? userNavItems
    : variant === "merchant" ? merchantNavItems
    : investorNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-40">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = screen === item.screen
          return (
            <button
              key={item.key}
              onClick={() => setScreen(item.screen)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t(item.key)}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
