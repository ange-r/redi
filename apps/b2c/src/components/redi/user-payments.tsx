"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { RediHeader } from "./header"
import { BottomNav } from "./bottom-nav"
import { QrCode, ShieldCheck, Check } from "lucide-react"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

export function UserPayments() {
  const { balance, setScreen } = useApp()
  const { t } = useTranslation()
  const [scanned, setScanned] = useState(false)
  const [selectedInstallments, setSelectedInstallments] = useState(3)
  const [amount, setAmount] = useState(29000)

  const installmentOptions = [1, 3, 6, 12]
  const perInstallment = Math.round(amount / selectedInstallments)

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <RediHeader showNav />

      <div className="px-5">
        {/* Balance Mini Card */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/80 to-primary p-4 mb-5">
          <p className="text-xs font-medium text-primary-foreground/70 mb-0.5">{t("yourReserve")}</p>
          <p className="text-2xl font-bold text-primary-foreground">
            {formatCurrency(balance.available)}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-primary-foreground/60 mt-1">
            <ShieldCheck className="w-3 h-3" />
            {t("protected")}: {formatCurrency(balance.protected)}
          </div>
        </div>

        {!scanned ? (
          <div className="flex flex-col items-center py-12">
            <h2 className="text-xl font-bold text-foreground mb-6">{t("newPurchase")}</h2>
            <button
              onClick={() => setScanned(true)}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
            >
              <QrCode className="w-6 h-6" />
              {t("simulateQR")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Merchant Info */}
            <div className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("merchant")}</p>
                  <p className="font-semibold text-card-foreground">Tienda Demo</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t("total")}</p>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="font-bold text-lg text-card-foreground bg-transparent border-none outline-none text-right w-28"
                  />
                </div>
              </div>
            </div>

            {/* Installment Selector */}
            <div>
              <h3 className="font-bold text-foreground mb-3">{t("installmentQuestion")}</h3>
              <div className="flex gap-2">
                {installmentOptions.map((n) => (
                  <button
                    key={n}
                    onClick={() => setSelectedInstallments(n)}
                    className={`relative flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                      selectedInstallments === n
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-card border border-border text-card-foreground hover:border-primary"
                    }`}
                  >
                    {n}
                    {selectedInstallments === n && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex items-center justify-center mt-3">
                <span className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>

            {/* Simulation Info */}
            <div className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-card-foreground">{t("simulate")}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-card-foreground">{t("fixedInstallments")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-card-foreground">{t("noInterest")}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                {selectedInstallments} {t("installmentsOf")} {formatCurrency(perInstallment)}
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setScreen("user-confirm")}
              disabled={amount <= 0 || amount > balance.available}
              className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-lg uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("continue")}
            </button>
          </div>
        )}
      </div>

      <BottomNav variant="user" />
    </div>
  )
}
