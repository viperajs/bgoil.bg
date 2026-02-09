"use client"

import React, { useState, useEffect } from "react"
import { Check, Calendar, Phone, User, Clock, Info, MapPin, Wifi, Coffee, ChevronLeft, ChevronRight, Mail, Sparkles, Star, ArrowRight } from "lucide-react"
import { Maximize } from "lucide-react"
import { contacts } from "@/lib/config"

// Types (Preserved)
interface Room {
    id: string
    title: string
    titleEn: string
    price: number
    images: string[]
    size: string
    occupancy: string
    occupancyEn: string
    bedType: string
    bedTypeEn: string
    view: string
    viewEn: string
    description: string
    descriptionEn: string
    amenities: string[]
    amenitiesEn: string[]
}

// Initial Data (Preserved)
const ROOMS: Room[] = [
    {
        id: "single",
        title: "Единична стая",
        titleEn: "Single Room",
        price: 25,
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000"
        ],
        size: "18 m²",
        occupancy: "1 човек",
        occupancyEn: "1 person",
        bedType: "1 единично легло",
        bedTypeEn: "1 Single Bed",
        view: "Гледка към града",
        viewEn: "City View",
        description: "Перфектно за самостоятелни пътници. Уютно и ефективно пространство с удобно единично легло, модерно бюро за работа и самостоятелна баня. Насладете се на спокоен престой с всички необходими удобства.",
        descriptionEn: "Perfect for solo travelers. A cozy and efficient space featuring a comfortable single bed, modern work desk, and en-suite bathroom. Enjoy a quiet stay with all essential amenities.",
        amenities: ["Wi-Fi", "Климатик", "Телевизор", "Бюро", "Душ", "Тоалетни принадлежности"],
        amenitiesEn: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Work Desk", "Shower", "Toiletries"]
    },
    {
        id: "double",
        title: "Двойна стая",
        titleEn: "Double Room",
        price: 35,
        images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000"
        ],
        size: "24 m²",
        occupancy: "2 души",
        occupancyEn: "2 persons",
        bedType: "1 голяма спалня",
        bedTypeEn: "1 extra-large double bed",
        view: "Гледка Градина/Град",
        viewEn: "Garden/City View",
        description: "Идеално за двойки или бизнес пътници, които се нуждаят от повече пространство. Разполага с просторно двойно легло, кът за сядане и светъл модерен декор за релаксиращ престой.",
        descriptionEn: "Ideal for couples or business travelers who need more space. Features a spacious king-size bed, seating area, and bright modern decor to make your stay relaxing.",
        amenities: ["Wi-Fi", "Климатик", "Телевизор", "Кът за сядане", "Минибар", "Сешоар"],
        amenitiesEn: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Seating Area", "Minibar", "Hairdryer"]
    },
    {
        id: "triple",
        title: "Тройна стая",
        titleEn: "Triple Room",
        price: 45,
        images: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1000"
        ],
        size: "30 m²",
        occupancy: "3 души",
        occupancyEn: "3 persons",
        bedType: "1 единично, 1 двойно легло",
        bedTypeEn: "1 Single bed, 1 Large double bed",
        view: "Гледка Планина",
        viewEn: "Mountain View",
        description: "Чудесно за малки семейства или групи. Тази просторна стая предлага гъвкавост с множество опции за легла и достатъчно място за удобно придвижване.",
        descriptionEn: "Great for small families or groups. This spacious room offers flexibility with multiple bed options and ample room to move around comfortably.",
        amenities: ["Wi-Fi", "Климатик", "Телевизор", "Шумоизолация", "Гардероб", "Събуждане"],
        amenitiesEn: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Soundproofing", "Wardrobe", "Wake-up service"]
    },
    {
        id: "apartment",
        title: "Апартамент",
        titleEn: "Apartment",
        price: 50,
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1522771753035-1a5b6562f3a9?auto=format&fit=crop&q=80&w=1000"
        ],
        size: "45 m²",
        occupancy: "4 души",
        occupancyEn: "4 persons",
        bedType: "1 Спалня + Хол",
        bedTypeEn: "1 Bedroom + Living Room",
        view: "Панорамна гледка",
        viewEn: "Panoramic View",
        description: "Луксозен престой с отделна спалня и всекидневна. Нашите апартаменти предлагат усещане за дом далеч от дома с първокласно обзавеждане и спиращи дъха гледки към Врачанския балкан.",
        descriptionEn: "Luxury living with a separate bedroom and living area. Our apartments offer a home-away-from-home experience with premium furnishings and breathtaking views of the Vratsa mountains.",
        amenities: ["Wi-Fi", "Климатик", "2 Телевизора", "Диван", "Хладилник", "Балкон"],
        amenitiesEn: ["Free Wi-Fi", "Air Conditioning", "2 Flat-screen TVs", "Sofa", "Refrigerator", "Balcony"]
    },
]

export default function BookingPage() {
    // State
    const [rooms, setRooms] = useState<Room[]>(ROOMS)
    const [hotelInfo, setHotelInfo] = useState({ checkIn: "12:00", checkOut: "11:00" })
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        callRequested: false,
        preferredTime: "",
    })
    const [summary, setSummary] = useState({
        totalPrice: 0,
        deposit: 0,
        nights: 0,
    })
    const [showSuccess, setShowSuccess] = useState(false)
    const [hoveredRoom, setHoveredRoom] = useState<string | null>(null)

    // Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/hotel')
                if (!res.ok) throw new Error('Failed to fetch data')
                const data = await res.json()

                // Update Rooms with dynamic prices
                if (data.rooms && Array.isArray(data.rooms)) {
                    setRooms(prevRooms => prevRooms.map(room => {
                        const dynamicRoom = data.rooms.find((r: any) => r.name === room.title)
                        return dynamicRoom ? { ...room, price: dynamicRoom.price } : room
                    }))
                }

                // Update Hotel Info
                if (data.info) {
                    setHotelInfo(prev => ({ ...prev, ...data.info }))
                }
            } catch (error) {
                console.error("Error fetching hotel data:", error)
            }
        }
        fetchData()
    }, [])

    // Handlers
    const handleRoomSelect = (id: string) => {
        if (selectedRoomId === id) {
            setSelectedRoomId(null)
        } else {
            setSelectedRoomId(id)
            setCurrentImageIndex(0)
            window.scrollTo({ top: document.getElementById('details-panel')?.offsetTop! - 100, behavior: 'smooth' })
        }
    }

    const nextImage = (e: React.MouseEvent, max: number) => {
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev + 1) % max)
    }

    const prevImage = (e: React.MouseEvent, max: number) => {
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev - 1 + max) % max)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    // Calculation Effect
    useEffect(() => {
        if (!selectedRoomId || !formData.checkIn || !formData.checkOut) {
            setSummary({ totalPrice: 0, deposit: 0, nights: 0 })
            return
        }

        const start = new Date(formData.checkIn)
        const end = new Date(formData.checkOut)

        if (end <= start) {
            setSummary({ totalPrice: 0, deposit: 0, nights: 0 })
            return
        }

        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        const room = rooms.find((r) => r.id === selectedRoomId)
        if (room) {
            const total = diffDays * room.price
            setSummary({
                totalPrice: total,
                deposit: total * 0.3,
                nights: diffDays,
            })
        }
    }, [selectedRoomId, formData.checkIn, formData.checkOut, rooms])

    // Submit Handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedRoomId) {
            alert("Моля, първо изберете стая")
            return
        }

        const room = rooms.find((r) => r.id === selectedRoomId)
        if (!room) return

        const bookingData = {
            id: Date.now().toString(),
            ...formData,
            roomType: `${room.title} (${room.titleEn})`,
            totalPrice: summary.totalPrice.toFixed(2),
            status: "New",
            createdAt: new Date().toISOString(),
        }

        try {
            const bookings = JSON.parse(localStorage.getItem("hotel_bookings") || "[]")
            bookings.push(bookingData)
            localStorage.setItem("hotel_bookings", JSON.stringify(bookings))
            setShowSuccess(true)
        } catch (error) {
            console.error("Error saving booking:", error)
            alert("Възникна грешка при запазване на резервацията. Моля опитайте отново.")
        }
    }

    const closeSuccess = () => {
        setShowSuccess(false)
        setFormData({
            fullName: "",
            phone: "",
            checkIn: "",
            checkOut: "",
            callRequested: false,
            preferredTime: "",
        })
        setSelectedRoomId(null)
    }

    const today = new Date().toISOString().split("T")[0]
    const selectedRoom = rooms.find(r => r.id === selectedRoomId)

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary/30">
            {/* Vibrant Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen opacity-20"></div>
            </div>

            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]"></div>
                </div>

                <div className="container relative z-10 px-4 text-center mt-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium tracking-wider uppercase text-white/90">Premium Accommodation</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                        Хотел <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-primary">BG OIL</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Лукс и комфорт в сърцето на Враца. Идеалният избор за вашия престой.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Rooms List */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Нашите Стаи
                            </h2>
                            <span className="text-xs text-white/40 uppercase tracking-widest">{rooms.length} опции</span>
                        </div>

                        <div className="flex flex-col gap-5">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    onClick={() => handleRoomSelect(room.id)}
                                    className={`
                                        group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500
                                        ${selectedRoomId === room.id
                                            ? "ring-2 ring-primary shadow-[0_0_30px_-5px_var(--primary)] scale-[1.02] z-10"
                                            : "hover:scale-[1.01] hover:shadow-xl border border-white/5 bg-white/5 backdrop-blur-sm"}
                                    `}
                                >
                                    {/* Glass Background */}
                                    <div className={`absolute inset-0 transition-opacity duration-300 ${selectedRoomId === room.id ? "bg-black/80" : "bg-black/40 group-hover:bg-black/60"}`}></div>

                                    {/* Image Background */}
                                    <div className="absolute inset-0 -z-10">
                                        <img
                                            src={room.images[0]}
                                            alt={room.title}
                                            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="relative p-5 h-40 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{room.title}</h3>
                                                <p className="text-xs text-white/60 font-medium tracking-wide">{room.titleEn}</p>
                                            </div>
                                            {selectedRoomId === room.id && (
                                                <div className="bg-primary text-black p-1.5 rounded-full shadow-lg shadow-primary/50 animate-in zoom-in duration-300">
                                                    <Check className="w-4 h-4 stroke-[3]" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-end border-t border-white/10 pt-3 mt-2">
                                            <div className="flex items-center gap-3 text-xs text-white/70">
                                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {room.occupancy}</span>
                                                <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {room.size}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-2xl font-bold text-white group-hover:text-primary transition-colors">{room.price}€</span>
                                                <span className="text-[10px] text-white/50 uppercase tracking-widest">на вечер</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CENTER & RIGHT: Linked Details & Booking */}
                    <div id="details-panel" className="lg:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Details Panel */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent rounded-[2rem] blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                            <div className="relative bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl min-h-[600px] flex flex-col transition-all duration-300">
                                {selectedRoom ? (
                                    <div className="flex flex-col h-full animate-in fade-in duration-500">
                                        {/* Cinematic Header */}
                                        <div className="relative h-64 w-full group/carousel overflow-hidden">
                                            <img
                                                src={selectedRoom.images[currentImageIndex]}
                                                alt={selectedRoom.title}
                                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30"></div>

                                            {/* Navigation */}
                                            <button
                                                onClick={(e) => prevImage(e, selectedRoom.images.length)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-primary hover:text-black transition-all backdrop-blur-md opacity-100 translate-x-0 lg:opacity-0 lg:-translate-x-4 lg:group-hover/carousel:opacity-100 lg:group-hover/carousel:translate-x-0 duration-300"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={(e) => nextImage(e, selectedRoom.images.length)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-primary hover:text-black transition-all backdrop-blur-md opacity-100 translate-x-0 lg:opacity-0 lg:translate-x-4 lg:group-hover/carousel:opacity-100 lg:group-hover/carousel:translate-x-0 duration-300"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>

                                            {/* Dots */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                {selectedRoom.images.map((_, idx) => (
                                                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-6 bg-primary" : "w-1.5 bg-white/30"}`} />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="mb-6">
                                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-1">{selectedRoom.title}</h2>
                                                <p className="text-sm text-white/40 italic">{selectedRoom.titleEn}</p>
                                            </div>

                                            <p className="text-white/80 leading-relaxed mb-8 text-sm border-l-2 border-primary/50 pl-4 py-1">
                                                {selectedRoom.description}
                                            </p>

                                            <div className="space-y-6 mt-auto">
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">Удобства / Amenities</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedRoom.amenities.map((amenity, i) => (
                                                            <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/90 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all cursor-default">
                                                                {amenity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-12 text-center text-white/40 space-y-6">
                                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                                            <Info className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-medium text-white mb-2">Изберете стая</h3>
                                            <p className="text-sm max-w-[200px] mx-auto">Кликнете върху стая от лявото меню за да видите снимки и детайли</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="relative">
                            <div className="bg-[#121212] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl sticky top-24">
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                        <h2 className="text-xl font-bold flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            Резервация
                                        </h2>
                                        {selectedRoom && (
                                            <div className="text-right animate-in slide-in-from-right-4">
                                                <span className="text-xs text-white/40 block uppercase tracking-widest">Цена</span>
                                                <span className="text-xl font-bold text-primary">{selectedRoom.price}€</span>
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-4">
                                            <div className="group relative">
                                                <input
                                                    required
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    placeholder="Name"
                                                    id="name"
                                                />
                                                <label htmlFor="name" className="absolute left-4 top-3.5 text-white/40 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#121212] peer-focus:px-1 pointer-events-none">
                                                    Име и Фамилия
                                                </label>
                                            </div>

                                            <div className="group relative">
                                                <input
                                                    required
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    placeholder="Phone"
                                                    id="phone"
                                                />
                                                <label htmlFor="phone" className="absolute left-4 top-3.5 text-white/40 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#121212] peer-focus:px-1 pointer-events-none">
                                                    Телефон
                                                </label>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-white/50 ml-1">Настаняване</label>
                                                    <input
                                                        required
                                                        type="date"
                                                        name="checkIn"
                                                        min={today}
                                                        value={formData.checkIn}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-white/50 ml-1">Напускане</label>
                                                    <input
                                                        required
                                                        type="date"
                                                        name="checkOut"
                                                        min={formData.checkIn || today}
                                                        value={formData.checkOut}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="callRequested"
                                                        checked={formData.callRequested}
                                                        onChange={handleInputChange}
                                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/5 checked:border-primary checked:bg-primary transition-all"
                                                    />
                                                    <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                                                </div>
                                                <span className="text-sm text-white/80 group-hover:text-white transition-colors">Желая обаждане за потвърждение</span>
                                            </label>

                                            {formData.callRequested && (
                                                <div className="mt-3 pl-8 animate-in slide-in-from-top-2">
                                                    <input
                                                        type="time"
                                                        name="preferredTime"
                                                        value={formData.preferredTime}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Dynamic Summary */}
                                        <div className={`transition-all duration-500 ease-in-out ${selectedRoomId ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                            <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white/60">{summary.nights} нощувки</span>
                                                    <span className="font-medium text-white">{summary.totalPrice.toFixed(2)} €</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-primary">
                                                    <span>Депозит (30%)</span>
                                                    <span>{summary.deposit.toFixed(2)} €</span>
                                                </div>
                                                <div className="h-px bg-primary/20 my-2"></div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-white">ОБЩО</span>
                                                    <span className="text-2xl font-black text-primary">{summary.totalPrice.toFixed(2)} €</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!selectedRoomId}
                                            className="w-full group relative overflow-hidden py-4 px-6 bg-white text-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-orange-300 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                ПОТВЪРДИ РЕЗЕРВАЦИЯТА
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </button>
                                    </form>

                                    {/* Info Extras */}
                                    {hotelInfo && (
                                        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Настаняване</p>
                                                <p className="text-sm font-bold text-white/80">{hotelInfo.checkIn}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Напускане</p>
                                                <p className="text-sm font-bold text-white/80">{hotelInfo.checkOut}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Info Compact */}
                            <div className="mt-6 bg-[#121212] rounded-2xl border border-white/5 p-5 shadow-lg">
                                <h3 className="font-bold text-white text-sm mb-4 px-2">Контакти</h3>
                                <div className="space-y-2">
                                    <a href={`tel:${contacts.phoneMain}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-sm text-white/60 hover:text-primary group">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary mobile-icon-transition group-hover:text-black">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        {contacts.phoneMain}
                                    </a>
                                    <a href={`mailto:${contacts.email}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-sm text-white/60 hover:text-primary group">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary mobile-icon-transition group-hover:text-black">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        {contacts.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#121212] border border-white/10 rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Confetti/Glow */}
                        <div className="absolute inset-0 bg-primary/5"></div>
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full"></div>

                        <div className="relative z-10">
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 mb-6 shadow-lg shadow-green-500/20">
                                <Check className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-3">Готово!</h3>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                Вашата заявка за <span className="text-primary font-medium">{selectedRoom?.title}</span> е изпратена успешно.
                            </p>
                            <button
                                onClick={closeSuccess}
                                className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-primary hover:scale-[1.02] transition-all"
                            >
                                Супер
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
