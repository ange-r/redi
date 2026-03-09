"use client"

import { useState, useEffect, useRef } from "react"
import { useApp } from "@/context/app-context"
import { useTranslation } from "@/hooks/use-translation"
import { Bell } from "lucide-react"

export function NotificationBell() {
  const { notifications } = useApp()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [lastSeen, setLastSeen] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const unseenCount = notifications.filter((n) => n.createdAt > lastSeen).length

  const handleOpen = () => {
    setOpen(!open)
    if (!open) {
      setLastSeen(Date.now())
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unseenCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-card border border-border shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="font-semibold text-sm text-card-foreground">
              {t("notifications")}
            </p>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                {t("noNotifications")}
              </div>
            ) : (
              [...notifications].reverse().map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                >
                  <p className="text-sm text-card-foreground">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
