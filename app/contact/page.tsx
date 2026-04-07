import type { Metadata } from "next"
import { companyInfo, contacts } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactBlock from "@/components/ContactBlock"
import { MapPin, Phone, Mail, Clock, Navigation, ArrowUpRight } from "lucide-react"
import * as motion from "motion/react-client"

export const metadata: Metadata = {
  title: "Контакти",
  description: `Свържете се с ${companyInfo.name}.`,
}

export default function ContactPage() {
  const workingHours = [
    { service: "Бензиностанция", hours: "24/7", always: true },
    { service: "Магазин", hours: "24/7", always: true },
    { service: "EasyPay каса", hours: "24/7", always: true },
    { service: "Хотел рецепция", hours: "24/7", always: true },
    { service: "Автосервиз", hours: "Пон-Пет: 08:00-18:00", always: false },
    { service: "Автомивка", hours: "24/7", always: true },
  ]

  const contactMethods = [
    {
      icon: Phone,
      title: "Обадете се",
      value: contacts.phoneMain,
      value2: contacts.phoneOwner2,
      link: `tel:${contacts.phoneMain}`,
      subtext: "Основна линия",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.2)",
    },
    {
      icon: Mail,
      title: "Пишете ни",
      value: contacts.email,
      link: `mailto:${contacts.email}`,
      subtext: "До 24 часа отговор",
      color: "#f97316",
      bg: "rgba(249,115,22,0.08)",
      border: "rgba(249,115,22,0.2)",
    },
    {
      icon: Navigation,
      title: "Посетете ни",
      value: contacts.address,
      link: contacts.mapsLink,
      subtext: "Навигация",
      target: "_blank" as const,
      color: "#f87171",
      bg: "rgba(248,113,113,0.08)",
      border: "rgba(248,113,113,0.2)",
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen text-white overflow-x-hidden">

        {/* Page Hero */}
        <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.07), transparent 65%)", filter: "blur(100px)" }} />
            <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(249,115,22,0.04), transparent)", filter: "blur(80px)" }} />
            <div className="absolute inset-0 opacity-[0.012]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }} />
          </div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Локация</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Свържете се <span className="text-gradient-primary">с Нас</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-white/35 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}
            >
              Винаги на разположение. 24 часа. 7 дни в седмицата.
            </motion.p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-12 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16" style={{ perspective: "1000px" }}>
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: 12, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="group p-8 rounded-2xl glass-depth neon-card-glow animated-gradient-border text-center cursor-pointer relative overflow-hidden hover-border-red"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${method.color}60, transparent)` }} />

                  {/* BG gradient */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${method.bg}, transparent 70%)` }} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-400 group-hover:scale-110"
                      style={{ background: method.bg, border: `1px solid ${method.border}` }}
                    >
                      <method.icon className="w-6 h-6 transition-colors duration-300" style={{ color: method.color }} />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 flex items-center justify-center gap-2">
                      {method.title}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity"
                        style={{ color: method.color }} />
                    </h3>

                    <a
                      href={method.link}
                      target={method.target}
                      rel={method.target ? "noopener noreferrer" : undefined}
                      className="text-base font-medium block mb-1 transition-colors hover:text-white"
                      style={{ color: method.color }}
                    >
                      {method.value}
                    </a>
                    {"value2" in method && method.value2 && (
                      <a
                        href={`tel:${method.value2}`}
                        className="text-sm font-medium block mb-2 transition-colors hover:text-white"
                        style={{ color: `${method.color}90` }}
                      >
                        {method.value2}
                      </a>
                    )}
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-mono)" }}>
                      {method.subtext}
                    </p>
                  </div>

                  {/* Corner glow */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, ${method.bg}, transparent)`, filter: "blur(20px)" }} />
                </motion.div>
              ))}
            </div>

            {/* Working Hours */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl glass-depth p-10 relative overflow-hidden mb-16"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Watermark icon */}
              <div className="absolute top-0 right-0 p-10 opacity-[0.025] pointer-events-none">
                <Clock className="w-64 h-64" />
              </div>

              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.35), rgba(249,115,22,0.2), transparent)" }} />

              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black">Работно Време</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
                {workingHours.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.1 + index * 0.06 }}
                    className="group flex justify-between items-center p-4 rounded-2xl transition-all duration-300 neon-card-glow cursor-default"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span className="font-bold text-white text-sm group-hover:text-white transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}>
                      {item.service}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.always && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                      )}
                      <span className="font-bold text-sm" style={{
                        color: item.always ? "#4ade80" : "#ef4444",
                        fontFamily: "var(--font-mono)",
                      }}>
                        {item.hours}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Map */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden"
              style={{ borderRadius: "1.5rem" }}
            >
              {/* Map frame with gradient border effect */}
              <div
                className="rounded-3xl p-3 h-[380px] sm:h-[460px] md:h-[520px] w-full relative"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(239,68,68,0.04)",
                }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-12 right-12 h-px z-10"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)" }} />

                {/* Map label badge */}
                <div
                  className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl"
                  style={{ background: "rgba(10,10,11,0.8)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">BG OIL — Враца</span>
                </div>

                <ContactBlock />
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
