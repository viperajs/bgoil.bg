import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { companyInfo } from "@/lib/config"
import { Users, Award, Clock, Shield, Heart, Sparkles, Zap, Wrench, CreditCard } from "lucide-react"
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
      iconColor: "text-blue-400",
      bgGradient: "from-blue-500/10 to-blue-600/[0.03]",
      borderColor: "border-blue-500/15",
      list: [
        "Авточасти и сервиз с бърза диагностика и монтаж на оригинални и алтернативни компоненти",
        "Автобои и консумативи за локални ремонти или цялостно възстановяване на автомобила",
        "Гуми и машинно изправяне на джанти с модерна баланс машина и гаранция за праволинейност",
        "Камера за боядисване под наем за професионалисти, които искат контрол върху резултата",
        "Автомивка на самообслужване за финалното полиране преди път"
      ],
      dotColor: "bg-blue-400",
      dotBg: "bg-blue-500/10"
    },
    {
      title: "EasyPay каса",
      description: "На разположение е EasyPay каса за бързо и удобно плащане на различни сметки и услуги без излишно губене на време.",
      icon: CreditCard,
      iconColor: "text-orange-400",
      bgGradient: "from-orange-500/10 to-orange-600/[0.03]",
      borderColor: "border-orange-500/15",
      list: [
        "Плащане на сметки за ток, вода, телефон и интернет",
        "Плащане на данъци и такси",
        "Попълване на мобилни кредити",
        "Плащане на застраховки",
        "Достъпно 24/7 за вашето удобство"
      ],
      dotColor: "bg-orange-400",
      dotBg: "bg-orange-500/10"
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen text-white overflow-x-hidden">

        {/* Hero */}
        <section className="relative h-[55vh] min-h-[450px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/fuel-station-reference.png"
              alt="Background"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/90 via-[#050508]/85 to-[#050508]"></div>
          </div>

          <div className="container relative z-10 px-4 text-center mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8 backdrop-blur-xl"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Нашата история</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-8xl font-black mb-6 tracking-tight"
            >
              Повече от <br /> <span className="text-gradient-primary">Бензиностанция</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-white/35 max-w-2xl mx-auto leading-relaxed"
            >
              История за качество, доверие и стремеж към съвършенство в сърцето на Враца.
            </motion.p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 relative">
          <div className="container px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-bold leading-tight">
                  Мисията на <span className="text-primary">BG OIL</span>
                </h2>
                <p className="text-base text-white/35 leading-relaxed border-l-2 border-primary/20 pl-6">
                  В свят на компромиси, ние избираме качеството. Нашата цел не е просто да напълним резервоара ви, а да осигурим спокойствие на пътя. От създаването си, BG OIL се гради върху честност, иновации и уважение към всеки клиент.
                </p>
                <p className="text-base text-white/35 leading-relaxed border-l-2 border-primary/20 pl-6">
                  Вярваме, че всяко зареждане е възможност да покажем какво означава истинско обслужване — бързо, коректно и с внимание към детайла. Затова инвестираме в хора, технологии и среда, която прави разликата.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-2xl font-black text-primary mb-1">24/7</div>
                    <div className="text-xs text-white/30 uppercase tracking-wider">Обслужване</div>
                  </div>
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-2xl font-black text-primary mb-1">100%</div>
                    <div className="text-xs text-white/30 uppercase tracking-wider">Качество</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-square rounded-3xl overflow-hidden border border-white/[0.05] bg-white/[0.02]"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden m-2">
                  <Image
                    src="/fuel-station-reference.png"
                    alt="Mission Background"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-white font-bold text-lg italic leading-relaxed">&ldquo;Качеството е нашата визитна картичка.&rdquo;</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-28 relative bg-white/[0.01]">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-6">Нашите Ценности</h2>
              <p className="text-white/30 text-base">Принципите, които ни водят напред</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center mb-6 group-hover:bg-primary/[0.1] group-hover:border-primary/20 transition-all duration-300">
                    <val.icon className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">{val.title}</h3>
                  <p className="text-white/30 text-sm leading-relaxed">{val.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/[0.03] blur-[120px] rounded-full pointer-events-none"></div>

          <div className="container px-4 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-6">Допълнителни Услуги</h2>
              <p className="text-white/30 max-w-2xl mx-auto text-base">
                На място ще намерите пълноценен автосервиз и EasyPay каса, за да продължите пътя си с обслужен автомобил и без излишно губене на време.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {additionalServices.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15 * idx }}
                  className="group p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none">
                    <service.icon className="w-40 h-40" />
                  </div>

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.bgGradient} flex items-center justify-center mb-8 border ${service.borderColor}`}>
                      <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{service.title}</h3>
                    <p className="text-white/30 mb-8 leading-relaxed text-sm">
                      {service.description}
                    </p>

                    <ul className="space-y-3">
                      {service.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className={`mt-1.5 w-4 h-4 rounded-full ${service.dotBg} flex items-center justify-center shrink-0`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${service.dotColor}`}></div>
                          </div>
                          <span className="text-white/50 text-sm">{item}</span>
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
