import { services } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServicesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Нашите услуги</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Предлагаме пълен спектър от услуги за вашето удобство и комфорт
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">{service.icon}</div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center text-pretty">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
