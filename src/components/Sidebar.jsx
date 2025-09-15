import React from 'react';

const Sidebar = ({ drives, theme, onThemeToggle }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Sayonara
          </h1>
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-ring"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Secure Drive Erasure System
        </p>
      </div>

      <div className="flex-1 p-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
          Available Drives
        </h2>

        <div className="space-y-3">
          {drives.map((drive) => (
            <div key={drive.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {drive.model}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {drive.size} • {drive.type}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    drive.type === 'SSD' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {drive.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p className="font-medium">Sayonara</p>
          <p className="mt-1">Version 2.0.0</p>
          <p className="mt-1">Safe Mock Mode</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;