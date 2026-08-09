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
    { icon: Award, title: "Качество", description: "Предлагаме само най-качествени горива и услуги на европейски стандарт" },
    { icon: Users, title: "Клиентоориентираност", description: "Нашите клиенти са в центъра на всичко, което правим" },
    { icon: Clock, title: "Надеждност", description: "24/7 обслужване и винаги готови да помогнем" },
    { icon: Shield, title: "Сигурност", description: "Най-високи стандарти за безопасност и качество" },
    { icon: Heart, title: "Грижа", description: "Грижим се за нашите клиенти, общността и околната среда" },
    { icon: Zap, title: "Иновации", description: "Постоянно инвестираме в нови технологии и подобрения" },
  ]

  const additionalServices = [
    {
      title: "Автосервиз и автокозметика",
      description: "Работим с доверени майстори, а аз лично следя сервизът да остава практичен, честен и винаги с налични части за спешни ремонти.",
      icon: Wrench,
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
      <main className="min-h-screen text-foreground overflow-x-hidden">

        {/* Page Hero */}
        <section className="relative min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden py-8 sm:py-0">
          <div className="absolute inset-0 z-0">
            <Image
              src="/fuel-station-reference.png"
              alt="BG OIL Бензиностанция"
              fill
              className="object-cover opacity-15"
              priority
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--background) 88%, transparent) 0%, color-mix(in srgb, var(--background) 72%, transparent) 50%, var(--background) 100%)' }} />
          </div>

          <div className="container mx-auto relative z-10 px-4 text-center mt-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-border bg-card/60 backdrop-blur-xl"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-caption uppercase text-muted-foreground">Нашата история</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-display text-foreground mb-6"
            >
              Повече от <br className="hidden sm:block" /> бензиностанция
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-body text-muted-foreground max-w-2xl mx-auto"
            >
              История за качество, доверие и стремеж към съвършенство в сърцето на Враца.
            </motion.p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--background))' }} />
        </section>

        {/* Mission */}
        <section className="py-20 relative overflow-hidden">
          <div className="container px-4 mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">
              {/* Text side */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border border-border bg-secondary">
                    <span className="text-caption uppercase text-brand-500">Мисия</span>
                  </div>
                  <h2 className="text-h2 text-foreground">
                    Мисията на <span className="text-brand-500">BG OIL</span>
                  </h2>
                </div>

                <div className="space-y-5">
                  {[
                    "В свят на компромиси, ние избираме качеството. Нашата цел не е просто да напълним резервоара ви, а да осигурим спокойствие на пътя. От създаването си, BG OIL се гради върху честност, иновации и уважение към всеки клиент.",
                    "Вярваме, че всяко зареждане е възможност да покажем какво означава истинско обслужване — бързо, коректно и с внимание към детайла. Затова инвестираме в хора, технологии и среда, която прави разликата.",
                  ].map((text, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-brand-500/30">
                      <p className="text-body text-muted-foreground">
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
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="p-5 rounded-lg border border-border bg-card hover-lift"
                    >
                      <div className="text-h3 font-mono text-brand-500 mb-1">{stat.value}</div>
                      <div className="text-caption uppercase text-muted-foreground">{stat.label}</div>
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
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full border border-brand-500/30 bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Image side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative min-h-[400px] lg:min-h-0 rounded-lg overflow-hidden border border-border"
              >
                <Image
                  src="/fuel-station-reference.png"
                  alt="BG OIL Мисия"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--background) 85%, transparent) 0%, color-mix(in srgb, var(--background) 20%, transparent) 60%, transparent 100%)' }} />

                {/* Quote card */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="rounded-lg border border-border bg-card/90 backdrop-blur-md p-5">
                    <p className="text-foreground font-bold text-base italic leading-relaxed">
                      &ldquo;Качеството е нашата визитна картичка.&rdquo;
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-6 h-px bg-brand-500/50" />
                      <span className="text-caption uppercase text-muted-foreground font-mono">BG OIL</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 relative overflow-hidden border-y border-border bg-card/30">
          <div className="container px-4 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-border bg-secondary">
                <span className="text-caption uppercase text-muted-foreground">Принципи</span>
              </div>
              <h2 className="text-h1 text-foreground mb-4">Нашите ценности</h2>
              <p className="text-body text-muted-foreground">
                Принципите, които ни водят напред
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group p-8 rounded-lg border border-border bg-card hover-lift"
                >
                  <div className="w-12 h-12 rounded-md border border-border bg-secondary flex items-center justify-center mb-6 text-brand-500">
                    <val.icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-h4 text-foreground mb-3 flex items-center gap-2">
                    {val.title}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 transition-opacity text-brand-500" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-24 relative overflow-hidden">
          <div className="container px-4 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-border bg-secondary">
                <span className="text-caption uppercase text-muted-foreground">На ваше разположение</span>
              </div>
              <h2 className="text-h1 text-foreground mb-4">Допълнителни услуги</h2>
              <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                На място ще намерите пълноценен автосервиз и EasyPay каса, за да продължите пътя си с обслужен автомобил и без излишно губене на време.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {additionalServices.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * idx, ease: [0.16, 1, 0.3, 1] }}
                  className="group p-8 md:p-10 rounded-lg border border-border bg-card hover-lift relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-md border border-border bg-secondary flex items-center justify-center mb-8 text-brand-500">
                      <service.icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-h3 text-foreground mb-4 flex items-center gap-3">
                      {service.title}
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-70 transition-opacity text-brand-500" />
                    </h3>
                    <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
                      {service.description}
                    </p>

                    <ul className="space-y-3">
                      {service.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1.5 w-4 h-4 rounded-full border border-brand-500/30 bg-brand-500/10 flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
