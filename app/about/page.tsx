import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { companyInfo } from "@/lib/config"
import { Users, Award, Clock, Shield, Heart, Sparkles, Zap, Wrench, CreditCard, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import * as motion from "motion/react-client"

export const metadata: Metadata = {
  title: "За нас",
  description: `Научете повече за ${companyInfo.name}.`,
}

export default function AboutPage() {
  const values = [
    { icon: Award, title: "Качество", description: "Предлагаме само най-качествени горива и услуги на европейски стандарт", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
    { icon: Users, title: "Клиентоориентираност", description: "Нашите клиенти са в центъра на всичко, което правим", color: "#f97316", bg: "rgba(249,115,22,0.08)" },
    { icon: Clock, title: "Надеждност", description: "24/7 обслужване и винаги готови да помогнем", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
    { icon: Shield, title: "Сигурност", description: "Най-високи стандарти за безопасност и качество", color: "#f87171", bg: "rgba(248,113,113,0.08)" },
    { icon: Heart, title: "Грижа", description: "Грижим се за нашите клиенти, общността и околната среда", color: "#f97316", bg: "rgba(249,115,22,0.08)" },
    { icon: Zap, title: "Иновации", description: "Постоянно инвестираме в нови технологии и подобрения", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  ]

  const additionalServices = [
    {
      title: "Автосервиз и автокозметика",
      description: "Работим с доверени майстори, а аз лично следя сервизът да остава практичен, честен и винаги с налични части за спешни ремонти.",
      icon: Wrench,
      iconColor: "#60A5FA",
      borderColor: "rgba(96,165,250,0.15)",
      glowColor: "rgba(96,165,250,0.08)",
      topAccent: "rgba(96,165,250,0.4)",
      list: [
        "Авточасти и сервиз с бърза диагностика и монтаж на оригинални и алтернативни компоненти",
        "Автобои и консумативи за локални ремонти или цялостно възстановяване на автомобила",
        "Гуми и машинно изправяне на джанти с модерна баланс машина и гаранция за праволинейност",
        "Камера за боядисване под наем за професионалисти, които искат контрол върху резултата",
        "Автомивка на самообслужване за финалното полиране преди път",
      ],
    },
    {
      title: "EasyPay каса",
      description: "На разположение е EasyPay каса за бързо и удобно плащане на различни сметки и услуги без излишно губене на време.",
      icon: CreditCard,
      iconColor: "#f97316",
      borderColor: "rgba(249,115,22,0.15)",
      glowColor: "rgba(249,115,22,0.08)",
      topAccent: "rgba(249,115,22,0.4)",
      list: [
        "Плащане на сметки за ток, вода, телефон и интернет",
        "Плащане на данъци и такси",
        "Попълване на мобилни кредити",
        "Плащане на застраховки",
        "Достъпно 24/7 за вашето удобство",
      ],
    },
  ]

  const stats = [
    { value: "24/7", label: "Обслужване" },
    { value: "100%", label: "Качество" },
    { value: "5+", label: "Услуги" },
    { value: "Враца", label: "Локация" },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen text-white overflow-x-hidden">

        {/* Page Hero */}
        <section className="relative min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden py-8 sm:py-0">
          {/* Layered background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/fuel-station-reference.png"
              alt="BG OIL Бензиностанция"
              fill
              className="object-cover opacity-15"
              priority
            />
            {/* Multiple gradient overlays for depth */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,5,8,0.85) 0%, rgba(5,5,8,0.7) 50%, rgba(5,5,8,1) 100%)" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.08), transparent 60%)" }} />
          </div>

          {/* Floating ambient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden sm:block">
            <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full float"
              style={{ background: "radial-gradient(circle, rgba(239,68,68,0.06), transparent)", filter: "blur(60px)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full float"
              style={{ background: "radial-gradient(circle, rgba(249,115,22,0.05), transparent)", filter: "blur(50px)", animationDelay: "2s" }} />
          </div>

          <div className="container mx-auto relative z-10 px-4 text-center mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Нашата история</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight"
            >
              Повече от <br className="hidden sm:block" /> <span className="text-gradient-primary">Бензиностанция</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-white/35 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}
            >
              История за качество, доверие и стремеж към съвършенство в сърцето на Враца.
            </motion.p>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #050508)" }} />
        </section>

        {/* Mission */}
        <section className="py-20 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(239,68,68,0.05), transparent)", filter: "blur(80px)" }} />
          </div>

          <div className="container px-4 mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">
              {/* Text side */}
              <motion.div
                initial={{ opacity: 0, x: -50, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                    style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">Мисия</span>
                  </div>
                  <h2 className="text-4xl font-bold leading-tight">
                    Мисията на <span className="text-primary">BG OIL</span>
                  </h2>
                </div>

                <div className="space-y-5">
                  {[
                    "В свят на компромиси, ние избираме качеството. Нашата цел не е просто да напълним резервоара ви, а да осигурим спокойствие на пътя. От създаването си, BG OIL се гради върху честност, иновации и уважение към всеки клиент.",
                    "Вярваме, че всяко зареждане е възможност да покажем какво означава истинско обслужване — бързо, коректно и с внимание към детайла. Затова инвестираме в хора, технологии и среда, която прави разликата.",
                  ].map((text, i) => (
                    <div key={i} className="relative pl-6"
                      style={{ borderLeft: "2px solid rgba(239,68,68,0.25)" }}>
                      <div className="absolute left-0 top-2 w-2 h-2 rounded-full -translate-x-[5px]"
                        style={{ background: "rgba(239,68,68,0.5)" }} />
                      <p className="text-base text-white/40 leading-relaxed"
                        style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                      className="group p-5 rounded-2xl glass-depth neon-card-glow cursor-default"
                    >
                      <div className="text-2xl font-black text-primary mb-1">{stat.value}</div>
                      <div className="text-xs text-white/30 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Checklist */}
                <div className="pt-2 space-y-3">
                  {[
                    "Горива на европейско качество",
                    "Хотел, автосервиз и автомивка",
                    "EasyPay каса 24/7",
                    "BG OIL CLUB карта с отстъпки",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      </div>
                      <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors"
                        style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Image side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, rotateY: -8 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative min-h-[400px] lg:min-h-0 rounded-3xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(239,68,68,0.05)",
                  transformStyle: "preserve-3d",
                }}
              >
                <Image
                  src="/fuel-station-reference.png"
                  alt="BG OIL Мисия"
                  fill
                  className="object-cover"
                />
                {/* Gradient overlays for depth */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,8,0.85) 0%, rgba(5,5,8,0.2) 60%, transparent 100%)" }} />
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(239,68,68,0.06), transparent 60%)" }} />

                {/* Quote card */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="glass-depth rounded-2xl p-5"
                    style={{ border: "1px solid rgba(239,68,68,0.15)" }}>
                    <div className="text-red-400 text-3xl font-black leading-none mb-2" style={{ fontFamily: "Georgia, serif" }}>&ldquo;</div>
                    <p className="text-white font-bold text-base italic leading-relaxed">
                      Качеството е нашата визитна картичка.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-6 h-px bg-red-500/40" />
                      <span className="text-xs text-white/30 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>BG OIL</span>
                    </div>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(249,115,22,0.15), transparent)", filter: "blur(12px)" }} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.008)" }}>
          {/* Top section line */}
          <div className="absolute top-0 left-0 right-0 section-divider" />
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }} />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.04), transparent)", filter: "blur(80px)" }} />
          </div>

          <div className="container px-4 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Принципи</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4">Нашите Ценности</h2>
              <p className="text-white/30 text-base"
                style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                Принципите, които ни водят напред
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: "1000px" }}>
              {values.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, rotateX: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="group p-8 rounded-2xl glass-depth neon-card-glow animated-gradient-border cursor-default hover-border-red"
                >
                  {/* Icon */}
                  <div
                    className="w-13 h-13 rounded-xl flex items-center justify-center mb-6 transition-all duration-400 group-hover:scale-110"
                    style={{
                      width: "52px",
                      height: "52px",
                      background: val.bg,
                      border: `1px solid ${val.color}25`,
                    }}
                  >
                    <val.icon className="w-5 h-5 transition-colors duration-300"
                      style={{ color: val.color }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-3 transition-colors duration-300 group-hover:text-white flex items-center gap-2">
                    {val.title}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity"
                      style={{ color: val.color }} />
                  </h3>
                  <p className="text-white/35 text-sm leading-relaxed group-hover:text-white/55 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                    {val.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: `linear-gradient(90deg, transparent, ${val.color}50, transparent)` }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.035), transparent)", filter: "blur(100px)" }} />
          </div>

          <div className="container px-4 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">На ваше разположение</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4">Допълнителни Услуги</h2>
              <p className="text-white/30 max-w-2xl mx-auto text-base"
                style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                На място ще намерите пълноценен автосервиз и EasyPay каса, за да продължите пътя си с обслужен автомобил и без излишно губене на време.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {additionalServices.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50, rotateX: 8, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75, delay: 0.12 * idx, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className={`group p-8 md:p-10 rounded-3xl glass-depth neon-card-glow animated-gradient-border relative overflow-hidden cursor-default ${idx === 0 ? "hover-border-blue" : "hover-border-orange"}`}
                >
                  {/* Background icon watermark */}
                  <div className="absolute top-0 right-0 p-10 opacity-[0.025] group-hover:opacity-[0.055] transition-opacity duration-700 pointer-events-none">
                    <service.icon className="w-40 h-40" />
                  </div>

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${service.topAccent}, transparent)` }} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-400 group-hover:scale-110"
                      style={{
                        background: service.glowColor,
                        border: `1px solid ${service.borderColor}`,
                      }}
                    >
                      <service.icon className="w-6 h-6" style={{ color: service.iconColor }} />
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
                      {service.title}
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-40 transition-opacity"
                        style={{ color: service.iconColor }} />
                    </h3>
                    <p className="text-white/35 mb-8 leading-relaxed text-sm"
                      style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                      {service.description}
                    </p>

                    <ul className="space-y-3">
                      {service.list.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                          className="flex items-start gap-3 group/item"
                        >
                          <div className="mt-1.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover/item:scale-110"
                            style={{ background: service.glowColor, border: `1px solid ${service.borderColor}` }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: service.iconColor }} />
                          </div>
                          <span className="text-white/45 text-sm group-hover/item:text-white/65 transition-colors"
                            style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                            {item}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Corner glow */}
                  <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${service.glowColor}, transparent)`, filter: "blur(30px)" }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
