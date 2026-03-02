import { services } from "@/lib/config"
import { Sparkles, ArrowRight } from "lucide-react"
import * as motion from "motion/react-client"

export default function ServicesSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-[15%] w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 -right-[15%] w-[400px] h-[400px] bg-orange-600/[0.03] rounded-full blur-[120px]"></div>
      </div>

      <div className="container relative mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8 backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Нашите услуги</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Пълен <span className="text-gradient-primary">Спектър</span>
          </h2>
          <p className="text-base md:text-lg text-white/30 max-w-2xl mx-auto leading-relaxed">
            Всичко необходимо за вашето удобство и комфорт на едно място.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05] p-8 flex flex-col items-center text-center hover:border-primary/20 transition-all duration-500 hover:bg-white/[0.04]"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative z-10 w-16 h-16 mb-8 rounded-2xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center group-hover:scale-110 group-hover:border-primary/20 group-hover:bg-primary/[0.08] transition-all duration-500">
                <span className="text-3xl">{service.icon}</span>
              </div>

              <h3 className="relative z-10 text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                {service.name}
              </h3>

              <p className="relative z-10 text-sm text-white/30 leading-relaxed mb-6 group-hover:text-white/50 transition-colors duration-300">
                {service.description}
              </p>

              <div className="mt-auto relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-400">
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 24/7 Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-20"
        >
          <div className="inline-block rounded-full border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl px-8 py-3">
            <p className="text-sm font-medium text-white/40">
              Работим <span className="text-primary font-bold">24/7</span> за вашето удобство
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
