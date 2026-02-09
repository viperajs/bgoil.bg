import type { Metadata } from "next"
import { companyInfo, contacts } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactBlock from "@/components/ContactBlock"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Navigation, Sparkles } from "lucide-react"
import * as motion from "motion/react-client"

export const metadata: Metadata = {
  title: "Контакти",
  description: `Свържете се с ${companyInfo.name}.`,
}

export default function ContactPage() {
  const workingHours = [
    { service: "Бензиностанция", hours: "24/7" },
    { service: "Магазин", hours: "24/7" },
    { service: "EasyPay каса", hours: "24/7" },
    { service: "Хотел рецепция", hours: "24/7" },
    { service: "Автосервиз", hours: "Пон-Пет: 08:00-18:00" },
    { service: "Автомивка", hours: "24/7" },
  ]

  const contactMethods = [
    {
      icon: Phone,
      title: "Обадете се",
      value: contacts.phoneMain,
      link: `tel:${contacts.phoneMain}`,
      subtext: "Основна линия"
    },
    {
      icon: Mail,
      title: "Пишете ни",
      value: contacts.email,
      link: `mailto:${contacts.email}`,
      subtext: "До 24 часа отговор"
    },
    {
      icon: Navigation,
      title: "Посетете ни",
      value: contacts.address,
      link: contacts.mapsLink,
      subtext: "Навигация",
      target: "_blank"
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

        {/* Dynamic Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Локация</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Свържете се <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">с Нас</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-white/50 max-w-2xl mx-auto font-light"
            >
              Винаги на разположение. 24 часа. 7 дни в седмицата.
            </motion.p>
          </div>
        </section>

        {/* Quick Contact Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-8 group text-center hover:bg-white/5 transition-colors border border-white/5"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/20 transition-colors">
                    <method.icon className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                  <a
                    href={method.link}
                    target={method.target}
                    rel={method.target ? "noopener noreferrer" : undefined}
                    className="text-primary hover:text-white transition-colors text-lg font-medium block mb-2"
                  >
                    {method.value}
                  </a>
                  <p className="text-xs text-white/30 uppercase tracking-widest">{method.subtext}</p>
                </motion.div>
              ))}
            </div>

            {/* Working Hours */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Clock className="w-64 h-64" />
              </div>

              <h2 className="text-3xl font-black mb-10 text-center">Работно Време</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {workingHours.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + (index * 0.05) }}
                    className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors"
                  >
                    <span className="font-bold text-white">{item.service}</span>
                    <span className="text-primary font-mono">{item.hours}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card p-4 h-[500px] w-full relative overflow-hidden"
            >
              <ContactBlock />
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
