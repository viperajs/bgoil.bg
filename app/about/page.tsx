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
    {
      icon: Award,
      title: "Качество",
      description: "Предлагаме само най-качествени горива и услуги на европейски стандарт",
    },
    {
      icon: Users,
      title: "Клиентоориентираност",
      description: "Нашите клиенти са в центъра на всичко, което правим",
    },
    {
      icon: Clock,
      title: "Надеждност",
      description: "24/7 обслужване и винаги готови да помогнем",
    },
    {
      icon: Shield,
      title: "Сигурност",
      description: "Най-високи стандарти за безопасност и качество",
    },
    {
      icon: Heart,
      title: "Грижа",
      description: "Грижим се за нашите клиенти, общността и околната среда",
    },
    {
      icon: Zap,
      title: "Иновации",
      description: "Постоянно инвестираме в нови технологии и подобрения",
    },
  ]

  const additionalServices = [
    {
      title: "Автосервиз и автокозметика",
      description: "Работим с доверени майстори, а аз лично следя сервизът да остава практичен, честен и винаги с налични части за спешни ремонти.",
      icon: Wrench,
      iconColor: "text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/20",
      largeIcon: Wrench,
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
      bgGradient: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/20",
      largeIcon: CreditCard,
      list: [
        "Плащане на сметки за ток, вода, телефон и интернет",
        "Плащане на данъци и такси",
        "Попълване на мобилни кредити",
        "Плащане на застраховки",
        "Достaпно 24/7 за вашето удобство"
      ],
      dotColor: "bg-orange-400",
      dotBg: "bg-orange-500/10"
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

        {/* Cinematic Hero */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/fuel-station-reference.png"
              alt="Background"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/90 via-[#0a0a0f]/80 to-[#0a0a0f]"></div>
          </div>

          <div className="container relative z-10 px-4 text-center mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Нашата история</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-8xl font-black mb-6 tracking-tight"
            >
              Повече от <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Бензиностанция</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light"
            >
              История за качество, доверие и стремеж към съвършенство в сърцето на Враца.
            </motion.p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 relative">
          <div className="container px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-bold leading-tight">
                  Мисията на <span className="text-primary">BG OIL</span>
                </h2>
                <p className="text-lg text-white/60 leading-relaxed border-l-2 border-primary/30 pl-6">
                  В свят на компромиси, ние избираме качеството. Нашата цел не е просто да напълним резервоара ви, а да осигурим спокойствие на пътя. От създаването си, BG OIL се гради върху честност, иновации и уважение към всеки клиент.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="relative aspect-square rounded-3xl overflow-hidden glass-card p-2 transition-transform duration-500"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/5">
                  <Image
                    src="/fuel-station-reference.png"
                    alt="Mission Background"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-white font-bold text-xl italic leading-relaxed">"Качеството е нашата визитна картичка."</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-32 relative bg-white/[0.02]">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-6">Нашите Ценности</h2>
              <p className="text-white/40">Принципите, които ни водят напред</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="glass-card p-8 group hover:bg-white/5 transition-colors border border-white/5 hover:border-primary/30"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <val.icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{val.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{val.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Services Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Glows for section separation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="container px-4 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-6">Допълнителни Услуги</h2>
              <p className="text-white/40 max-w-2xl mx-auto">
                На място ще намерите пълноценен автосервиз и EasyPay каса, за да продължите пътя си с обслужен автомобил и без излишно губене на време.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {additionalServices.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 * idx }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-8 md:p-10 group relative overflow-hidden border border-white/5 hover:border-white/20"
                >
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700 pointer-events-none">
                    <service.largeIcon className="w-40 h-40" />
                  </div>

                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.bgGradient} flex items-center justify-center mb-8 border ${service.borderColor}`}>
                      <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{service.title}</h3>
                    <p className="text-white/50 mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-4">
                      {service.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className={`mt-1 w-5 h-5 rounded-full ${service.dotBg} flex items-center justify-center shrink-0`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${service.dotColor}`}></div>
                          </div>
                          <span className="text-white/80 text-sm font-medium">{item}</span>
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