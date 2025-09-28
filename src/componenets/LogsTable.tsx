import { useState, useMemo } from 'react';
import type { FC } from 'react';

// --- Prop Types ---
type LogEntry = { id: string; drive: string; method: string; timestamp: string; verified: boolean; txHash?: string };
export type LogsTableProps = { logs: LogEntry[]; rowsPerPage?: number };

const LogsTable: FC<LogsTableProps> = ({ logs, rowsPerPage = 5 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof LogEntry; dir: 'asc' | 'desc' } | null>(null);

  const sortedAndFilteredLogs = useMemo(() => {
    let processLogs = [...logs].filter(log =>
      log.drive.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.method.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortConfig) {
      processLogs.sort((a, b) => {
        const av = a[sortConfig.key];
        const bv = b[sortConfig.key];
        if (av == null || bv == null) return 0;
        if (av < bv) return sortConfig.dir === 'asc' ? -1 : 1;
        if (av > bv) return sortConfig.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return processLogs;
  }, [logs, searchTerm, sortConfig]);

  const totalPages = Math.ceil(sortedAndFilteredLogs.length / rowsPerPage);
  const paginatedLogs = sortedAndFilteredLogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const requestSort = (key: keyof LogEntry) => {
    const dir = sortConfig && sortConfig.key === key && sortConfig.dir === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, dir });
  };
  
  return (
    <div className="font-inter w-full bg-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-lg font-bold text-white">Erasure History</h3>
        <input type="text" placeholder="Search by drive or method..." onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-900/30">
            <tr>
              <th scope="col" className="p-4 cursor-pointer" onClick={() => requestSort('drive')}>Drive</th>
              <th scope="col" className="p-4 cursor-pointer" onClick={() => requestSort('method')}>Method</th>
              <th scope="col" className="p-4 cursor-pointer" onClick={() => requestSort('timestamp')}>Timestamp</th>
              <th scope="col" className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log) => (
              <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="p-4 font-semibold text-white">{log.drive}</td>
                <td className="p-4">{log.method}</td>
                <td className="p-4 font-mono">{log.timestamp}</td>
                <td className="p-4 text-center">
                  {log.verified && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-900/50 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      Verified
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 text-sm text-gray-400">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-700">Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-700">Next</button>
        </div>
      )}
    </div>
  );
};

export default LogsTable;

/*
// --- Example Usage ---
const sampleLogs = [
  { id: '1', drive: 'SAMSUNG 980 PRO', method: 'Sayonara Deep Wipe', timestamp: '2025-09-28 10:00', verified: true },
  { id: '2', drive: 'SEAGATE BARRACUDA', method: 'Sayonara Quick Wipe', timestamp: '2025-09-26 15:30', verified: false },
];
<LogsTable logs={sampleLogs} />
*/