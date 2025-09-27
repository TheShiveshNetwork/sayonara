"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const beamButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "bg-white text-slate-900 hover:bg-slate-100 dark:bg-black dark:text-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-black dark:hover:bg-slate-800 dark:hover:text-slate-50",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 border border-transparent",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface BeamButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof beamButtonVariants> {
  asChild?: boolean
  beamProps?: {
    beamColor?: string
    glowColor?: string
    hoverColor?: string
  }
}

const BeamButton = React.forwardRef<HTMLButtonElement, BeamButtonProps>(
  ({ className, variant, size, asChild = false, beamProps = {}, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const [hovered, setHovered] = React.useState(false)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const {
      glowColor = "rgba(59, 130, 246, 0.5)",
      hoverColor = "rgba(59, 130, 246, 0.2)",
    } = beamProps

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }

    const glowStyle = useMotionTemplate`radial-gradient(
      120px circle at ${mouseX}px ${mouseY}px,
      ${glowColor},
      transparent 80%
    )`

    return (
      <motion.div
        className="relative inline-flex overflow-hidden rounded-[0.75rem] transition-colors duration-300"
        style={{ background: hovered ? hoverColor : "transparent" }}
                onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div
          className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-300"
          style={{ background: glowStyle }}
          animate={{ opacity: hovered ? 1 : 0 }}
        />
        <Comp className={cn(beamButtonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      </motion.div>
    )
  },
)
BeamButton.displayName = "BeamButton"

export { BeamButton, beamButtonVariants }

