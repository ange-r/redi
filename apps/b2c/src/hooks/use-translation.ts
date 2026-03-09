"use client"

import { useApp } from "@/context/app-context"
import { translations } from "@/lib/translations"

export function useTranslation() {
  const { lang } = useApp()
  const t = (key: string) => translations[lang]?.[key] ?? key
  return { t, lang }
}
