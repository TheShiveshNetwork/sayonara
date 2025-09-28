import type { FC } from 'react';

// --- Prop Types ---
export type ProgressRingProps = {
  percent: number;
  statusText?: string;
  size?: number;
  strokeWidth?: number;
};

const ProgressRing: FC<ProgressRingProps> = ({ percent, statusText, size = 200, strokeWidth = 16 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // The 'offset' calculates the length of the stroke that should be hidden.
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="font-inter relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle stroke="#1F2937" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
        {/* Progress indicator */}
        <circle
          stroke="url(#neonGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-700 ease-out"
          style={{ transitionProperty: 'stroke-dashoffset' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-5xl font-bold text-white tracking-tighter">{`${Math.round(percent)}%`}</span>
        {statusText && <p className="mt-1 text-sm font-semibold text-purple-300">{statusText}</p>}
      </div>
    </div>
  );
};

export default ProgressRing;

/*
// --- Example Usage ---
const [progress, setProgress] = React.useState(0);
React.useEffect(() => {
  if (progress < 85) {
    const timer = setTimeout(() => setProgress(progress + 1), 50);
    return () => clearTimeout(timer);
  }
}, [progress]);
<ProgressRing percent={progress} statusText="Pass 2 of 3" />
*/