import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  TrendingUp, 
  Shield, 
  Leaf, 
  Download, 
  ExternalLink, 
  CheckCircle,
  FileText,
  Award,
  BarChart3,
} from 'lucide-react';

// --- Types ---
type CSRMetrics = {
  eWasteRecycled: number;
  co2Savings: number;
  devicesWiped: number;
};

type MonthlyData = {
  month: string;
  eWaste: number;
  co2Saved: number;
};

type DeviceDistribution = {
  name: string;
  value: number;
  color: string;
};

type Certificate = {
  id: string;
  device: string;
  date: string;
  status: 'Verified' | 'Pending';
  txHash: string;
};

// --- Dummy Data ---
const csrMetrics: CSRMetrics = {
  eWasteRecycled: 1247,
  co2Savings: 892,
  devicesWiped: 156
};

const monthlyData: MonthlyData[] = [
  { month: 'Aug', eWaste: 980, co2Saved: 720 },
  { month: 'Sep', eWaste: 1120, co2Saved: 810 },
  { month: 'Oct', eWaste: 1080, co2Saved: 780 },
  { month: 'Nov', eWaste: 1340, co2Saved: 960 },
  { month: 'Dec', eWaste: 1180, co2Saved: 850 },
  { month: 'Jan', eWaste: 1247, co2Saved: 892 }
];

const deviceDistribution: DeviceDistribution[] = [
  { name: 'Laptops', value: 45, color: '#9333EA' },
  { name: 'Phones', value: 30, color: '#10B981' },
  { name: 'Desktops', value: 20, color: '#F59E0B' },
  { name: 'Other', value: 5, color: '#EF4444' }
];

const certificates: Certificate[] = [
  { id: 'CERT-001', device: 'Dell Latitude 5520', date: '2025-01-15', status: 'Verified', txHash: '0x1234...5678' },
  { id: 'CERT-002', device: 'MI 13 Pro', date: '2025-01-14', status: 'Verified', txHash: '0x2345...6789' },
  { id: 'CERT-003', device: 'HP EliteBook 840', date: '2025-01-13', status: 'Verified', txHash: '0x3456...7890' },
  { id: 'CERT-004', device: 'Samsung Galaxy S21', date: '2025-01-12', status: 'Verified', txHash: '0x4567...8901' },
  { id: 'CERT-005', device: 'MacBook Pro 16"', date: '2025-01-11', status: 'Verified', txHash: '0x5678...9012' }
];

// --- Stat Card Component ---
const StatCard = ({ 
  icon: Icon, 
  value, 
  label, 
  trend 
}: { 
  icon: any; 
  value: string; 
  label: string; 
  trend?: string; 
}) => (
  <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-purple-600/20 rounded-lg">
        <Icon className="h-6 w-6 text-purple-400" />
      </div>
      {trend && (
        <div className="flex items-center text-emerald-400 text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          {trend}
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-gray-400">{label}</div>
  </div>
);

// --- Main Component ---
export default function SMEPage() {

  const handleExportReport = () => {
    // TODO: Replace with real PDF generation
    const reportContent = `SAYONARA SME MONTHLY REPORT
Generated: ${new Date().toLocaleString()}

CSR METRICS:
- E-Waste Recycled: ${csrMetrics.eWasteRecycled} kg
- CO₂ Savings: ${csrMetrics.co2Savings} kg
- Devices Securely Wiped: ${csrMetrics.devicesWiped}

MONTHLY TRENDS:
${monthlyData.map(data => 
  `${data.month}: ${data.eWaste}kg e-waste, ${data.co2Saved}kg CO₂ saved`
).join('\n')}

DEVICE DISTRIBUTION:
${deviceDistribution.map(device => 
  `${device.name}: ${device.value}%`
).join('\n')}

CERTIFICATES ISSUED: ${certificates.length}
${certificates.map(cert => 
  `${cert.id}: ${cert.device} (${cert.date}) - ${cert.status}`
).join('\n')}

This is a dummy report - replace with real PDF generation.`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "monthly-report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSR = () => {
    // TODO: Replace with real CSR certificate generation
    const csrData = {
      company: "Sample Enterprise",
      reportPeriod: "January 2025",
      eWasteRecycled: csrMetrics.eWasteRecycled,
      co2Savings: csrMetrics.co2Savings,
      devicesWiped: csrMetrics.devicesWiped,
      certificatesIssued: certificates.length,
      verifiedCertificates: certificates.filter(c => c.status === 'Verified').length,
      generatedAt: new Date().toISOString(),
      message: "Dummy CSR certificate data - replace with real certificate generation"
    };
    
    const blob = new Blob([JSON.stringify(csrData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "csr-certificate.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleViewExplorer = (txHash: string) => {
    console.log(`Opening explorer for ${txHash}`);
    // TODO: Open blockchain explorer
  };

  const handleDownloadPDF = (certId: string) => {
    // TODO: Replace with real PDF generation
    const cert = certificates.find(c => c.id === certId);
    const certData = {
      certificateId: certId,
      device: cert?.device || 'Unknown Device',
      date: cert?.date || 'Unknown Date',
      status: cert?.status || 'Unknown',
      txHash: cert?.txHash || 'Unknown',
      generatedAt: new Date().toISOString(),
      message: "Dummy certificate PDF data - replace with real PDF generation"
    };
    
    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `certificate-${certId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-inter">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
            SME Dashboard
          </h1>
          <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full text-sm font-semibold text-white shadow-lg">
            Pro
          </div>
        </div>
        <p className="text-xl text-gray-300">
          Corporate Sustainability & E-Waste Metrics
        </p>
      </div>

      {/* CSR Metrics Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <BarChart3 className="h-6 w-6 mr-3 text-purple-400" />
          CSR Metrics Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={Shield}
            value={`${csrMetrics.eWasteRecycled.toLocaleString()} kg`}
            label="E-Waste Recycled This Month"
            trend="+12%"
          />
          <StatCard
            icon={Leaf}
            value={`${csrMetrics.co2Savings.toLocaleString()} kg`}
            label="CO₂ Savings"
            trend="+8%"
          />
          <StatCard
            icon={Award}
            value={csrMetrics.devicesWiped.toLocaleString()}
            label="Devices Securely Wiped"
            trend="+15%"
          />
        </div>
      </div>

      {/* Graphs & Trends */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-3 text-purple-400" />
          Trends & Analytics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly E-Waste Chart */}
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">E-Waste Recycled (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="eWaste" 
                  stroke="#9333EA" 
                  strokeWidth={3}
                  dot={{ fill: '#9333EA', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#9333EA', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Device Distribution Chart */}
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Device Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Certificates Management */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <FileText className="h-6 w-6 mr-3 text-purple-400" />
          Certificates Management
        </h2>
        <div className="bg-black/30 backdrop-blur-md rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Certificate ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-purple-300">
                      {cert.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {cert.device}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {cert.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
                        <span className="text-sm text-emerald-400 font-medium">
                          {cert.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleDownloadPDF(cert.id)}
                        className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-md hover:bg-purple-600/30 transition-colors text-xs"
                      >
                        <Download className="h-3 w-3 inline mr-1" />
                        PDF
                      </button>
                      <button
                        onClick={() => handleViewExplorer(cert.txHash)}
                        className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-md hover:bg-gray-600/50 transition-colors text-xs"
                      >
                        <ExternalLink className="h-3 w-3 inline mr-1" />
                        Explorer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export & Reports */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Download className="h-6 w-6 mr-3 text-purple-400" />
          Export & Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleExportReport}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
          >
            <FileText className="h-5 w-5 mr-3" />
            Export Monthly Report (PDF)
          </button>
          <button
            onClick={handleDownloadCSR}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
          >
            <Award className="h-5 w-5 mr-3" />
            Download CSR Certificate
          </button>
        </div>
      </div>
    </div>
  );
}

/*
// --- Example Usage in App.tsx ---
// 
// import SMEPage from "./componenets/SMEPage";
// 
// // In your App component's render method:
// {view === "sme" ? (
//   <SMEPage />
// ) : view === "reports" ? (
//   <ReportsPage logs={logs} />
// ) : view === "wipeoptions" ? (
//   // ... wipe options content
// ) : (
//   // ... main dashboard content
// )}
*/