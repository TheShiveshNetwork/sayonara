import { useState, useCallback, useMemo } from 'react';

// Exported types
export interface WipeLog {
  id: string;
  drive: string;
  method: string;
  timestamp: Date;
  verified: boolean;
  txHash?: string;
  status: 'completed' | 'cancelled' | 'failed';
  duration?: number; // in seconds
  dataSize?: string; // formatted size (e.g., "500 GB")
}

export type SortBy = 'date' | 'drive' | 'method' | 'status';

export interface UseReportsReturn {
  logs: WipeLog[];
  addLog: (log: Omit<WipeLog, 'id'>) => string;
  getLogsSorted: (by: SortBy) => WipeLog[];
  searchLogs: (query: string) => WipeLog[];
  removeLog: (id: string) => void;
  clearLogs: () => void;
  updateLogVerification: (id: string, txHash: string) => void;
  getLogById: (id: string) => WipeLog | undefined;
  exportLogs: (format: 'json' | 'csv') => string;
}

// Generate dummy logs for simulation
const generateDummyLogs = (): WipeLog[] => {
  const drives = ['/dev/sda1', '/dev/sdb1', '/dev/sdc1', '/dev/nvme0n1', '/dev/sdd1', 'C:', 'D:', 'E:'];
  const methods = [
    'DoD 5220.22-M (3-pass)',
    'NIST 800-88 Purge',
    'Random Data Overwrite (7-pass)',
    'Gutmann Method (35-pass)',
    'Cryptographic Erasure',
    'Single Pass Zero Fill'
  ];
  const statuses: WipeLog['status'][] = ['completed', 'completed', 'completed', 'completed', 'cancelled', 'failed'];
  const dataSizes = ['120 GB', '500 GB', '1 TB', '2 TB', '256 GB', '64 GB', '1.5 TB', '4 TB'];

  const logs: WipeLog[] = [];
  const now = Date.now();

  for (let i = 0; i < 8; i++) {
    const timestamp = new Date(now - (Math.random() * 30 * 24 * 60 * 60 * 1000)); // Within last 30 days
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const verified = status === 'completed' && Math.random() > 0.3; // 70% of completed wipes are verified
    
    logs.push({
      id: `log_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      drive: drives[i % drives.length],
      method: methods[Math.floor(Math.random() * methods.length)],
      timestamp,
      verified,
      txHash: verified ? `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}` : undefined,
      status,
      duration: status === 'completed' ? Math.floor(Math.random() * 1200) + 300 : undefined, // 5-25 minutes
      dataSize: dataSizes[Math.floor(Math.random() * dataSizes.length)]
    });
  }

  // Sort by timestamp (most recent first)
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Hook implementation
export const useReports = (): UseReportsReturn => {
  const [logs, setLogs] = useState<WipeLog[]>(() => generateDummyLogs());

  const generateLogId = useCallback(() => {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addLog = useCallback((logData: Omit<WipeLog, 'id'>): string => {
    const newLog: WipeLog = {
      ...logData,
      id: generateLogId(),
    };

    setLogs(prev => [newLog, ...prev]); // Add to beginning (most recent first)
    
    // TODO: Replace this simulation with real data persistence:
    // Option 1: Save to local storage
    // localStorage.setItem('sayonara_logs', JSON.stringify([newLog, ...prev]));
    
    // Option 2: Save via Tauri command to file/database
    // await invoke('save_wipe_log', { log: newLog });
    
    // Option 3: API call to backend
    // await fetch('/api/reports/logs', {
    //   method: 'POST',
    //   body: JSON.stringify(newLog)
    // });

    return newLog.id;
  }, [generateLogId]);

  const getLogsSorted = useCallback((by: SortBy): WipeLog[] => {
    return [...logs].sort((a, b) => {
      switch (by) {
        case 'date':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'drive':
          return a.drive.localeCompare(b.drive);
        case 'method':
          return a.method.localeCompare(b.method);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [logs]);

  const searchLogs = useCallback((query: string): WipeLog[] => {
    if (!query.trim()) return logs;
    
    const searchTerm = query.toLowerCase();
    return logs.filter(log => 
      log.drive.toLowerCase().includes(searchTerm) ||
      log.method.toLowerCase().includes(searchTerm) ||
      log.status.toLowerCase().includes(searchTerm) ||
      (log.txHash && log.txHash.toLowerCase().includes(searchTerm)) ||
      (log.dataSize && log.dataSize.toLowerCase().includes(searchTerm)) ||
      log.timestamp.toLocaleDateString().includes(searchTerm)
    );
  }, [logs]);

  const removeLog = useCallback((id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
    
    // TODO: Replace this simulation with real data persistence:
    // await invoke('remove_wipe_log', { logId: id });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    
    // TODO: Replace this simulation with real data persistence:
    // await invoke('clear_all_logs');
  }, []);

  const updateLogVerification = useCallback((id: string, txHash: string) => {
    setLogs(prev => prev.map(log => 
      log.id === id 
        ? { ...log, verified: true, txHash }
        : log
    ));
    
    // TODO: Replace this simulation with real data persistence:
    // await invoke('update_log_verification', { logId: id, txHash });
  }, []);

  const getLogById = useCallback((id: string): WipeLog | undefined => {
    return logs.find(log => log.id === id);
  }, [logs]);

  const exportLogs = useCallback((format: 'json' | 'csv'): string => {
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    } else {
      // CSV format
      const headers = ['ID', 'Drive', 'Method', 'Date', 'Status', 'Verified', 'TX Hash', 'Duration (min)', 'Data Size'];
      const csvRows = logs.map(log => [
        log.id,
        log.drive,
        log.method,
        log.timestamp.toISOString(),
        log.status,
        log.verified ? 'Yes' : 'No',
        log.txHash || '',
        log.duration ? Math.round(log.duration / 60) : '',
        log.dataSize || ''
      ]);
      
      return [headers, ...csvRows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    }
  }, [logs]);

  // Memoized statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const completed = logs.filter(log => log.status === 'completed').length;
    const verified = logs.filter(log => log.verified).length;
    const failed = logs.filter(log => log.status === 'failed').length;
    const cancelled = logs.filter(log => log.status === 'cancelled').length;

    return { total, completed, verified, failed, cancelled };
  }, [logs]);

  return {
    logs,
    addLog,
    getLogsSorted,
    searchLogs,
    removeLog,
    clearLogs,
    updateLogVerification,
    getLogById,
    exportLogs,
    // Include stats as additional return value
    ...stats,
  } as UseReportsReturn & typeof stats;
};

// Utility functions for reports
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getStatusColor = (status: WipeLog['status']): string => {
  switch (status) {
    case 'completed': return '#22c55e'; // green
    case 'cancelled': return '#f59e0b'; // amber
    case 'failed': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/*
Example usage:

const ReportsComponent = () => {
  const { 
    logs,
    addLog,
    getLogsSorted,
    searchLogs,
    removeLog,
    clearLogs,
    updateLogVerification,
    getLogById,
    exportLogs,
    total,
    completed,
    verified,
    failed,
    cancelled
  } = useReports();

  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<WipeLog | null>(null);

  const displayLogs = searchQuery ? searchLogs(searchQuery) : getLogsSorted(sortBy);

  const handleAddLog = () => {
    const newLogId = addLog({
      drive: '/dev/sda1',
      method: 'DoD 5220.22-M (3-pass)',
      timestamp: new Date(),
      verified: false,
      status: 'completed',
      duration: 900, // 15 minutes
      dataSize: '1 TB'
    });
    console.log('Added new log:', newLogId);
  };

  const handleVerifyLog = (logId: string) => {
    const mockTxHash = `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
    updateLogVerification(logId, mockTxHash);
  };

  const handleExport = (format: 'json' | 'csv') => {
    const content = exportLogs(format);
    const filename = `sayonara-wipe-logs-${new Date().toISOString().split('T')[0]}.${format}`;
    const mimeType = format === 'json' ? 'application/json' : 'text/csv';
    downloadFile(content, filename, mimeType);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Wipe Reports & Logs</h2>
        <div className="stats-summary">
          <div className="stat">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{total}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Completed:</span>
            <span className="stat-value">{completed}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Verified:</span>
            <span className="stat-value">{verified}</span>
          </div>
          <div className="stat failed">
            <span className="stat-label">Failed:</span>
            <span className="stat-value">{failed}</span>
          </div>
          <div className="stat cancelled">
            <span className="stat-label">Cancelled:</span>
            <span className="stat-value">{cancelled}</span>
          </div>
        </div>
      </div>

      <div className="reports-controls">
        <div className="search-section">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by drive, method, status, or date..."
            className="search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="clear-search"
            >
              Clear
            </button>
          )}
        </div>

        <div className="sort-section">
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="date">Date</option>
            <option value="drive">Drive</option>
            <option value="method">Method</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="action-buttons">
          <button onClick={handleAddLog}>Add Test Log</button>
          <button onClick={() => handleExport('csv')}>Export CSV</button>
          <button onClick={() => handleExport('json')}>Export JSON</button>
          <button onClick={clearLogs} className="danger">Clear All</button>
        </div>
      </div>

      <div className="logs-table">
        <div className="table-header">
          <div className="col-drive">Drive</div>
          <div className="col-method">Method</div>
          <div className="col-date">Date</div>
          <div className="col-status">Status</div>
          <div className="col-verified">Verified</div>
          <div className="col-duration">Duration</div>
          <div className="col-size">Size</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="table-body">
          {displayLogs.length === 0 ? (
            <div className="no-logs">
              {searchQuery ? `No logs found matching "${searchQuery}"` : 'No wipe logs available'}
            </div>
          ) : (
            displayLogs.map((log) => (
              <div key={log.id} className="table-row">
                <div className="col-drive">{log.drive}</div>
                <div className="col-method" title={log.method}>
                  {log.method.length > 20 ? `${log.method.substring(0, 20)}...` : log.method}
                </div>
                <div className="col-date">{log.timestamp.toLocaleDateString()}</div>
                <div className="col-status">
                  <span 
                    className={`status-badge ${log.status}`}
                    style={{ color: getStatusColor(log.status) }}
                  >
                    {log.status}
                  </span>
                </div>
                <div className="col-verified">
                  {log.verified ? (
                    <span className="verified">✅ Yes</span>
                  ) : (
                    <span className="unverified">❌ No</span>
                  )}
                </div>
                <div className="col-duration">
                  {log.duration ? formatDuration(log.duration) : '-'}
                </div>
                <div className="col-size">{log.dataSize || '-'}</div>
                <div className="col-actions">
                  <button 
                    onClick={() => setSelectedLog(log)}
                    className="view-btn"
                  >
                    View
                  </button>
                  {!log.verified && log.status === 'completed' && (
                    <button 
                      onClick={() => handleVerifyLog(log.id)}
                      className="verify-btn"
                    >
                      Verify
                    </button>
                  )}
                  <button 
                    onClick={() => removeLog(log.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedLog && (
        <div className="log-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Wipe Log Details</h3>
              <button onClick={() => setSelectedLog(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Log ID:</strong> {selectedLog.id}
              </div>
              <div className="detail-row">
                <strong>Drive:</strong> {selectedLog.drive}
              </div>
              <div className="detail-row">
                <strong>Method:</strong> {selectedLog.method}
              </div>
              <div className="detail-row">
                <strong>Date:</strong> {selectedLog.timestamp.toLocaleString()}
              </div>
              <div className="detail-row">
                <strong>Status:</strong> {selectedLog.status}
              </div>
              <div className="detail-row">
                <strong>Verified:</strong> {selectedLog.verified ? 'Yes' : 'No'}
              </div>
              {selectedLog.txHash && (
                <div className="detail-row">
                  <strong>Transaction Hash:</strong> 
                  <code>{selectedLog.txHash}</code>
                </div>
              )}
              {selectedLog.duration && (
                <div className="detail-row">
                  <strong>Duration:</strong> {formatDuration(selectedLog.duration)}
                </div>
              )}
              {selectedLog.dataSize && (
                <div className="detail-row">
                  <strong>Data Size:</strong> {selectedLog.dataSize}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="reports-footer">
        <small>
          Total logs: {displayLogs.length} 
          {searchQuery && ` (filtered from ${logs.length})`}
        </small>
      </div>
    </div>
  );
};
*/