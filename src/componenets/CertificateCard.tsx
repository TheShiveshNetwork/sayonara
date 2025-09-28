import type { FC } from 'react';

// --- Prop Types ---
type Certificate = { status: 'Verified' | 'Pending'; txHash: string; timestamp: string; explorerUrl: string; };
export type CertificateCardProps = {
  certificate: Certificate;
  onView: () => void;
};

const CertificateCard: FC<CertificateCardProps> = ({ certificate, onView }) => {
  const shortenHash = (hash: string) => `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;

  const statusStyles = {
    Verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  // Download certificate as JSON file
  const handleDownload = () => {
    // TODO: Replace with real PDF generation
    const dummyData = {
      status: certificate.status,
      timestamp: certificate.timestamp,
      txHash: certificate.txHash,
      explorerUrl: certificate.explorerUrl,
      message: "Dummy certificate data - replace with real PDF generation"
    };
    const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "certificate.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="font-inter group relative p-6 bg-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/20 hover:border-purple-500/50">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-white">Wipe Certificate</h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusStyles[certificate.status]}`}>{certificate.status}</span>
      </div>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Timestamp</span>
          <span className="font-mono text-gray-200">{certificate.timestamp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Transaction Hash</span>
          <span className="font-mono text-purple-300">{shortenHash(certificate.txHash)}</span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a href={certificate.explorerUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-center text-sm font-semibold text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">Explorer</a>
        <button onClick={onView} className="px-4 py-2 text-center text-sm font-semibold text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">View Certificate</button>
        <button onClick={handleDownload} className="px-4 py-2 text-center text-sm font-semibold text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">Download PDF</button>
      </div>
    </div>
  );
};

export default CertificateCard;

/*
// --- Example Usage ---
const cert = {
  status: 'Verified',
  txHash: '0x123abc456def7890123abc456def7890123abc456def7890123abc456def7890',
  timestamp: '2025-09-28 13:30:15',
  explorerUrl: '#',
};
<CertificateCard certificate={cert} onDownload={() => {}} onView={() => {}} />
*/