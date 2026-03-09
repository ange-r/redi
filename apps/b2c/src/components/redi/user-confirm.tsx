"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { RediHeader } from "./header"
import { BottomNav } from "./bottom-nav"
import { ArrowLeft, CheckCircle, Store } from "lucide-react"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(d: Date) {
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function UserConfirm() {
  const { balance, updateBalance, addInstallmentPlan, addTransaction, setScreen } = useApp()
  const { t } = useTranslation()
  const [success, setSuccess] = useState(false)

  // Retrieve from state (hardcoded for demo continuity)
  const merchantName = "Tienda Demo"
  const totalAmount = 29000
  const installments = 3
  const perInstallment = Math.round(totalAmount / installments)

  const today = new Date()
  const dates = Array.from({ length: installments }, (_, i) =>
    formatDate(addDays(today, i * 30))
  )

  const handleConfirm = () => {
    updateBalance({
      available: balance.available - totalAmount,
      protected: balance.protected + totalAmount,
    })

    addInstallmentPlan({
      id: Date.now().toString(),
      merchantName,
      totalAmount,
      installments,
      paidInstallments: 0,
      perInstallment,
      nextPaymentDate: dates[0],
      dates,
      createdAt: formatDate(today),
    })

    addTransaction({
      id: Date.now().toString(),
      merchantName,
      amount: totalAmount,
      installments,
      date: formatDate(today),
    })

    setSuccess(true)
    setTimeout(() => {
      setScreen("user-dashboard")
    }, 2000)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <p className="text-xl font-bold text-foreground">{t("purchaseSuccess")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <RediHeader showNav />

      <div className="px-5">
        <button
          onClick={() => setScreen("user-payments")}
          className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{t("back")}</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">{t("confirmPurchase")}</h1>

        {/* Summary Card */}
        <div className="rounded-2xl bg-card border border-border p-5 mb-5">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-card-foreground">{merchantName}</p>
              <p className="text-xs text-muted-foreground">{t("merchant")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("total")}</span>
              <span className="font-bold text-card-foreground">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("plan")}</span>
              <span className="font-medium text-card-foreground">
                {installments} {t("installmentsOf")} {formatCurrency(perInstallment)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-medium text-card-foreground mb-2">{t("paymentDates")}</p>
            <div className="flex flex-col gap-1">
              {dates.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("installmentOf")} {i + 1}
                  </span>
                  <span className="text-card-foreground">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Balance Preview */}
        <div className="rounded-2xl bg-secondary p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-foreground">{t("availableAfter")}</span>
            <span className="font-bold text-secondary-foreground">
              {formatCurrency(balance.available - totalAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-foreground">{t("protectedAmount")}</span>
            <span className="font-bold text-primary">
              {formatCurrency(balance.protected + totalAmount)}
            </span>
          </div>
        </div>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          disabled={balance.available < totalAmount}
          className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("confirm")}
        </button>

        {balance.available < totalAmount && (
          <p className="text-sm text-destructive text-center mt-3">
            {"Saldo insuficiente. Deposita fondos primero."}
          </p>
        )}
      </div>

      <BottomNav variant="user" />
    </div>
  )
}
