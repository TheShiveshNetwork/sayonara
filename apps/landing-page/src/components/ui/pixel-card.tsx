"use client"

import React, { useEffect, useState } from 'react'
import { motion, Transition } from 'framer-motion'

// Define TypeScript interfaces for better type safety
type PixelCanvasProps = {
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

interface CardProps {
  icon: string
  label: string
  description: string
  color: string
  canvasProps?: PixelCanvasProps
}

// Centralize configuration and make it more flexible
const PIXEL_SCRIPT_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixel-RKkUKH2OXWk9adKbDnozmndkwseTQh.js'

export const PixelCanvas: React.FC<PixelCanvasProps> = ({
  gap = 5,
  speed = 30,
  colors = "#e0f2fe, #7dd3fc, #0ea5e9",
  noFocus = false,
  className = "absolute inset-0 size-full",
  style = { position: "absolute", width: "100%", height: "100%" },
}) => {
  return React.createElement("pixel-canvas", {
    "data-gap": gap,
    "data-speed": speed,
    "data-colors": colors,
    ...(noFocus ? { "data-no-focus": "" } : {}),
    className,
    style,
  });
};

const Card: React.FC<CardProps> = ({
  icon,
  label,
  description,
  canvasProps = {}
}) => {
  // Hover animation configuration
  const hoverTransition: Transition = {
  duration: 0.8,
  ease: [0.5, 1, 0.89, 1] as [number, number, number, number],
};

  return (
    <motion.div
      className="group relative isolate grid aspect-[4/5] select-none place-items-center overflow-hidden rounded-xl border border-border bg-background transition-all duration-200 hover:text-black dark:hover:text-white sm:aspect-square md:aspect-[4/5]"
    >
      <PixelCanvas {...canvasProps} />

      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,transparent_55%,#ffffff)] shadow-[-0.5cqi_0.5cqi_2.5cqi_inset_#f3f4f6] dark:bg-[radial-gradient(circle_at_bottom_left,transparent_55%,#101012)] dark:shadow-[-0.5cqi_0.5cqi_2.5cqi_inset_#09090b]"
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 0 }}
        transition={hoverTransition}
      />

      <motion.div
        className="absolute inset-0 m-auto aspect-square bg-[radial-gradient(circle,#f3f4f6,transparent_65%)] dark:bg-[radial-gradient(circle,#09090b,transparent_65%)]"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={hoverTransition}
      />

      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 256 256"
        className="ease-[cubic-bezier(0.5,1,0.89,1)] relative z-10 h-auto w-[30%] text-gray-600 transition-all duration-300 group-hover:text-black dark:text-[#52525b] dark:group-hover:text-white sm:w-[40%] md:w-[35%] lg:w-[30%]"
        whileHover={{
          scale: 1.1,
          transition: hoverTransition
        }}
      >
        <path d={icon} fill="currentColor" />
      </motion.svg>

      <div className="absolute bottom-4 left-4 right-4 z-10">
        <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">
          {label}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

export default function SayonaraPixelCards() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = PIXEL_SCRIPT_URL
    script.async = true

    script.onload = () => setIsScriptLoaded(true)
    script.onerror = () => console.error('Failed to load pixel canvas script')

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const cardConfigurations = [
    {
      icon: "M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42ZM40,54H216a2,2,0,0,1,2,2V98H38V56A2,2,0,0,1,40,54ZM38,200V110H98v92H40A2,2,0,0,1,38,200Zm178,2H110V110H218v90A2,2,0,0,1,216,202ZM70,78a6,6,0,0,1,6-6H180a6,6,0,0,1,0,12H76A6,6,0,0,1,70,78Zm0,52a6,6,0,0,1,6-6H180a6,6,0,0,1,0,12H76A6,6,0,0,1,70,130Zm0,26a6,6,0,0,1,6-6h60a6,6,0,0,1,0,12H76A6,6,0,0,1,70,156Z",
      label: "Multi-Platform",
      description: "Android, Windows & Linux support",
      color: "#e0f2fe",
      canvasProps: { gap: 8, speed: 35, colors: "#e0f2fe, #7dd3fc, #0ea5e9" }
    },
    {
      icon: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM173.66,90.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,140.69l50.34-50.35A8,8,0,0,1,173.66,90.34ZM128,72a8,8,0,0,1,8,8v8a8,8,0,0,1-16,0V80A8,8,0,0,1,128,72Zm0,112a8,8,0,0,1-8-8v-8a8,8,0,0,1,16,0v8A8,8,0,0,1,128,184Z",
      label: "Custom Algorithm",
      description: "Delete + Verify in one process",
      color: "#dcfce7",
      canvasProps: { gap: 6, speed: 40, colors: "#dcfce7, #86efac, #16a34a" }
    },
    {
      icon: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.78L216,90v85.82Z",
      label: "Blockchain Certificate",
      description: "Tamper-proof verification",
      color: "#fef3c7",
      canvasProps: { gap: 4, speed: 25, colors: "#fef3c7, #fde047, #eab308" }
    },
    {
      icon: "M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42ZM40,54H216a2,2,0,0,1,2,2V98H38V56A2,2,0,0,1,40,54ZM38,200V110H98v92H40A2,2,0,0,1,38,200Zm178,2H110V110H218v90A2,2,0,0,1,216,202ZM70,78a6,6,0,0,1,6-6H180a6,6,0,0,1,0,12H76A6,6,0,0,1,70,78Zm40,52a6,6,0,0,1,6-6h64a6,6,0,0,1,0,12H116A6,6,0,0,1,110,130Zm0,26a6,6,0,0,1,6-6h64a6,6,0,0,1,0,12H116A6,6,0,0,1,110,156Zm0,26a6,6,0,0,1,6-6h64a6,6,0,0,1,0,12H116A6,6,0,0,1,110,182Z",
      label: "SME Dashboard",
      description: "Enterprise management panel",
      color: "#fce7f3",
      canvasProps: { gap: 5, speed: 30, colors: "#fce7f3, #f9a8d4, #ec4899" }
    }
  ]

  return (
    <div className="grid min-h-[320px] w-full grid-cols-1 gap-6 bg-background text-gray-800 dark:bg-background dark:text-[#e3e3e3] sm:grid-cols-2 lg:grid-cols-4">
      {isScriptLoaded && cardConfigurations.map((cardConfig) => (
        <Card
          key={cardConfig.label}
          icon={cardConfig.icon}
          label={cardConfig.label}
          description={cardConfig.description}
          color={cardConfig.color}
          canvasProps={cardConfig.canvasProps}
        />
      ))}
    </div>
  )
}