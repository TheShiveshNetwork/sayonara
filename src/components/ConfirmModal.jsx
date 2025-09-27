import React, { useState, useEffect } from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, config }) => {
  const [confirmText, setConfirmText] = useState('');
  const requiredText = 'SAYONARA ERASE';

  useEffect(() => {
    if (!isOpen) setConfirmText('');
  }, [isOpen]);

  if (!isOpen || !config) return null;

  const isValid = confirmText === requiredText;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Confirm Destructive Operation
          </h3>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Drive:</strong> {config.driveId}<br/>
              <strong>Mode:</strong> {config.mode}<br/>
              All data will be permanently destroyed.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type "{requiredText}" to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
            />
          </div>

          <div className="flex space-x-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus-ring">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isValid}
              className={`flex-1 px-4 py-2 rounded-md focus-ring ${
                isValid ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              Execute Erasure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;