import type { HotelRoom } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { contacts } from "@/lib/config"

interface HotelTableProps {
  rooms: HotelRoom[]
}

export default function HotelTable({ rooms }: HotelTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Цени на стаи</span>
          <Button size="sm" asChild>
            <a href={`tel:${contacts.hotelPhone}`} className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Резервация</span>
            </a>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-semibold text-card-foreground">Тип стая</th>
                <th className="text-right py-3 px-2 font-semibold text-card-foreground">Цена за нощувка</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={index} className="border-b border-border/50 last:border-b-0">
                  <td className="py-3 px-2 text-muted-foreground">{room.type}</td>
                  <td className="py-3 px-2 text-right">
                    <span className="font-semibold text-primary">{room.price} лв</span>
                    <span className="text-sm text-muted-foreground ml-1">/ нощ</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <p className="text-sm text-muted-foreground text-center">
            За резервации се обадете на{" "}
            <a href={`tel:${contacts.hotelPhone}`} className="font-medium text-primary hover:underline">
              {contacts.hotelPhone}
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
