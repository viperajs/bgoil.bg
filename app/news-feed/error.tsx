'use client'

import { useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('News feed error:', error)
  }, [error])

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <Card className="p-12 border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
          <CardContent className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
              Нещо се обърка
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-6">
              {error.message || 'Възникна грешка при зареждане на новините'}
            </p>
            <Button
              onClick={reset}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Опитай отново
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

