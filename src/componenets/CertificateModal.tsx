import type { FC } from 'react';

// --- Prop Types ---
type Certificate = { status: 'Verified' | 'Pending'; txHash: string; timestamp: string; explorerUrl: string; };
export type CertificateModalProps = {
  open: boolean;
  certificate: Certificate | null;
  onClose: () => void;
};

const CertificateModal: FC<CertificateModalProps> = ({ open, certificate, onClose }) => {
  if (!certificate) return null;

  if (!open) return null;

  return (
    <div onClick={onClose} className="font-inter fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/20"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">&times;</button>
        <div className="p-10 text-white">
          <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-purple-200">Sayonara Wipe Certificate</h2>
          <div className="mt-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <p className="text-lg text-gray-300">This document certifies the secure erasure of data.</p>
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <p className="text-sm text-gray-400">Timestamp: <span className="font-mono text-gray-200">{certificate.timestamp}</span></p>
                <p className="text-sm text-gray-400">Transaction Hash:</p>
                <code className="text-xs text-purple-300 break-all">{certificate.txHash}</code>
              </div>
            </div>
            {/* QR Code Placeholder */}
            <div className="p-2 bg-white rounded-lg">
              <div className="w-32 h-32 bg-gray-500"></div>
            </div>
          </div>
          <div className="mt-8 flex justify-center items-center gap-2 border-t border-gray-700 pt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span className="font-semibold text-emerald-400">Blockchain Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;

/*
// --- Example Usage ---
const [isOpen, setIsOpen] = React.useState(true);
const cert = {
  status: 'Verified',
  txHash: '0x123abc456def7890123abc456def7890123abc456def7890123abc456def7890',
  timestamp: '2025-09-28 13:30:15',
  explorerUrl: '#',
};
<CertificateModal open={isOpen} certificate={cert} onClose={() => setIsOpen(false)} />
*/