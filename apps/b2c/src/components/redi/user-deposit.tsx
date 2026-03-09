"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { RediHeader } from "./header"
import { BottomNav } from "./bottom-nav"
import { ArrowLeft, CheckCircle, Sparkles } from "lucide-react"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

export function UserDeposit() {
  const { updateBalance, balance, setScreen } = useApp()
  const { t } = useTranslation()
  const [amount, setAmount] = useState("")
  const [success, setSuccess] = useState(false)

  const handleDeposit = () => {
    const num = parseInt(amount)
    if (!num || num <= 0) return
    updateBalance({ available: balance.available + num })
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setScreen("user-dashboard")
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <RediHeader showNav />

      <div className="px-5">
        <button
          onClick={() => setScreen("user-dashboard")}
          className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{t("back")}</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">{t("depositTitle")}</h1>

        {success ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <p className="text-xl font-bold text-foreground">{t("depositSuccess")}</p>
            <p className="text-muted-foreground mt-1">+{formatCurrency(parseInt(amount))}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2 py-8">
              <span className="text-muted-foreground text-sm">{t("available")}: {formatCurrency(balance.available)}</span>
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-foreground">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="text-5xl font-bold text-foreground bg-transparent border-none outline-none w-48 text-center placeholder:text-muted-foreground/30"
                />
              </div>
            </div>

            <button
              onClick={() => setAmount("50000")}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {t("getTestFunds")}
            </button>

            <button
              onClick={handleDeposit}
              disabled={!amount || parseInt(amount) <= 0}
              className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("confirmDeposit")}
            </button>
          </div>
        )}
      </div>

      <BottomNav variant="user" />
    </div>
  )
}
