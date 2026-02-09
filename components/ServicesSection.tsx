import { services } from "@/lib/config"
import { Sparkles, ArrowRight } from "lucide-react"
import * as motion from "motion/react-client"

export default function ServicesSection() {
  return (
    <section className="relative py-32 bg-[#0a0a0f] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-[10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container relative mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Нашите услуги</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Пълен <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Спектър</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            Всичко необходимо за вашето удобство и комфорт на едно място.
            Проектирано с мисъл за вас.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card group relative overflow-hidden p-8 flex flex-col items-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 w-20 h-20 mb-8 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500">
                <span className="text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{service.icon}</span>
              </div>

              <h3 className="relative z-10 text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {service.name}
              </h3>

              <p className="relative z-10 text-sm text-white/40 leading-relaxed mb-6 group-hover:text-white/60 transition-colors">
                {service.description}
              </p>

              <div className="mt-auto relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="inline-block p-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full">
            <div className="px-8 py-3 bg-[#0a0a0f] rounded-full border border-white/5 backdrop-blur-md">
              <p className="text-sm font-medium text-white/60">
                Работим <span className="text-primary font-bold">24/7</span> за вашето удобство
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}