"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { RediHeader } from "./header"
import { BottomNav } from "./bottom-nav"
import { TrendingUp, Plus, ArrowUpRight, ArrowDownRight, ShieldCheck, X } from "lucide-react"

function formatCurrency(n: number) {
  return "$" + new Intl.NumberFormat("es-AR").format(n)
}

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function InvestorView() {
  const {
    investorUser,
    investorBalance,
    investorPlans,
    updateInvestorBalance,
    addInvestorPlan,
    addNotification,
    setScreen,
  } = useApp()

  const [showDeposit, setShowDeposit] = useState(false)
  const [showInvest, setShowInvest] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  // needed for withdrawal
  const [bankAlias, setBankAlias] = useState("")

  const [selectedPlan, setSelectedPlan] = useState<
    | null
    | {
        id: string
        amount: number
        startDate: string
        releaseDate: string
        daysRemaining: number
        status: "active" | "released"
      }
  >(null)

  const showPlanModal = selectedPlan !== null
  const closePlanModal = () => setSelectedPlan(null)

  const APY = 8.5

  const parseAmount = (s: string) => {
    // allow commas for decimal separators (common in locales like es-AR)
    const normalized = s.replace(/,/g, '.')
    return parseFloat(normalized)
  }

  const handleDeposit = () => {
    const value = parseAmount(amount)
    if (!value || value <= 0) { setError("Ingresá un monto válido"); return }
    updateInvestorBalance({ available: investorBalance.available + value })
    addNotification(`Depósito de ${formatCurrency(value)} acreditado - Tx #${Date.now()}`)
    setAmount(""); setError(""); setShowDeposit(false)
  }

  const handleInvest = () => {
    const value = parseAmount(amount)
    if (!value || value <= 0) { setError("Ingresá un monto válido"); return }
    if (value > investorBalance.available) { setError("Saldo insuficiente"); return }
    const start = new Date()
    const release = addMonths(start, 6)
    addInvestorPlan({
      id: Date.now().toString(),
      amount: value,
      startDate: start.toLocaleDateString("es-AR"),
      releaseDate: release.toLocaleDateString("es-AR"),
      daysRemaining: daysUntil(release.toISOString()),
      status: "active",
    })
    updateInvestorBalance({
      available: investorBalance.available - value,
      invested: investorBalance.invested + value,
      yieldEarned: investorBalance.yieldEarned + (value * APY / 100),
    })
    addNotification(`Inversión de ${formatCurrency(value)} registrada - Tx #${Date.now()}`)
    setAmount(""); setError(""); setShowInvest(false)
  }

  const handleWithdraw = () => {
    const value = parseAmount(amount)
    if (!value || value <= 0) { setError("Ingresá un monto válido"); return }
    if (!bankAlias) { setError("Ingrese alias de banco"); return }
    if (value > investorBalance.available) { setError("Saldo insuficiente"); return }
    updateInvestorBalance({ available: investorBalance.available - value })
    addNotification(
      `Retiro de ${formatCurrency(value)} hacia ${bankAlias} procesado - Tx #${Date.now()}`
    )
    setAmount(""); setBankAlias(""); setError(""); setShowWithdraw(false)
  }

  const resetModal = () => {
    setAmount(""); setError(""); setBankAlias("")
    setShowDeposit(false); setShowInvest(false); setShowWithdraw(false)
  }

  const activeModal = showDeposit || showInvest || showWithdraw

  return (
    // make the main column scrollable on small screens and reserve space for nav
    <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-auto touch-pan-y">
      <RediHeader showNav />

      <div className="px-5">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Hola, {investorUser.name || "Inversor"} 👋
        </h1>

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1d2e] to-[#232640] p-6 mb-5">
          {/* display available amount first so deposits are obvious */}
          <p className="text-xs font-medium text-[#94a3b8] mb-1">Saldo disponible</p>
          <p className="text-4xl font-bold text-[#17e9e0] mb-3">
            {formatCurrency(investorBalance.available)}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-[#94a3b8]">
              <ShieldCheck className="w-4 h-4" />
              Inversión activa: {formatCurrency(investorBalance.invested)}
            </div>
            {investorBalance.yieldEarned > 0 && (
              <div className="flex items-center gap-1 text-sm text-[#10B981] font-medium">
                <TrendingUp className="w-4 h-4" />
                +{formatCurrency(investorBalance.yieldEarned)} ({APY}% APY)
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => { resetModal(); setShowDeposit(true) }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Depositar
          </button>
          <button
            onClick={() => { resetModal(); setShowInvest(true) }}
            disabled={investorBalance.available === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#ffb48f] text-white font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <ArrowUpRight className="w-5 h-5" />
            Invertir
          </button>
          <button
            onClick={() => { resetModal(); setShowWithdraw(true) }}
            disabled={investorBalance.available === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-[#ffb48f] text-[#ffb48f] font-bold disabled:opacity-40 hover:bg-[#ffb48f]/10 transition-colors"
          >
            <ArrowDownRight className="w-5 h-5" />
            Retirar
          </button>
        </div>

        {/* Investment Plans */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Mis inversiones</h2>
          {investorPlans.length === 0 ? (
            <div className="rounded-2xl bg-card border border-border p-6 text-center text-muted-foreground text-sm">
              No tenés inversiones activas aún
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {investorPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className="rounded-2xl bg-card border border-border p-4 cursor-pointer hover:bg-card/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-card-foreground">
                      {formatCurrency(plan.amount)}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      plan.status === "active"
                        ? "bg-primary/20 text-primary"
                        : "bg-[#10B981]/20 text-[#10B981]"
                    }`}>
                      {plan.status === "active" ? "Activa" : "Liberada"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Inicio: {plan.startDate} → Liberación: {plan.releaseDate}
                  </div>
                  <div className="text-xs font-medium text-[#ffb48f]">
                    {plan.daysRemaining} días para liberación
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Tx #{plan.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal */}
      {activeModal && (
        // overlay covers whole screen and centers modal vertically/horizontally
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60">
          <div className="w-full max-w-md bg-background rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {showDeposit ? "Depositar fondos" : showInvest ? "Invertir fondos" : "Retirar fondos"}
            </h2>
            {showWithdraw && (
              <input
                type="text"
                value={bankAlias}
                onChange={(e) => { setBankAlias(e.target.value); setError("") }}
                placeholder="Alias bancario"
                className="w-full px-4 py-3 rounded-2xl border border-border bg-card text-card-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                autoFocus
              />
            )}
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError("") }}
              placeholder="$0"
              className="w-full px-4 py-3 rounded-2xl border border-border bg-card text-card-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3"
            />
            {error && <p className="text-sm text-destructive mb-3">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={resetModal}
                className="flex-1 py-3.5 rounded-2xl border border-border text-muted-foreground font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={showDeposit ? handleDeposit : showInvest ? handleInvest : handleWithdraw}
                className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {showPlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60">
          <div className="w-full max-w-md bg-background rounded-3xl p-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closePlanModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label="Cerrar detalle"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Detalle de inversión</h2>
            <div className="space-y-2 text-sm text-card-foreground">
              <p><strong>Monto:</strong> {formatCurrency(selectedPlan.amount)}</p>
              <p><strong>Inicio:</strong> {selectedPlan.startDate}</p>
              <p><strong>Liberación:</strong> {selectedPlan.releaseDate}</p>
              <p><strong>Días restantes:</strong> {selectedPlan.daysRemaining}</p>
              <p><strong>Estado:</strong> {selectedPlan.status === "active" ? "Activa" : "Liberada"}</p>
              <p><strong>Tx:</strong> {selectedPlan.id}</p>
            </div>
          </div>
        </div>
      )}

      <BottomNav variant="investor" />
    </div>
  )
}