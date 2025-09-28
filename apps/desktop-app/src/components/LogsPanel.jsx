import React, { useEffect, useRef } from 'react';

const LogsPanel = ({ logs, onClear }) => {
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Logs
          </h3>
          <button
            onClick={onClear}
            disabled={logs.length === 0}
            className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:text-gray-400 disabled:cursor-not-allowed focus-ring"
          >
            Clear
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {logs.length} entries
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-sm">No logs yet</p>
            <p className="text-xs mt-1">Start an operation to see live logs</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                <p className="text-sm font-medium">{log.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPanel;