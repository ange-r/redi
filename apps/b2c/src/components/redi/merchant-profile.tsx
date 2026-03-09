"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { ProfileAvatar } from "./profile-avatar"
import { ArrowLeft, LogOut, Copy, Check, Bell, BellOff } from "lucide-react"

const DEMO_WALLET = "GBXYZ...MERCH5678"

export function MerchantProfile() {
  const { merchantUser, setMerchantUser, profileImage, setProfileImage, setScreen, resetApp } = useApp()
  const { t } = useTranslation()
  const [editingEmail, setEditingEmail] = useState(false)
  const [emailDraft, setEmailDraft] = useState(merchantUser.email)
  const [copied, setCopied] = useState(false)
  const [notifPurchase, setNotifPurchase] = useState(false)
  const [notifPayment, setNotifPayment] = useState(false)
  const [notifInvestment, setNotifInvestment] = useState(false)
  const [notifSale, setNotifSale] = useState(true)
  const [notifSettlement, setNotifSettlement] = useState(true)

  const handleCopy = () => {
    navigator.clipboard.writeText(DEMO_WALLET)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const saveEmail = () => {
    if (emailDraft) {
      setMerchantUser({ ...merchantUser, email: emailDraft })
    }
    setEditingEmail(false)
  }

  const toggleItem = (
    label: string,
    value: boolean,
    setter: (v: boolean) => void,
    icon: React.ReactNode
  ) => (
    <div className="flex items-center justify-between py-3.5 px-4 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium text-card-foreground">{label}</span>
      </div>
      <button
        onClick={() => setter(!value)}
        className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
          value ? "bg-primary" : "bg-muted"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-card shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <div className="px-5 py-3">
        <button
          onClick={() => setScreen("merchant-dashboard")}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{t("back")}</span>
        </button>
      </div>

      <div className="flex flex-col items-center pt-2 pb-6">
        <ProfileAvatar
          name={merchantUser.name}
          imageUrl={profileImage}
          onImageChange={setProfileImage}
          size="lg"
          editable
        />
        <h1 className="text-xl font-bold text-foreground mt-3">
          {t("greeting")}, {merchantUser.name}
        </h1>
        <div className="mt-1 flex items-center gap-2">
          {editingEmail ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveEmail()
              }}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-border bg-card text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button type="submit" className="text-xs text-primary font-semibold">
                OK
              </button>
            </form>
          ) : (
            <button
              onClick={() => setEditingEmail(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              {merchantUser.email}
            </button>
          )}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3">
        <div className="flex items-center justify-between py-3.5 px-4 rounded-2xl bg-card border border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{t("walletAddress")}</p>
            <p className="text-sm font-mono text-card-foreground">{DEMO_WALLET}</p>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
            aria-label="Copy wallet address"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="mt-2">
          <p className="text-sm font-semibold text-foreground mb-2 px-1">{t("notifPreferences")}</p>
          <div className="flex flex-col gap-2">
            {toggleItem(
              t("notifPurchase"),
              notifPurchase,
              setNotifPurchase,
              <Bell className="w-4 h-4 text-muted-foreground" />
            )}
            {toggleItem(
              t("notifPaymentReceived"),
              notifPayment,
              setNotifPayment,
              <Bell className="w-4 h-4 text-muted-foreground" />
            )}
            {toggleItem(
              t("notifInvestment"),
              notifInvestment,
              setNotifInvestment,
              <BellOff className="w-4 h-4 text-muted-foreground" />
            )}
            {toggleItem(
              t("notifSale"),
              notifSale,
              setNotifSale,
              <Bell className="w-4 h-4 text-muted-foreground" />
            )}
            {toggleItem(
              t("notifSettlement"),
              notifSettlement,
              setNotifSettlement,
              <BellOff className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => {
              resetApp()
              setScreen("role-selector")
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-accent/20 text-accent font-bold border border-accent hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  )
}
