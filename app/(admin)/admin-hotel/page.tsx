// app/(admin)/admin-hotel/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  ImagePlus,
  X,
  Users,
  BedDouble,
  Ruler,
  ImageOff,
} from 'lucide-react'
import { Modal, ConfirmDialog, Toggle, Field, inputClass } from '@/components/admin/ui'
import type { HotelRoomFull, HotelInfo } from '@/lib/types'

type RoomForm = {
  name: string
  type: string
  price: string
  capacity: string
  size: string
  bedType: string
  description: string
  amenities: string[]
  images: string[]
  available: boolean
}

const emptyForm: RoomForm = {
  name: '',
  type: '',
  price: '',
  capacity: '2',
  size: '',
  bedType: '',
  description: '',
  amenities: [],
  images: [],
  available: true,
}

type Msg = { type: 'success' | 'error'; text: string }

export default function AdminHotelPage() {
  const [rooms, setRooms] = useState<HotelRoomFull[]>([])
  const [info, setInfo] = useState<HotelInfo>({ checkIn: '12:00', checkOut: '11:00' })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<Msg | null>(null)

  // модал за добавяне/редакция
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<RoomForm>(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [amenityInput, setAmenityInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // изтриване
  const [deleteTarget, setDeleteTarget] = useState<HotelRoomFull | null>(null)
  const [deleting, setDeleting] = useState(false)

  // info запис
  const [savingInfo, setSavingInfo] = useState(false)

  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  function flash(m: Msg) {
    setMsg(m)
    if (msgTimer.current) clearTimeout(msgTimer.current)
    msgTimer.current = setTimeout(() => setMsg(null), 5000)
  }

  useEffect(() => {
    loadData()
    return () => {
      if (msgTimer.current) clearTimeout(msgTimer.current)
    }
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [roomsRes, infoRes] = await Promise.all([
        fetch('/api/admin/rooms', { cache: 'no-store' }),
        fetch('/api/hotel', { cache: 'no-store' }),
      ])
      if (!roomsRes.ok) throw new Error(`GET /api/admin/rooms -> ${roomsRes.status}`)
      const roomsData = await roomsRes.json()
      setRooms(roomsData.rooms || [])
      if (infoRes.ok) {
        const infoData = await infoRes.json()
        if (infoData.info) setInfo(infoData.info)
      }
    } catch (e) {
      console.error(e)
      flash({ type: 'error', text: 'Грешка при зареждане на данните' })
    } finally {
      setLoading(false)
    }
  }

  /* ====== Форма ====== */
  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFormErrors({})
    setAmenityInput('')
    setModalOpen(true)
  }

  function openEdit(room: HotelRoomFull) {
    setEditingId(room.id)
    setForm({
      name: room.name,
      type: room.type,
      price: String(room.price),
      capacity: String(room.capacity),
      size: room.size || '',
      bedType: room.bedType || '',
      description: room.description,
      amenities: [...room.amenities],
      images: [...room.images],
      available: room.available,
    })
    setFormErrors({})
    setAmenityInput('')
    setModalOpen(true)
  }

  function validate(): boolean {
    const errors: Record<string, string> = {}
    if (form.name.trim().length < 2) errors.name = 'Името трябва да е поне 2 символа'
    if (form.type.trim().length < 2) errors.type = 'Типът е задължителен'
    const price = Number(form.price)
    if (!form.price.trim() || !Number.isFinite(price) || price < 0) errors.price = 'Въведете валидна цена (≥ 0)'
    const capacity = Number(form.capacity)
    if (!Number.isInteger(capacity) || capacity < 1) errors.capacity = 'Капацитетът трябва да е цяло число ≥ 1'
    if (form.description.trim().length < 10) errors.description = 'Описанието трябва да е поне 10 символа'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        name: form.name.trim(),
        type: form.type.trim(),
        price: Number(form.price),
        capacity: Number(form.capacity),
        size: form.size.trim(),
        bedType: form.bedType.trim(),
        description: form.description.trim(),
        amenities: form.amenities,
        images: form.images,
        available: form.available,
      }
      const res = await fetch('/api/admin/rooms', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        flash({ type: 'error', text: data.error || 'Грешка при запис' })
        return
      }
      setModalOpen(false)
      await loadData()
      flash({ type: 'success', text: editingId ? 'Стаята е обновена успешно' : 'Стаята е добавена успешно' })
    } catch (e) {
      console.error(e)
      flash({ type: 'error', text: 'Грешка при запис' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/rooms?id=${encodeURIComponent(deleteTarget.id)}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        flash({ type: 'error', text: data.error || 'Грешка при изтриване' })
        return
      }
      setDeleteTarget(null)
      await loadData()
      flash({ type: 'success', text: 'Стаята е изтрита' })
    } catch (e) {
      console.error(e)
      flash({ type: 'error', text: 'Грешка при изтриване' })
    } finally {
      setDeleting(false)
    }
  }

  async function toggleAvailability(room: HotelRoomFull) {
    // оптимистична промяна
    setRooms(prev => prev.map(r => (r.id === room.id ? { ...r, available: !r.available } : r)))
    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...room, available: !room.available }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error)
    } catch (e) {
      console.error(e)
      setRooms(prev => prev.map(r => (r.id === room.id ? { ...r, available: room.available } : r)))
      flash({ type: 'error', text: 'Неуспешна промяна на наличността' })
    }
  }

  /* ====== Снимки ====== */
  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('folder', 'rooms')
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (res.ok && data.ok && data.url) {
          setForm(prev => ({ ...prev, images: [...prev.images, data.url] }))
        } else {
          flash({ type: 'error', text: data.error || `Неуспешно качване: ${file.name}` })
        }
      }
    } catch (e) {
      console.error(e)
      flash({ type: 'error', text: 'Грешка при качване на снимка' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  /* ====== Удобства ====== */
  function addAmenity() {
    const value = amenityInput.trim()
    if (!value) return
    if (!form.amenities.includes(value)) {
      setForm(prev => ({ ...prev, amenities: [...prev.amenities, value] }))
    }
    setAmenityInput('')
  }

  /* ====== Часове ====== */
  async function saveInfo() {
    setSavingInfo(true)
    try {
      const res = await fetch('/api/hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ info }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        flash({ type: 'error', text: data.error || 'Грешка при запис на часовете' })
        return
      }
      flash({ type: 'success', text: 'Часовете са запазени' })
    } catch (e) {
      console.error(e)
      flash({ type: 'error', text: 'Грешка при запис на часовете' })
    } finally {
      setSavingInfo(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-sm text-white/50">Зареждане…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            Стаи ({rooms.length})
          </h2>
          <p className="text-sm text-white/40 mt-0.5">Управление на стаи, цени, снимки и наличности</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            aria-label="Обнови"
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-xl bg-primary hover:bg-red-500 text-sm font-bold text-white transition-colors cursor-pointer shadow-[0_0_24px_rgba(239,68,68,0.25)]"
          >
            <Plus className="w-4 h-4" />
            Добави стая
          </button>
        </div>
      </div>

      {/* Message */}
      {msg && (
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
      )}

      {/* Rooms grid */}
      {rooms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.12] p-12 text-center">
          <BedDouble className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 font-semibold mb-1">Няма добавени стаи</p>
          <p className="text-sm text-white/30 mb-5">Добавете първата стая, за да се покаже на сайта.</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-xl bg-primary hover:bg-red-500 text-sm font-bold text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Добави стая
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rooms.map(room => (
            <div
              key={room.id}
              className={`group rounded-2xl border overflow-hidden transition-colors duration-200 ${
                room.available
                  ? 'bg-white/[0.03] border-white/[0.07] hover:border-white/[0.14]'
                  : 'bg-white/[0.015] border-white/[0.05] opacity-75'
              }`}
            >
              {/* Photo */}
              <div className="relative h-40 bg-white/[0.03]">
                {room.images[0] ? (
                  <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-8 h-8 text-white/15" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">{room.type}</span>
                    <span className="block text-lg font-bold text-white leading-tight">{room.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xl font-black text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                      {room.price} €
                    </span>
                    <span className="block text-[10px] text-white/50 uppercase tracking-wider">на нощ</span>
                  </div>
                </div>
                {!room.available && (
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-[0.15em] bg-black/70 border border-white/15 text-white/70 rounded-full px-2.5 py-1">
                    Скрита от сайта
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/45">
                  <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{room.capacity} {room.capacity === 1 ? 'гост' : 'гости'}</span>
                  {room.size && <span className="inline-flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5" />{room.size}</span>}
                  {room.bedType && <span className="inline-flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5" />{room.bedType}</span>}
                </div>
                <p className="text-xs text-white/35 leading-relaxed line-clamp-2">{room.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <Toggle checked={room.available} onChange={() => toggleAvailability(room)} label={`Наличност: ${room.name}`} />
                    <span className="text-xs font-semibold text-white/50">{room.available ? 'Видима' : 'Скрита'}</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(room)}
                      aria-label={`Редактирай ${room.name}`}
                      className="w-11 h-11 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(room)}
                      aria-label={`Изтрий ${room.name}`}
                      className="w-11 h-11 flex items-center justify-center rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/[0.08] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Check-in / Check-out */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-bold text-white">Часове за настаняване</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Field label="Настаняване от" htmlFor="check-in">
            <input
              id="check-in"
              type="time"
              value={info.checkIn}
              onChange={e => setInfo(prev => ({ ...prev, checkIn: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Напускане до" htmlFor="check-out">
            <input
              id="check-out"
              type="time"
              value={info.checkOut}
              onChange={e => setInfo(prev => ({ ...prev, checkOut: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <button
            onClick={saveInfo}
            disabled={savingInfo}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {savingInfo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Запази часовете
          </button>
        </div>
      </div>

      {/* Create/Edit modal */}
      <Modal open={modalOpen} onClose={() => !saving && setModalOpen(false)} title={editingId ? 'Редакция на стая' : 'Нова стая'} wide>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Име на стаята *" htmlFor="room-name" error={formErrors.name}>
            <input
              id="room-name"
              type="text"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="напр. Двойна стая Делукс"
              className={inputClass}
            />
          </Field>
          <Field label="Тип *" htmlFor="room-type" error={formErrors.type}>
            <input
              id="room-type"
              type="text"
              value={form.type}
              onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
              placeholder="напр. Двойна, Апартамент…"
              className={inputClass}
            />
          </Field>
          <Field label="Цена на нощ (€) *" htmlFor="room-price" error={formErrors.price}>
            <input
              id="room-price"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={form.price}
              onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
              placeholder="35"
              className={inputClass}
            />
          </Field>
          <Field label="Капацитет (гости) *" htmlFor="room-capacity" error={formErrors.capacity}>
            <input
              id="room-capacity"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={form.capacity}
              onChange={e => setForm(prev => ({ ...prev, capacity: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Площ" htmlFor="room-size">
            <input
              id="room-size"
              type="text"
              value={form.size}
              onChange={e => setForm(prev => ({ ...prev, size: e.target.value }))}
              placeholder="напр. 24 m²"
              className={inputClass}
            />
          </Field>
          <Field label="Легла" htmlFor="room-beds">
            <input
              id="room-beds"
              type="text"
              value={form.bedType}
              onChange={e => setForm(prev => ({ ...prev, bedType: e.target.value }))}
              placeholder="напр. 1 голяма спалня"
              className={inputClass}
            />
          </Field>
          <Field label="Описание *" htmlFor="room-desc" error={formErrors.description} className="sm:col-span-2">
            <textarea
              id="room-desc"
              rows={3}
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Кратко описание на стаята, което ще се показва на сайта…"
              className={`${inputClass} resize-y min-h-[88px]`}
            />
          </Field>

          {/* Amenities */}
          <Field label="Удобства" htmlFor="room-amenity" className="sm:col-span-2">
            <div className="flex gap-2">
              <input
                id="room-amenity"
                type="text"
                value={amenityInput}
                onChange={e => setAmenityInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    addAmenity()
                  }
                }}
                placeholder="напр. Wi-Fi (Enter за добавяне)"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addAmenity}
                className="shrink-0 min-h-[44px] px-4 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-sm font-bold text-white transition-colors cursor-pointer"
              >
                Добави
              </button>
            </div>
            {form.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.amenities.map(a => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-1.5 text-xs font-medium text-white/80"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, amenities: prev.amenities.filter(x => x !== a) }))}
                      aria-label={`Премахни ${a}`}
                      className="text-white/40 hover:text-red-400 transition-colors cursor-pointer p-0.5 -mr-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          {/* Photos */}
          <Field label="Снимки" className="sm:col-span-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={e => handleFiles(e.target.files)}
              className="hidden"
              id="room-photos"
            />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {form.images.map((img, i) => (
                <div key={`${img}-${i}`} className="relative group/img aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.09] bg-white/[0.03]">
                  <img src={img} alt={`Снимка ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                    aria-label={`Премахни снимка ${i + 1}`}
                    className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center rounded-lg bg-black/70 text-white/70 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wider bg-black/70 text-white/80 rounded px-1.5 py-0.5">
                      Главна
                    </span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-[4/3] rounded-xl border border-dashed border-white/[0.15] hover:border-primary/50 hover:bg-primary/[0.04] flex flex-col items-center justify-center gap-1.5 text-white/40 hover:text-white/70 transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Качи</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-white/25 mt-2">JPG, PNG или WebP до 5MB. Първата снимка е главна.</p>
          </Field>

          {/* Availability */}
          <div className="sm:col-span-2 flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-3.5">
            <div>
              <p className="text-sm font-bold text-white">Видима на сайта</p>
              <p className="text-xs text-white/40 mt-0.5">Скритите стаи не се показват на публичните страници</p>
            </div>
            <Toggle checked={form.available} onChange={v => setForm(prev => ({ ...prev, available: v }))} label="Видима на сайта" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-white/[0.07]">
          <button
            onClick={() => setModalOpen(false)}
            disabled={saving}
            className="flex-1 min-h-[48px] rounded-xl border border-white/[0.1] text-sm font-semibold text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer disabled:opacity-50"
          >
            Отказ
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-red-500 text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-[0_0_24px_rgba(239,68,68,0.25)]"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editingId ? 'Запази промените' : 'Добави стаята'}
          </button>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        busy={deleting}
        title="Изтриване на стая"
        description={`Сигурни ли сте, че искате да изтриете „${deleteTarget?.name}“? Действието е необратимо и стаята веднага ще изчезне от сайта.`}
        confirmText="Изтрий стаята"
      />
    </div>
  )
}
