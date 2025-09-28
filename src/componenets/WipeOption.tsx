import type { FC } from 'react';

// --- Prop Types ---
type WipeMethod = { id: string; title: string; description: string; time: string };
export type WipeOptionsProps = {
  selected: string | null;
  onSelect: (id: string) => void;
};

const WIPE_METHODS: WipeMethod[] = [
  { id: 'quick', title: 'Sayonara Quick Wipe', description: 'Removes file pointers and overwrites data once. Fast and effective for most needs.', time: '~15 mins / TB' },
  { id: 'deep', title: 'Sayonara Deep Wipe', description: 'Erases all data and the operating system. Ideal for preparing a drive for a new OS.', time: '~45 mins / TB' },
  { id: 'advanced', title: 'Sayonara Advanced Secure', description: 'Multiple overwrites (3-pass DoD 5220.22-M). For highly sensitive data.', time: '~2 hours / TB' },
];

const WipeOptions: FC<WipeOptionsProps> = ({ selected, onSelect }) => {
  return (
    <div className="font-inter space-y-3">
      {WIPE_METHODS.map((method) => {
        const isSelected = selected === method.id;
        return (
          <div key={method.id} className="relative">
            {/* Animated gradient border */}
            <div className={`absolute -inset-px bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}></div>
            <button
              onClick={() => onSelect(method.id)}
              className={`relative w-full p-4 bg-gray-900 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] ${isSelected ? 'border border-purple-500' : 'border border-gray-700'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">{method.title}</h3>
                  <p className="mt-1 text-xs text-gray-400">{method.description}</p>
                  <p className="mt-2 text-xs font-mono text-purple-300">{method.time}</p>
                </div>
                <div className="ml-4">
                  <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-500'}`}>
                    {isSelected && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default WipeOptions;

/*
// --- Example Usage ---
const [selected, setSelected] = React.useState('deep');
<WipeOptions selected={selected} onSelect={setSelected} />
*/