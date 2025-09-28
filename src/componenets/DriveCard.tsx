import type { FC } from 'react';

// --- Prop Types ---
export type Drive = {
  id: string;
  name: string;
  size: string;
  type: 'SSD' | 'HDD' | 'USB';
  usage: number; // Percentage from 0 to 100
  recommended?: boolean;
};

export type DriveCardProps = {
  drive: Drive;
  onSelect: (id: string) => void;
  isSelected: boolean;
};

const DriveCard: FC<DriveCardProps> = ({ drive, onSelect, isSelected }) => {
  return (
    <div
      onClick={() => onSelect(drive.id)}
      className={`relative p-5 bg-[#0B0B0F]/50 border rounded-lg cursor-pointer transition-all duration-300 group
        ${isSelected
          ? 'border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.5)]'
          : 'border-gray-800 hover:border-purple-600/50'
        }`}
    >
      {drive.recommended && (
        <div className="absolute top-3 right-3 px-3 py-1 text-xs font-bold text-white bg-orange-500 rounded-full shadow-lg shadow-orange-500/40 flex items-center gap-1">
            ⚡ Recommended by AI
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Drive Icon */}
        <div className={`flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors ${isSelected ? 'text-purple-400' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{drive.name}</h3>
          <p className="text-sm text-gray-400">{drive.size} - {drive.type}</p>
        </div>
      </div>

      {/* Usage Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-purple-600 to-purple-500 h-2.5 rounded-full"
            style={{ width: `${drive.usage}%` }}
          ></div>
        </div>
        <p className="text-xs text-right text-gray-500 mt-1">{drive.usage}% Full</p>
      </div>
    </div>
  );
};

export default DriveCard;