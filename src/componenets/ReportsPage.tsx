import LogsTable from './LogsTable';

export default function ReportsPage({
  logs,
}: {
  logs: { id: string; drive: string; method: string; timestamp: string; verified: boolean }[];
}) {
  // Export logs as CSV file
  const handleExportCSV = () => {
    // TODO: Replace with real CSV generation
    const csvHeaders = "ID,Drive,Method,Timestamp,Verified\n";
    const csvRows = logs.map(log => 
      `${log.id},${log.drive},${log.method},${log.timestamp},${log.verified ? 'Yes' : 'No'}`
    ).join('\n');
    const csvContent = csvHeaders + csvRows;
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export PDF report as text file
  const handleExportPDF = () => {
    // TODO: Replace with real PDF generation
    const reportContent = `SAYONARA WIPE REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY:
- Total Operations: ${logs.length}
- Verified: ${logs.filter(l => l.verified).length}
- Unverified: ${logs.filter(l => !l.verified).length}

DETAILED LOGS:
${logs.map(log => 
  `ID: ${log.id} | Drive: ${log.drive} | Method: ${log.method} | Date: ${log.timestamp} | Status: ${log.verified ? 'Verified' : 'Unverified'}`
).join('\n')}

This is a dummy report - replace with real PDF generation.`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primaryPurple">Reports & Logs</h2>
        <div className="text-sm text-gray-400">
          {logs.length} wipe operation{logs.length !== 1 ? 's' : ''} recorded
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LogsTable logs={logs} />
        </div>
        
        <div className="space-y-4">
          <div className="bg-black/40 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Operations:</span>
                <span className="text-white">{logs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Verified:</span>
                <span className="text-green-400">{logs.filter(l => l.verified).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Unverified:</span>
                <span className="text-red-400">{logs.filter(l => !l.verified).length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black/40 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Export Options</h3>
            <div className="space-y-2">
              <button onClick={handleExportCSV} className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
                Export CSV
              </button>
              <button onClick={handleExportPDF} className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 text-sm">
                Export PDF Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
