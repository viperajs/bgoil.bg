"use client"

import { useState, useEffect } from "react"
import { X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToastProps {
  message: string
  type?: "info" | "warning" | "success" | "error"
  duration?: number
  onClose?: () => void
}

export default function Toast({ message, type = "info", duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  if (!isVisible) return null

  const getToastStyles = () => {
    switch (type) {
      case "warning":
        return "bg-accent/10 border-accent/20 text-accent"
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
      case "error":
        return "bg-destructive/10 border-destructive/20 text-destructive"
      default:
        return "bg-primary/10 border-primary/20 text-primary"
    }
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
    >
      <div className={`rounded-lg border p-4 shadow-lg ${getToastStyles()}`}>
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed">{message}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-auto p-1 hover:bg-transparent">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type?: "info" | "warning" | "success" | "error" }>
  >([])

  const showToast = (message: string, type: "info" | "warning" | "success" | "error" = "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
