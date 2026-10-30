import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-auto",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-background text-foreground [a&]:hover:bg-muted",
        secondary:
          "border-border bg-background text-secondary-foreground [a&]:hover:bg-muted",
        destructive:
          "border-destructive bg-background text-destructive [a&]:hover:bg-muted",
        outline:
          "border-border bg-background text-foreground [a&]:hover:bg-muted [a&]:hover:text-foreground",
        success:
          "border-border bg-background text-foreground [a&]:hover:bg-muted",
        draft:
          "border-border bg-background text-muted-foreground [a&]:hover:bg-muted",
        review:
          "border-border bg-background text-foreground [a&]:hover:bg-muted",
        final:
          "border-border bg-background text-foreground [a&]:hover:bg-muted",
        archived:
          "border-border bg-background text-muted-foreground [a&]:hover:bg-muted",
        view:
          "border-border bg-background text-foreground [a&]:hover:bg-muted",
        edit:
          "border-border bg-background text-foreground [a&]:hover:bg-muted",
        download:
          "border-border bg-background text-foreground [a&]:hover:bg-muted",
        comment:
          "border-border bg-background text-foreground [a&]:hover:bg-muted",
        public:
          "border-border bg-background text-foreground [a&]:hover:bg-muted",
        internal:
          "border-border bg-background text-muted-foreground [a&]:hover:bg-muted",
        confidential:
          "border-border bg-background text-foreground [a&]:hover:bg-muted",
        restricted:
          "border-border bg-background text-destructive [a&]:hover:bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
