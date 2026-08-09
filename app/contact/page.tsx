import type { Metadata } from "next"
import { companyInfo, contacts } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactBlock from "@/components/ContactBlock"
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react"
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
    },
    {
      icon: Mail,
      title: "Пишете ни",
      value: contacts.email,
      link: `mailto:${contacts.email}`,
      subtext: "До 24 часа отговор",
    },
    {
      icon: Navigation,
      title: "Посетете ни",
      value: contacts.address,
      link: contacts.mapsLink,
      subtext: "Навигация",
      target: "_blank" as const,
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen text-foreground overflow-x-hidden">

        {/* Page Hero */}
        <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-border bg-card/60 backdrop-blur-xl"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-caption uppercase text-muted-foreground">Локация</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-display text-foreground mb-6"
            >
              Свържете се с нас
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-body text-muted-foreground max-w-2xl mx-auto"
            >
              Винаги на разположение. 24 часа. 7 дни в седмицата.
            </motion.p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-12 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={index}
                  href={method.link}
                  target={method.target}
                  rel={method.target ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group block p-8 rounded-lg border border-border bg-card hover-lift text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-md border border-border bg-secondary flex items-center justify-center text-brand-500 group-hover:border-brand-500/40 group-hover:bg-brand-500/10 transition-colors">
                    <method.icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-h4 text-foreground mb-3">
                    {method.title}
                  </h3>

                  <span className="text-base font-medium block mb-1 text-brand-500 group-hover:text-foreground transition-colors">
                    {method.value}
                  </span>
                  {"value2" in method && method.value2 && (
                    <span className="text-sm font-medium block mb-2 text-brand-500/70">
                      {method.value2}
                    </span>
                  )}
                  <p className="text-caption uppercase text-muted-foreground/60 font-mono">
                    {method.subtext}
                  </p>
                </motion.a>
              ))}
            </div>

            {/* Working Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border border-border bg-card p-10 mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-md border border-border bg-secondary flex items-center justify-center text-brand-500">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-h2 text-foreground">Работно време</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {workingHours.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="flex justify-between items-center p-4 rounded-lg border border-border bg-secondary/40 hover-lift"
                  >
                    <span className="font-bold text-foreground text-sm">
                      {item.service}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.always && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                      )}
                      <span className={`font-bold text-sm font-mono ${item.always ? "text-emerald-400" : "text-brand-500"}`}>
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden"
            >
              <div className="rounded-lg p-3 h-[380px] sm:h-[460px] md:h-[520px] w-full relative border border-border bg-card">
                {/* Map label badge */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/25 bg-background/80 backdrop-blur-xl">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500" />
                  </span>
                  <span className="text-caption uppercase text-muted-foreground">BG OIL — Враца</span>
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
