"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft } from "lucide-react"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(n)
}

export function UserWithdraw() {
  const { balance, updateBalance, addTransaction, addNotification, setScreen } = useApp()
  const { t } = useTranslation()
  const [amount, setAmount] = useState("")
  const [alias, setAlias] = useState("")
  const [error, setError] = useState("")

  const handleConfirm = () => {
    const value = Number(amount)
    if (!value || value <= 0) {
      setError("Ingresá un monto válido")
      return
    }
    if (value > balance.available) {
      setError("Saldo insuficiente")
      return
    }
    if (!alias.trim()) {
      setError("Ingresá un alias o CBU destino")
      return
    }

    updateBalance({ available: balance.available - value })
    addTransaction({
      id: Date.now().toString(),
      type: "withdraw",
      merchantName: alias,
      amount: value,
      installments: 1,
      date: new Date().toLocaleDateString("es-AR"),
    })
    addNotification(`Retiro de ${formatCurrency(value)} realizado con éxito`)
    setScreen("user-dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24 px-5">
      <div className="py-4">
        <button
          onClick={() => setScreen("user-dashboard")}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2">Retirar fondos</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Disponible: {formatCurrency(balance.available)}
      </p>

      <div className="flex flex-col gap-4">
        {/* Monto */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Monto a retirar
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError("") }}
            placeholder="$0"
            className="w-full px-4 py-3 rounded-2xl border border-border bg-card text-card-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Alias / CBU */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Alias o CBU destino
          </label>
          <input
            type="text"
            value={alias}
            onChange={(e) => { setAlias(e.target.value); setError("") }}
            placeholder="mi.alias.banco"
            className="w-full px-4 py-3 rounded-2xl border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}

        {/* Botón confirmar */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-base hover:opacity-90 transition-opacity mt-2"
        >
          Confirmar retiro
        </button>
      </div>
    </div>
  )
}