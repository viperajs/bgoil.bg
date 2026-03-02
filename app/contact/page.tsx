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
      target: "_blank" as const
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen text-white overflow-x-hidden">

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/[0.04] rounded-full blur-[150px] pointer-events-none"></div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8 backdrop-blur-xl"
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Локация</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Свържете се <span className="text-gradient-primary">с Нас</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-white/35 max-w-2xl mx-auto"
            >
              Винаги на разположение. 24 часа. 7 дни в седмицата.
            </motion.p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center group-hover:bg-primary/[0.1] group-hover:border-primary/20 transition-all duration-300">
                    <method.icon className="w-6 h-6 text-white/50 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{method.title}</h3>
                  <a
                    href={method.link}
                    target={method.target}
                    rel={method.target ? "noopener noreferrer" : undefined}
                    className="text-primary hover:text-primary-light transition-colors text-base font-medium block mb-2"
                  >
                    {method.value}
                  </a>
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">{method.subtext}</p>
                </motion.div>
              ))}
            </div>

            {/* Working Hours */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <Clock className="w-64 h-64" />
              </div>

              <h2 className="text-3xl font-black mb-10 text-center">Работно Време</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {workingHours.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 + (index * 0.05) }}
                    className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-primary/15 transition-colors duration-300"
                  >
                    <span className="font-bold text-white text-sm">{item.service}</span>
                    <span className="text-primary font-mono text-sm">{item.hours}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Map */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl border border-white/[0.05] p-3 h-[500px] w-full relative overflow-hidden bg-white/[0.02]"
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
