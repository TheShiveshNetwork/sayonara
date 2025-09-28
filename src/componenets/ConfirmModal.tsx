import { useState } from 'react';

export default function ConfirmModal({
  open,
  confirmPhrase,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  confirmPhrase: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [input, setInput] = useState('');

  if (!open) return null;

  const handleConfirm = () => {
    if (input.toLowerCase() === confirmPhrase.toLowerCase()) {
      onConfirm();
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4">Confirm Data Wipe</h2>
        <p className="text-red-400 font-semibold mb-4">
          This will permanently erase all data from the selected drive. This action cannot be undone.
        </p>
        <p className="text-sm text-gray-400 mb-4">
          Type <span className="font-mono text-red-400">{confirmPhrase}</span> to confirm:
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white mb-4"
          placeholder={confirmPhrase}
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={input.toLowerCase() !== confirmPhrase.toLowerCase()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Wipe
          </button>
        </div>
      </div>
    </div>
  );
}