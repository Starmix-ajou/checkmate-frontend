"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextField = React.forwardRef<HTMLTextAreaElement, TextFieldProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
TextField.displayName = "TextField"

export { TextField } 