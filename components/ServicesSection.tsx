import { services } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowRight } from "lucide-react"
import { getActiveDiscountBannerMessage } from "@/lib/discountBannerStore"

export default async function ServicesSection() {
  const discountBannerMessage = await getActiveDiscountBannerMessage()
  
  // Update service descriptions with discount banner message if available
  const updatedServices = services.map(service => {
    if (service.name === '24/7 Магазин' && discountBannerMessage) {
      // Replace the discount message in the description if it exists
      const baseDescription = 'Непрекъснато работещ магазин с всичко необходимо.'
      return {
        ...service,
        description: `${baseDescription} ${discountBannerMessage}`
      }
    }
    return service
  })
  
  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Нашите услуги</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            <span className="text-gradient-primary">Пълен спектър</span> от услуги
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Предлагаме всичко необходимо за вашето удобство и комфорт на едно място
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {updatedServices.map((service, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover-lift bg-gradient-card shadow-lg hover:shadow-2xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-500"></div>
              
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-primary/10 group-hover:bg-gradient-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{service.icon}</span>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground text-center leading-relaxed mb-4 group-hover:text-foreground transition-colors duration-300">
                  {service.description}
                </p>
                <div className="flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </CardContent>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shine"></div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="inline-block p-1 bg-gradient-primary rounded-2xl">
            <div className="bg-background rounded-xl px-8 py-4">
              <p className="text-lg font-semibold text-foreground">
                Работим <span className="text-gradient-primary font-bold">24/7</span> за вашето удобство
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}