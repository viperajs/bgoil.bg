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
        <CardTitle className="text-center">Цени на стаи</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-foreground">Тип стая</th>
                <th className="text-right py-4 px-4 font-semibold text-foreground">Цена на нощ</th>
                <th className="text-center py-4 px-4 font-semibold text-foreground">Действие</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4 text-foreground font-medium">{room.type}</td>
                  <td className="py-4 px-4 text-right text-foreground font-semibold">
                    {room.price} лв
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <a href={`tel:${contacts.hotelPhone}`} className="flex items-center justify-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Резервирай</span>
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Всички цени са в български лева (лв) и включват данъци</p>
          <p className="mt-1">За резервации и информация: {contacts.hotelPhone}</p>
        </div>
      </CardContent>
    </Card>
  )
}

