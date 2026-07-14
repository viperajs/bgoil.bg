'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X, AlertTriangle, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

/* ====== Кратки статус съобщения (flash) ====== */
export type FlashMsg = { type: 'success' | 'error'; text: string }

export function useFlash(timeoutMs = 5000): [FlashMsg | null, (m: FlashMsg) => void] {
  const [msg, setMsg] = useState<FlashMsg | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const flash = useCallback((m: FlashMsg) => {
    setMsg(m)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(null), timeoutMs)
  }, [timeoutMs])

  return [msg, flash]
}

export function FlashBanner({ msg }: { msg: FlashMsg | null }) {
  if (!msg) return null
  return (
    <div
      role="status"
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${
        msg.type === 'success'
          ? 'bg-emerald-500/[0.08] border-emerald-500/25 text-emerald-300'
          : 'bg-red-500/[0.08] border-red-500/25 text-red-300'
      }`}
    >
      {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      {msg.text}
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
        <p className="text-sm text-white/50">Зареждане…</p>
      </div>
    </div>
  )
}

/* ====== Модален прозорец ====== */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'} max-h-[92dvh] sm:max-h-[85dvh] flex flex-col bg-[#111113] border border-white/[0.09] sm:rounded-2xl rounded-t-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 h-14 border-b border-white/[0.07] shrink-0">
          <h2 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Затвори"
            className="w-11 h-11 -mr-2 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 sm:px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

/* ====== Диалог за потвърждение ====== */
export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmText = 'Изтрий',
  busy = false,
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  busy?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200" onClick={busy ? undefined : onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-sm bg-[#111113] border border-white/[0.09] rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1.5">{title}</h2>
        <p className="text-sm text-white/50 leading-relaxed mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 min-h-[44px] rounded-xl border border-white/[0.1] text-sm font-semibold text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer disabled:opacity-50"
          >
            Отказ
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 min-h-[44px] rounded-xl bg-red-600 hover:bg-red-500 text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
          >
            {busy ? 'Момент…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ====== Превключвател (switch) ====== */
export function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  id?: string
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
        checked ? 'bg-emerald-500/90 border-emerald-400/50' : 'bg-white/[0.08] border-white/[0.12]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

/* ====== Поле с етикет ====== */
export function Field({
  label,
  htmlFor,
  error,
  children,
  className = '',
}: {
  label: string
  htmlFor?: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/45 mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}

export const inputClass =
  'w-full min-h-[44px] rounded-xl bg-white/[0.04] border border-white/[0.1] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 outline-none transition-colors'
