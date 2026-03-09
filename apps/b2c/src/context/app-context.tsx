"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Lang } from "@/lib/translations"

export type Role = "user" | "merchant" | "investor" | null

export interface InstallmentPlan {
  id: string
  merchantName: string
  totalAmount: number
  installments: number
  paidInstallments: number
  perInstallment: number
  nextPaymentDate: string
  dates: string[]
  createdAt: string
}

export interface Transaction {
  id: string
  type: "purchase" | "deposit" | "withdraw"
  merchantName: string
  amount: number
  installments: number
  date: string
}

export interface MerchantSale {
  id: string
  buyerAnon: string
  amount: number
  installments: number
  description: string
  status: "approved" | "pending" | "settled"
  date: string
}

export interface Notification {
  id: string
  message: string
  createdAt: number
}

export interface PendingPurchase {
  merchantName: string
  amount: number
  installments: number
}

export interface AppState {
  role: Role
  screen: string
  lang: Lang
  profileImage: string
  user: { name: string; email: string }
  balance: {
    available: number
    protected: number
    yieldEarned: number
  }
  installmentPlans: InstallmentPlan[]
  transactions: Transaction[]
  notifications: Notification[]
  pendingPurchase: PendingPurchase | null
  merchantUser: { name: string; email: string }
  merchantSales: MerchantSale[]
  investorUser: { name: string; email: string }
  investorBalance: {
    invested: number
    available: number
    yieldEarned: number
  }
  investorPlans: {
    id: string
    amount: number
    startDate: string
    releaseDate: string
    daysRemaining: number
    status: "active" | "released"
  }[]
  investorPool: {
    tvl: number
    apy: number
    activeUsers: number
    totalVolume: number
    activeInstallments: number
    registeredMerchants: number
  }
}

interface AppContextType extends AppState {
  setRole: (role: Role) => void
  setScreen: (screen: string) => void
  setLang: (lang: Lang) => void
  setProfileImage: (url: string) => void
  setUser: (user: { name: string; email: string }) => void
  setMerchantUser: (user: { name: string; email: string }) => void
  setInvestorUser: (user: { name: string; email: string }) => void
  updateBalance: (updates: Partial<AppState["balance"]>) => void
  addInstallmentPlan: (plan: InstallmentPlan) => void
  addTransaction: (tx: Transaction) => void
  addNotification: (message: string) => void
  setPendingPurchase: (p: PendingPurchase | null) => void
  addMerchantSale: (sale: MerchantSale) => void
  updateMerchantSaleStatus: (id: string, status: MerchantSale["status"]) => void
  resetApp: () => void
  updateInvestorBalance: (updates: Partial<AppState["investorBalance"]>) => void
  addInvestorPlan: (plan: AppState["investorPlans"][0]) => void
}

const initialState: AppState = {
  role: null,
  screen: "role-selector",
  lang: "es",
  profileImage: "",
  user: { name: "", email: "" },
  balance: {
    available: 0,
    protected: 0,
    yieldEarned: 0,
  },
  installmentPlans: [],
  transactions: [],
  notifications: [],
  pendingPurchase: null,
  merchantUser: { name: "", email: "" },
  merchantSales: [],
  investorUser: { name: "", email: "" },
  investorBalance: {
    invested: 0,
    available: 0,
    yieldEarned: 0,
  },
  investorPlans: [],
  investorPool: {
    tvl: 0,
    apy: 0,
    activeUsers: 0,
    totalVolume: 0,
    activeInstallments: 0,
    registeredMerchants: 0,
  },
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)

  const setRole = useCallback((role: Role) => {
    setState((prev) => ({ ...prev, role }))
  }, [])

  const setScreen = useCallback((screen: string) => {
    setState((prev) => ({ ...prev, screen }))
  }, [])

  const setLang = useCallback((lang: Lang) => {
    setState((prev) => ({ ...prev, lang }))
  }, [])

  const setProfileImage = useCallback((url: string) => {
    setState((prev) => ({ ...prev, profileImage: url }))
  }, [])

  const setUser = useCallback((user: { name: string; email: string }) => {
    setState((prev) => ({ ...prev, user }))
  }, [])

  const setMerchantUser = useCallback((user: { name: string; email: string }) => {
    setState((prev) => ({ ...prev, merchantUser: user }))
  }, [])

  const setInvestorUser = useCallback((user: { name: string; email: string }) => {
    setState((prev) => ({ ...prev, investorUser: user }))
  }, [])

  const updateBalance = useCallback((updates: Partial<AppState["balance"]>) => {
    setState((prev) => ({
      ...prev,
      balance: { ...prev.balance, ...updates },
    }))
  }, [])

  const addInstallmentPlan = useCallback((plan: InstallmentPlan) => {
    setState((prev) => ({
      ...prev,
      installmentPlans: [...prev.installmentPlans, plan],
    }))
  }, [])

  const addTransaction = useCallback((tx: Transaction) => {
    setState((prev) => ({
      ...prev,
      transactions: [...prev.transactions, tx],
    }))
  }, [])

  const addNotification = useCallback((message: string) => {
    setState((prev) => ({
      ...prev,
      notifications: [
        ...prev.notifications,
        { id: Date.now().toString(), message, createdAt: Date.now() },
      ],
    }))
  }, [])

  const setPendingPurchase = useCallback((p: PendingPurchase | null) => {
    setState((prev) => ({ ...prev, pendingPurchase: p }))
  }, [])

  const addMerchantSale = useCallback((sale: MerchantSale) => {
    setState((prev) => ({
      ...prev,
      merchantSales: [...prev.merchantSales, sale],
    }))
  }, [])

  const updateMerchantSaleStatus = useCallback(
    (id: string, status: MerchantSale["status"]) => {
      setState((prev) => ({
        ...prev,
        merchantSales: prev.merchantSales.map((s) =>
          s.id === id ? { ...s, status } : s
        ),
      }))
    },
    []
  )

  const resetApp = useCallback(() => {
    setState(initialState)
  }, 
  []
  )
  
  const updateInvestorBalance = useCallback((updates: Partial<AppState["investorBalance"]>) => {
    setState((prev) => ({
      ...prev,
      investorBalance: { ...prev.investorBalance, ...updates },
    }))
  }, [])

  const addInvestorPlan = useCallback((plan: AppState["investorPlans"][0]) => {
    setState((prev) => ({
      ...prev,
      investorPlans: [...prev.investorPlans, plan],
    }))
  }, 
  []
)
  
  return (
    <AppContext.Provider
      value={{
        ...state,
        setRole,
        setScreen,
        setLang,
        setProfileImage,
        setUser,
        setMerchantUser,
        setInvestorUser,
        updateBalance,
        addInstallmentPlan,
        addTransaction,
        addNotification,
        setPendingPurchase,
        addMerchantSale,
        updateMerchantSaleStatus,
        resetApp,
        updateInvestorBalance,
        addInvestorPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
