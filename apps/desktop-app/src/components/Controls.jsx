import React, { useState } from 'react';

const Controls = ({ drives, onEraseRequest, onIsoGeneration, isErasing }) => {
  const [selectedDrive, setSelectedDrive] = useState('');
  const [eraseMode, setEraseMode] = useState('data-only');
  const [generateIso, setGenerateIso] = useState(false);

  const handleExecute = () => {
    if (!selectedDrive) {
      alert('Please select a drive first');
      return;
    }

    const config = { driveId: selectedDrive, mode: eraseMode, generateIso };

    if (generateIso) {
      onIsoGeneration(config);
    } else {
      onEraseRequest(config);
    }
  };

  const selectedDriveInfo = drives.find(d => d.id === selectedDrive);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Erasure Controls
        </h2>
        {isErasing && (
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">Processing...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="drive-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Drive
          </label>
          <select
            id="drive-select"
            value={selectedDrive}
            onChange={(e) => setSelectedDrive(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus-ring bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isErasing}
          >
            <option value="">Choose a drive...</option>
            {drives.map((drive) => (
              <option key={drive.id} value={drive.id}>
                {drive.model} ({drive.size})
              </option>
            ))}
          </select>

          {selectedDriveInfo && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Selected:</strong> {selectedDriveInfo.model}
              </p>
              <p className="text-blue-600 dark:text-blue-300">
                Size: {selectedDriveInfo.size} • Type: {selectedDriveInfo.type}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Erasure Mode
          </label>
          <div className="space-y-2">
            {[
              { value: 'data-only', label: 'Data Only', desc: 'Wipe user data partitions' },
              { value: 'full-disk', label: 'Full Disk', desc: 'Complete drive overwrite' },
              { value: 'os-only', label: 'OS Only', desc: 'Operating system partition' }
            ].map((mode) => (
              <div key={mode.value} className="flex items-start">
                <input
                  id={mode.value}
                  name="erase-mode"
                  type="radio"
                  value={mode.value}
                  checked={eraseMode === mode.value}
                  onChange={(e) => setEraseMode(e.target.value)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isErasing}
                />
                <div className="ml-3">
                  <label htmlFor={mode.value} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {mode.label}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {mode.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={generateIso}
                onChange={(e) => setGenerateIso(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isErasing}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Generate bootable ISO
              </span>
            </label>
          </div>

          <button
            onClick={handleExecute}
            disabled={!selectedDrive || isErasing}
            className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors focus-ring ${
              !selectedDrive || isErasing
                ? 'bg-gray-400 cursor-not-allowed'
                : generateIso
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-danger-600 hover:bg-danger-700'
            }`}
          >
            {isErasing ? 'Processing...' : generateIso ? 'Generate ISO' : 'EXECUTE ERASURE'}
          </button>

          {!generateIso && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                WARNING: Destructive Operation
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                This action cannot be undone.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;