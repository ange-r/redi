"use client"

import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { RediHeader } from "./header"
import { BottomNav } from "./bottom-nav"
import { ProfileAvatar } from "./profile-avatar"
import { Plus, Minus, ShieldCheck } from "lucide-react"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

export function UserDashboard() {
  const { user, balance, installmentPlans, transactions, setScreen, profileImage } = useApp()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <RediHeader showNav />

      <div className="px-5">
        <div className="flex items-center gap-3 mb-4">
          <ProfileAvatar name={user.name} imageUrl={profileImage} size="md" />
          <h1 className="text-2xl font-bold text-foreground">
            {t("greeting")}, {user.name}
          </h1>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/80 to-primary p-6 mb-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-8 translate-x-8" />
          <p className="text-sm font-medium text-primary-foreground/70 mb-1">{t("yourReserve")}</p>
          <p className="text-4xl font-bold text-primary-foreground mb-3">
            {formatCurrency(balance.available)}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-primary-foreground/60">
              <ShieldCheck className="w-4 h-4" />
              {t("protected")}: {formatCurrency(balance.protected)}
            </div>
            {balance.yieldEarned > 0 && (
              <div className="text-sm text-success font-medium">
                +{formatCurrency(balance.yieldEarned)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setScreen("user-deposit")}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            {t("deposit")}
          </button>
          <button
            disabled={balance.available === 0}
            onClick={() => setScreen("user-withdraw")}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-accent text-accent font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/10 transition-colors"
          >
          <Minus className="w-5 h-5" />
            {t("withdraw")}
          </button>
        </div>

        {/* Active Installments */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-foreground mb-3">{t("activeInstallments")}</h2>
          {installmentPlans.length === 0 ? (
            <div className="rounded-2xl bg-card border border-border p-6 text-center text-muted-foreground text-sm">
              {t("noInstallments")}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {installmentPlans.map((plan) => (
                <div key={plan.id} className="rounded-2xl bg-card border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-card-foreground">{plan.merchantName}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(plan.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {t("installmentOf")} {plan.paidInstallments + 1} {t("of")} {plan.installments}
                    </span>
                    <span className="text-xs text-muted-foreground">{plan.nextPaymentDate}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(plan.paidInstallments / plan.installments) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Purchases */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-foreground mb-3">{t("recentPurchases")}</h2>
          {transactions.length === 0 ? (
            <div className="rounded-2xl bg-card border border-border p-6 text-center text-muted-foreground text-sm">
              {t("noPurchases")}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.slice(-3).reverse().map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-2xl bg-card border border-border p-4">
                  <div>
                    <div className="font-medium text-card-foreground">{tx.merchantName}</div>
                    <div className="text-xs text-muted-foreground">
                      {tx.installments}x &middot; {tx.date}
                    </div>
                  </div>
                  <span className="font-semibold text-card-foreground">
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav variant="user" />
    </div>
  )
}
