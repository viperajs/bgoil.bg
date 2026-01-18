'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, Phone, Mail, Users, MessageSquare, CheckCircle2, AlertCircle, Loader2, Hotel } from 'lucide-react'
import type { HotelRoom } from '@/lib/types'

interface ReservationFormProps {
  rooms: HotelRoom[]
}

export default function ReservationForm({ rooms }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    specialRequests: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [nights, setNights] = useState(0)

  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate && formData.roomType) {
      const checkIn = new Date(formData.checkInDate)
      const checkOut = new Date(formData.checkOutDate)
      const diffTime = checkOut.getTime() - checkIn.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 0) {
        const selectedRoom = rooms.find((r) => r.name === formData.roomType)
        if (selectedRoom) {
          setNights(diffDays)
          setTotalPrice(selectedRoom.price * diffDays)
        }
      } else {
        setNights(0)
        setTotalPrice(0)
      }
    }
  }, [formData.checkInDate, formData.checkOutDate, formData.roomType, rooms])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const checkIn = new Date(formData.checkInDate)
      const checkOut = new Date(formData.checkOutDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (checkIn < today) {
        setMessage({ type: 'error', text: 'Датата на настаняване не може да бъде в миналото' })
        setLoading(false)
        return
      }

      if (checkOut <= checkIn) {
        setMessage({ type: 'error', text: 'Датата на напускане трябва да е след датата на настаняване' })
        setLoading(false)
        return
      }

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalPrice,
        }),
      })

      const data = await response.json()

      if (data.ok) {
        setMessage({
          type: 'success',
          text: `Резервацията е приета успешно! Номер: ${data.reservation.id}`,
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          roomType: '',
          checkInDate: '',
          checkOutDate: '',
          guests: 1,
          specialRequests: '',
        })
        setTotalPrice(0)
        setNights(0)
      } else {
        setMessage({ type: 'error', text: data.error || 'Грешка при създаване на резервация' })
      }
    } catch (error) {
      console.error('Reservation error:', error)
      setMessage({ type: 'error', text: 'Грешка при връзка със сървъра' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Card className="shadow-lg border-2 border-border bg-gradient-card">
      <CardHeader className="bg-muted/30 border-b border-border">
        <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Hotel className="w-6 h-6 text-primary" />
          </div>
          Резервационна форма
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Съобщение */}
          {message && (
            <div
              className={`p-4 rounded-xl border-2 ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-primary/10 border-primary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
                )}
                <p className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-500' : 'text-primary'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          )}

          {/* Име */}
          <div>
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-bold text-card-foreground mb-2">
              <User className="w-4 h-4 text-primary" />
              Име и фамилия <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Иван Петров"
            />
          </div>

          {/* Email и Телефон */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-card-foreground mb-2">
                <Mail className="w-4 h-4 text-primary" />
                Имейл <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="ivan@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="flex items-center gap-2 text-sm font-bold text-card-foreground mb-2">
                <Phone className="w-4 h-4 text-primary" />
                Телефон <span className="text-primary">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="+359 888 123 456"
              />
            </div>
          </div>

          {/* Тип стая */}
          <div>
            <label htmlFor="roomType" className="flex items-center gap-2 text-sm font-bold text-card-foreground mb-2">
              <Hotel className="w-4 h-4 text-primary" />
              Тип стая <span className="text-primary">*</span>
            </label>
            <select
              id="roomType"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-card-foreground focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="" className="bg-card text-card-foreground">Изберете тип стая</option>
              {rooms.map((room) => (
                <option key={room.name} value={room.name} className="bg-card text-card-foreground">
                  {room.name} - {room.price}€/нощ
                </option>
              ))}
            </select>
          </div>

          {/* Дати */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="checkInDate" className="flex items-center gap-2 text-sm font-bold text-card-foreground mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                Дата на настаняване <span className="text-primary">*</span>
              </label>
              <input
                type="date"
                id="checkInDate"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                min={today}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-card-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="checkOutDate" className="flex items-center gap-2 text-sm font-bold text-card-foreground mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                Дата на напускане <span className="text-primary">*</span>
              </label>
              <input
                type="date"
                id="checkOutDate"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                min={formData.checkInDate || today}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-card-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Брой гости */}
          <div>
            <label htmlFor="guests" className="flex items-center gap-2 text-sm font-bold text-card-foreground mb-2">
              <Users className="w-4 h-4 text-primary" />
              Брой гости <span className="text-primary">*</span>
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              max="10"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-card-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Специални изисквания */}
          <div>
            <label htmlFor="specialRequests" className="flex items-center gap-2 text-sm font-bold text-card-foreground mb-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Специални изисквания
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              placeholder="Има ли нещо специално, което искате да ни съобщите?"
            />
          </div>

          {/* Обобщение на цената */}
          {nights > 0 && totalPrice > 0 && (
            <div className="bg-primary/10 border-2 border-primary/30 p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Брой нощувки: <span className="font-bold text-card-foreground">{nights}</span></p>
                  <p className="text-sm text-muted-foreground">Обща цена:</p>
                  <p className="text-3xl font-bold text-primary mt-1">{totalPrice.toFixed(2)} €</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
              </div>
            </div>
          )}

          {/* Бутон за изпращане */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary text-white py-6 text-lg font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Изпращане...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Резервирай сега
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
