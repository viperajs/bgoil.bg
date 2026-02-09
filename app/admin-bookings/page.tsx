"use client"

import React, { useState, useEffect } from "react"
import { Trash2, CheckCircle, Clock, Search, ExternalLink, RefreshCw, Phone } from "lucide-react"
import Link from "next/link"

interface Booking {
  id: string
  fullName: string
  phone: string
  roomType: string
  checkIn: string
  checkOut: string
  callRequested: boolean
  preferredTime?: string
  totalPrice: string
  status: "New" | "Confirmed"
  createdAt: string
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  // Load Bookings
  const loadBookings = () => {
    try {
      const stored = localStorage.getItem("hotel_bookings")
      if (stored) {
        const parsed = JSON.parse(stored)
        // Sort by date desc
        parsed.sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setBookings(parsed)
      } else {
        setBookings([])
      }
    } catch (error) {
      console.error("Failed to load bookings", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  // Actions
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      const updated = bookings.filter((b) => b.id !== id)
      setBookings(updated)
      localStorage.setItem("hotel_bookings", JSON.stringify(updated))
    }
  }

  const handleToggleStatus = (id: string) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        return { ...b, status: b.status === "New" ? "Confirmed" : ("New" as "New" | "Confirmed") }
      }
      return b
    })
    setBookings(updated)
    localStorage.setItem("hotel_bookings", JSON.stringify(updated))
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to DELETE ALL bookings? This cannot be undone.")) {
      setBookings([])
      localStorage.removeItem("hotel_bookings")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Hotel Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/booking"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center gap-2"
              >
                Booking Page <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={handleClearAll}
                className="text-sm font-medium text-red-600 hover:text-red-900 bg-red-50 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors"
                disabled={bookings.length === 0}
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Bookings</h2>
            <p className="text-gray-500 mt-1">Manage room reservations and client requests</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="bg-blue-100 p-1.5 rounded">
              <RefreshCw className="w-4 h-4 text-blue-600 cursor-pointer" onClick={loadBookings} />
            </div>
            <span className="text-sm font-medium text-gray-600">Total: {bookings.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Client Info
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Room & Dates
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Pricing
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Requests
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{booking.fullName}</span>
                          <span className="text-gray-500 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" /> {booking.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{booking.roomType}</div>
                        <div className="text-gray-500 mt-1 text-xs bg-gray-100 px-2 py-1 rounded inline-block">
                          {booking.checkIn} — {booking.checkOut}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{booking.totalPrice} €</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Dep: {(parseFloat(booking.totalPrice) * 0.3).toFixed(2)} €
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.callRequested ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Call @ {booking.preferredTime || "Any time"}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${booking.status === "Confirmed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center gap-3">
                          <button
                            onClick={() => handleToggleStatus(booking.id)}
                            className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${booking.status === "New"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                          >
                            {booking.status === "New" ? "Confirm" : "Mark New"}
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-6">
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                Bookings submitted through the Client Booking Page will appear here immediately.
              </p>
              <div className="mt-6">
                <Link
                  href="/booking"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Test Booking
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}