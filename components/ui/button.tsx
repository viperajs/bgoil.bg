import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary text-white shadow-lg hover:opacity-90 hover:shadow-xl hover:scale-105 active:scale-95",
        destructive:
          "bg-primary text-white shadow-lg hover:bg-primary-dark hover:shadow-xl hover:scale-105 active:scale-95",
        outline:
          "border-2 border-border bg-background shadow-sm hover:bg-muted hover:border-primary hover:shadow-md hover:scale-105 active:scale-95",
        secondary:
          "bg-gradient-secondary text-white shadow-lg hover:opacity-90 hover:shadow-xl hover:scale-105 active:scale-95",
        ghost:
          "hover:bg-muted hover:text-foreground hover:shadow-sm",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }