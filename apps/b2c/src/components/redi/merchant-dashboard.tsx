"use client"

import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { RediHeader } from "./header"
import { BottomNav } from "./bottom-nav"
import { DollarSign, Clock, CheckCircle, QrCode } from "lucide-react"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

export function MerchantDashboard() {
  const { merchantUser, merchantSales, setScreen } = useApp()
  const { t } = useTranslation()

  const salesToday = merchantSales
    .filter((s) => s.status === "approved" || s.status === "settled")
    .reduce((sum, s) => sum + s.amount, 0)
  const pendingCount = merchantSales.filter((s) => s.status === "pending").length
  const settledCount = merchantSales.filter((s) => s.status === "settled").length

  const stats = [
    { label: t("salesToday"), value: formatCurrency(salesToday), icon: DollarSign, color: "text-success" },
    { label: t("pending"), value: pendingCount.toString(), icon: Clock, color: "text-amber-400" },
    { label: t("settled"), value: settledCount.toString(), icon: CheckCircle, color: "text-primary" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <RediHeader showNav />

      <div className="px-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="font-bold text-lg text-foreground">{t("merchantLogin")}</div>
          <span className="text-sm text-muted-foreground">- {merchantUser.name}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-2xl bg-card border border-border p-4 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <p className="text-xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Generate QR Button */}
        <button
          onClick={() => setScreen("merchant-qr")}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity mb-6"
        >
          <QrCode className="w-5 h-5" />
          {t("generateQR")}
        </button>

        {/* Recent Sales */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">
            {t("allSales")}
          </h2>
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
                    <div className="text-xs text-muted-foreground">
                      {sale.installments}x &middot; {sale.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-card-foreground">{formatCurrency(sale.amount)}</p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        sale.status === "approved"
                          ? "bg-success/20 text-success"
                          : sale.status === "pending"
                          ? "bg-amber-400/20 text-amber-400"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {sale.status === "approved"
                        ? t("approved")
                        : sale.status === "pending"
                        ? t("pendingStatus")
                        : t("settledStatus")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav variant="merchant" />
    </div>
  )
}
