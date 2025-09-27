import React from 'react';

const IsoModal = ({ isOpen, onClose, isoData }) => {
  if (!isOpen || !isoData) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Bootable ISO Generated
          </h3>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              Your bootable ISO has been generated successfully.
            </p>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Download URL:</label>
              <input
                type="text"
                value={isoData.downloadUrl}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SHA256 Checksum:</label>
              <input
                type="text"
                value={isoData.sha256}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus-ring">
              Close
            </button>
            <button
              onClick={() => window.open(isoData.downloadUrl, '_blank')}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus-ring"
            >
              Download ISO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsoModal;