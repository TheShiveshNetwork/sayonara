'use client';

import React, { forwardRef, useRef, useEffect, useId, useState, RefObject } from 'react';
import { motion } from 'framer-motion';

// Utility function for class names
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

// Icons object with process step icons
const Icons = {
  android: () => (
    <svg
      viewBox="0 0 50 50"
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d="M 16.28125 0.03125 C 16.152344 0.0546875 16.019531 0.078125 15.90625 0.15625 C 15.449219 0.464844 15.347656 1.105469 15.65625 1.5625 L 17.8125 4.78125 C 14.480469 6.546875 11.996094 9.480469 11.1875 13 L 38.8125 13 C 38.003906 9.480469 35.519531 6.546875 32.1875 4.78125 L 34.34375 1.5625 C 34.652344 1.105469 34.550781 0.464844 34.09375 0.15625 C 33.632813 -0.152344 32.996094 -0.0195313 32.6875 0.4375 L 30.3125 3.9375 C 28.664063 3.335938 26.875 3 25 3 C 23.125 3 21.335938 3.335938 19.6875 3.9375 L 17.3125 0.4375 C 17.082031 0.09375 16.664063 -0.0429688 16.28125 0.03125 Z M 19.5 8 C 20.328125 8 21 8.671875 21 9.5 C 21 10.332031 20.328125 11 19.5 11 C 18.667969 11 18 10.332031 18 9.5 C 18 8.671875 18.667969 8 19.5 8 Z M 30.5 8 C 31.332031 8 32 8.671875 32 9.5 C 32 10.332031 31.332031 11 30.5 11 C 29.671875 11 29 10.332031 29 9.5 C 29 8.671875 29.671875 8 30.5 8 Z M 8 15 C 6.34375 15 5 16.34375 5 18 L 5 32 C 5 33.65625 6.34375 35 8 35 C 8.351563 35 8.6875 34.925781 9 34.8125 L 9 15.1875 C 8.6875 15.074219 8.351563 15 8 15 Z M 11 15 L 11 37 C 11 38.652344 12.347656 40 14 40 L 36 40 C 37.652344 40 39 38.652344 39 37 L 39 15 Z M 42 15 C 41.648438 15 41.3125 15.074219 41 15.1875 L 41 34.8125 C 41.3125 34.921875 41.648438 35 42 35 C 43.65625 35 45 33.65625 45 32 L 45 18 C 45 16.34375 43.65625 15 42 15 Z M 15 42 L 15 46 C 15 48.207031 16.792969 50 19 50 C 21.207031 50 23 48.207031 23 46 L 23 42 Z M 27 42 L 27 46 C 27 48.207031 28.792969 50 31 50 C 33.207031 50 35 48.207031 35 46 L 35 42 Z" />
    </svg>
  ),
  windows: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.852" />
    </svg>
  ),
  linux: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139z" />
    </svg>
  ),
  algorithm: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="m12 1 3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6Z" />
    </svg>
  ),
  certificate: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 13l2 2 4-4" />
    </svg>
  ),
};

// AnimatedBeam component
interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = '#64748b',
  pathWidth = 2,
  pathOpacity = 0.6,
  gradientStartColor = '#6366f1',
  gradientStopColor = '#8b5cf6',
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId();
  const [pathD, setPathD] = useState('');
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const gradientCoordinates = reverse
    ? {
      x1: ['90%', '-10%'],
      x2: ['100%', '0%'],
      y1: ['0%', '0%'],
      y2: ['0%', '0%'],
    }
    : {
      x1: ['10%', '110%'],
      x2: ['0%', '100%'],
      y1: ['0%', '0%'],
      y2: ['0%', '0%'],
    };

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectA = fromRef.current.getBoundingClientRect();
        const rectB = toRef.current.getBoundingClientRect();

        const svgWidth = containerRect.width;
        const svgHeight = containerRect.height;
        setSvgDimensions({ width: svgWidth, height: svgHeight });

        const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
        const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
        const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

        const controlY = startY - curvature;
        const d = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`;
        setPathD(d);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updatePath();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    updatePath();

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  return (
    <svg
      fill='none'
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns='http://www.w3.org/2000/svg'
      className={cn('pointer-events-none absolute left-0 top-0 transform-gpu stroke-2', className)}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap='round'
      />
      <motion.path
        d={pathD}
        stroke={`url(#${id})`}
        strokeLinecap='round'
        initial={{
          strokeWidth: pathWidth,
          strokeOpacity: 0,
        }}
        animate={{
          strokeWidth: pathWidth * 1.5,
          strokeOpacity: 1,
        }}
        transition={{
          duration: 2,
          delay: delay,
        }}
      />
      <defs>
        <motion.linearGradient className='transform-gpu'
          id={id}
          gradientUnits={'userSpaceOnUse'}
          initial={{
            x1: '0%',
            x2: '0%',
            y1: '0%',
            y2: '0%',
          }}
          animate={{
            x1: gradientCoordinates.x1,
            x2: gradientCoordinates.x2,
            y1: gradientCoordinates.y1,
            y2: gradientCoordinates.y2,
          }}
          transition={{
            delay,
            duration,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
            repeatDelay: 0,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity='0'></stop>
          <stop stopColor={gradientStartColor}></stop>
          <stop offset='32.5%' stopColor={gradientStopColor}></stop>
          <stop offset='100%' stopColor={gradientStopColor} stopOpacity='0'></stop>
        </motion.linearGradient>
      </defs>
    </svg>
  );
};

// Circle component with shadcn styling
const Circle = forwardRef<HTMLDivElement, {
  className?: string;
  children?: React.ReactNode;
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
}>(({ className, children, label, sublabel, size = 'md' }, ref) => {
  const sizeClasses = {
    sm: 'w-12 h-12 p-3',
    md: 'w-16 h-16 p-4',
    lg: 'w-20 h-20 p-5',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={ref}
        className={cn(
          'z-10 flex items-center justify-center rounded-full border-2 border-border bg-background',
          sizeClasses[size],
          'hover:bg-muted/50 transition-colors duration-200',
          'shadow-sm',
          className
        )}
      >
        <div className="text-foreground">
          {children}
        </div>
      </div>
      {label && (
        <div className="text-center space-y-1">
          <div className="font-medium text-sm text-foreground">
            {label}
          </div>
          {sublabel && (
            <div className="text-xs text-muted-foreground">
              {sublabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

Circle.displayName = 'Circle';

// Main SayonaraWipeFlow component
interface SayonaraWipeFlowProps {
  className?: string;
  beamSpeed?: number;
}

export const SayonaraWipeFlow: React.FC<SayonaraWipeFlowProps> = ({
  className,
  beamSpeed = 4
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const androidRef = useRef<HTMLDivElement>(null);
  const windowsRef = useRef<HTMLDivElement>(null);
  const linuxRef = useRef<HTMLDivElement>(null);
  const algorithmRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("w-full max-w-6xl mx-auto p-6", className)}>
      <div
        className={cn(
          'relative flex w-full items-center justify-center overflow-hidden'
        )}
        ref={containerRef}
      >
        <div className='flex h-full w-full flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10'>

          {/* Operating Systems */}
          <div className='flex flex-col justify-center gap-6'>
            <Circle
              ref={androidRef}
              label="Android"
              sublabel="Mobile"
              size="sm"
            >
              <div className="w-5 h-5">{Icons.android()}</div>
            </Circle>
            <Circle
              ref={windowsRef}
              label="Windows"
              sublabel="Desktop"
              size="sm"
            >
              <div className="w-5 h-5">{Icons.windows()}</div>
            </Circle>
            <Circle
              ref={linuxRef}
              label="Linux"
              sublabel="Server"
              size="sm"
            >
              <div className="w-5 h-5">{Icons.linux()}</div>
            </Circle>
          </div>

          {/* Custom Algorithm (Delete + Verify) */}
          <Circle
            ref={algorithmRef}
            label="Custom Algorithm"
            sublabel="Delete + Verify"
            size="lg"
          >
            <div className="w-8 h-8">{Icons.algorithm()}</div>
          </Circle>

          {/* Certificate Generation */}
          <Circle
            ref={certificateRef}
            label="Certificate"
            sublabel="Blockchain"
            size="md"
          >
            <div className="w-6 h-6">{Icons.certificate()}</div>
          </Circle>

        </div>

        {/* Animated beams - OS to Algorithm */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={androidRef}
          toRef={algorithmRef}
          duration={beamSpeed}
          delay={0}
          pathColor="#94a3b8"
          pathOpacity={0.1}
          gradientStartColor="#a78bfa"
          gradientStopColor="#c084fc"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={windowsRef}
          toRef={algorithmRef}
          duration={beamSpeed}
          delay={0.5}
          pathColor="#94a3b8"
          pathOpacity={0.1}
          gradientStartColor="#67e8f9"
          gradientStopColor="#7dd3fc"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={linuxRef}
          toRef={algorithmRef}
          duration={beamSpeed}
          delay={0.3}
          pathColor="#94a3b8"
          pathOpacity={0.1}
          gradientStartColor="#6ee7b7"
          gradientStopColor="#86efac"
        />

        {/* Algorithm to Certificate */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={algorithmRef}
          toRef={certificateRef}
          duration={beamSpeed}
          delay={1}
          pathColor="#94a3b8"
          pathOpacity={0.1}
          gradientStartColor="#fbbf24"
          gradientStopColor="#fcd34d"
        />
      </div>
    </div>
  );
};

export default SayonaraWipeFlow;