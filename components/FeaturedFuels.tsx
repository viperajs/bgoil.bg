import Link from "next/link"
import { fuels } from "@/lib/config"
import { Button } from "@/components/ui/button"
import FuelCard from "./FuelCard"
import { ArrowRight } from "lucide-react"

export default function FeaturedFuels() {
  // Show first 3 fuels as featured
  const featuredFuels = fuels.slice(0, 3)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Актуални цени на горива</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Качествени горива на конкурентни цени с допълнителни отстъпки за картови клиенти
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredFuels.map((fuel, index) => (
            <FuelCard key={index} fuel={fuel} />
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/products" className="flex items-center space-x-2">
              <span>Виж всички цени</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <p className="text-sm text-accent-foreground text-center font-medium">
            ⚠️ Цените са ориентировъчни. Моля, потвърдете актуалните цени на място.
          </p>
        </div>
      </div>
    </section>
  )
}
