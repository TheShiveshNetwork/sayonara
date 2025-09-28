import type { FC } from 'react';

// --- Prop Types ---
type Drive = { id: string; name: string; size: string; usagePct: number };
export type DriveListProps = {
  drives: Drive[];
  selectedDrive: string | null;
  onSelect: (id: string) => void;
  onStartWipe: (id: string) => void;
};

const DriveList: FC<DriveListProps> = ({ drives, selectedDrive, onSelect, onStartWipe }) => {
  return (
    <div className="font-inter w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives.map((drive) => {
          const isSelected = selectedDrive === drive.id;
          return (
            <div key={drive.id} className="relative">
              {/* Gradient border for selected state */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl blur opacity-0 ${isSelected ? 'opacity-75' : ''} transition-opacity duration-300`}></div>
              <button
                onClick={() => onSelect(drive.id)}
                className={`relative w-full p-6 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl text-left transition-all duration-300 hover:border-purple-500/50`}
              >
                <div className="flex items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  <div>
                    <h3 className="font-semibold text-white">{drive.name}</h3>
                    <p className="text-sm text-gray-400">{drive.size}</p>
                  </div>
                </div>
                {/* Usage Bar */}
                <div className="mt-4 space-y-1">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full" style={{ width: `${drive.usagePct}%` }}></div>
                    </div>
                    <p className="text-xs text-right text-gray-500">{drive.usagePct}% Used</p>
                </div>
              </button>
            </div>
          );
        })}
      </div>
      {selectedDrive && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => onStartWipe(selectedDrive)}
            className="px-8 py-3 font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg shadow-purple-600/30 hover:scale-105 hover:shadow-xl hover:shadow-purple-600/40 transition-all duration-300"
          >
            Proceed to Wipe Options
          </button>
        </div>
      )}
    </div>
  );
};

export default DriveList;

/*
// --- Example Usage ---
const drives = [
    { id: 'ssd1', name: 'SAMSUNG 980 PRO', size: '1TB NVMe SSD', usagePct: 75 },
    { id: 'hdd1', name: 'SEAGATE BARRACUDA', size: '4TB HDD', usagePct: 30 },
    { id: 'usb1', name: 'SANDISK CRUZER', size: '64GB USB', usagePct: 90 },
];
const [selected, setSelected] = React.useState('ssd1');
<DriveList drives={drives} selectedDrive={selected} onSelect={setSelected} onStartWipe={console.log} />
*/