"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { RediHeader } from "./header"
import { BottomNav } from "./bottom-nav"
import { ArrowLeft, QrCode, CheckCircle, Loader2 } from "lucide-react"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

export function MerchantQR() {
  const { addMerchantSale, setScreen } = useApp()
  const { t } = useTranslation()
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [step, setStep] = useState<"input" | "waiting" | "approved">("input")

  const handleGenerate = () => {
    if (!amount || parseInt(amount) <= 0) return
    setStep("waiting")
  }

  const handleApprove = () => {
    const today = new Date()
    addMerchantSale({
      id: Date.now().toString(),
      buyerAnon: "Usuario #" + Math.floor(Math.random() * 9000 + 1000),
      amount: parseInt(amount),
      installments: 3,
      description: description || "Venta",
      status: "approved",
      date: today.toLocaleDateString("es-AR"),
    })
    setStep("approved")
    setTimeout(() => setScreen("merchant-dashboard"), 2500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <RediHeader showNav />

      <div className="px-5">
        <button
          onClick={() => setScreen("merchant-dashboard")}
          className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{t("back")}</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">{t("generateQR")}</h1>

        {step === "input" && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground px-1">
                {t("saleAmount")}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="29000"
                className="w-full px-4 py-3.5 rounded-2xl border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground px-1">
                {t("description")}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Zapatillas Nike"
                className="w-full px-4 py-3.5 rounded-2xl border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!amount || parseInt(amount) <= 0}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("generate")}
            </button>
          </div>
        )}

        {step === "waiting" && (
          <div className="flex flex-col items-center py-8 gap-6">
            {/* Mock QR */}
            <div className="w-48 h-48 rounded-3xl bg-card border-2 border-border flex items-center justify-center">
              <QrCode className="w-24 h-24 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{formatCurrency(parseInt(amount))}</p>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{t("waitingPayment")}</span>
            </div>
            <button
              onClick={handleApprove}
              className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity"
            >
              {t("simulateApproval")}
            </button>
          </div>
        )}

        {step === "approved" && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <p className="text-xl font-bold text-foreground mb-1">{t("saleApproved")}</p>
            <p className="text-muted-foreground text-sm text-center">{t("creditMsg")}</p>
          </div>
        )}
      </div>

      <BottomNav variant="merchant" />
    </div>
  )
}
