import { useState, useCallback } from 'react';

// Exported types
export interface BlockchainAnchor {
  txHash: string;
  explorerUrl: string;
  timestamp: Date;
  blockNumber?: number;
  gasUsed?: string;
  networkName: string;
}

export interface VerificationResult {
  status: 'Verified' | 'Pending' | 'Failed';
  timestamp: Date;
  confirmations?: number;
  blockNumber?: number;
}

export interface UseBlockchainReturn {
  isAnchoring: boolean;
  isVerifying: boolean;
  anchorHistory: BlockchainAnchor[];
  anchorHash: (hash: string) => Promise<BlockchainAnchor>;
  verifyTx: (txHash: string) => Promise<VerificationResult>;
  clearHistory: () => void;
}

// Hook implementation
export const useBlockchain = (): UseBlockchainReturn => {
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [anchorHistory, setAnchorHistory] = useState<BlockchainAnchor[]>([]);

  const generateTxHash = useCallback((): string => {
    // Generate a realistic 64-character hex transaction hash
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }, []);

  const generateGasUsed = useCallback((): string => {
    // Generate realistic gas usage (21000-80000 range)
    const gasUsed = Math.floor(Math.random() * 59000) + 21000;
    return gasUsed.toString();
  }, []);

  const generateBlockNumber = useCallback((): number => {
    // Generate realistic Sepolia testnet block number
    const baseBlock = 4500000; // Approximate current Sepolia block range
    return baseBlock + Math.floor(Math.random() * 100000);
  }, []);

  const anchorHash = useCallback(async (_hash: string): Promise<BlockchainAnchor> => {
    setIsAnchoring(true);
    
    try {
      // Simulate blockchain network delay (2-4 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      // TODO: Replace this simulation with real blockchain anchoring:
      // Option 1: Frontend signing with ethers.js
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(contractAddress, contractABI, signer);
      // const tx = await contract.anchorHash(hash, { gasLimit: 100000 });
      // const receipt = await tx.wait();
      
      // Option 2: Backend signing via Tauri command
      // const anchor = await invoke('anchor_hash_to_blockchain', { 
      //   hash,
      //   network: 'sepolia',
      //   contractAddress: '0x...' 
      // });
      
      // Option 3: API call to backend service with wallet integration
      // const response = await fetch('/api/blockchain/anchor', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ hash, network: 'sepolia' })
      // });
      // const anchor = await response.json();

      const txHash = generateTxHash();
      const timestamp = new Date();
      const blockNumber = generateBlockNumber();
      const gasUsed = generateGasUsed();
      
      const anchor: BlockchainAnchor = {
        txHash,
        explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
        timestamp,
        blockNumber,
        gasUsed,
        networkName: 'Ethereum Sepolia Testnet',
      };

      // Add to history (most recent first)
      setAnchorHistory(prev => [anchor, ...prev]);
      
      return anchor;
    } catch (error) {
      console.error('Failed to anchor hash to blockchain:', error);
      throw new Error('Blockchain anchoring failed');
    } finally {
      setIsAnchoring(false);
    }
  }, [generateTxHash, generateBlockNumber, generateGasUsed]);

  const verifyTx = useCallback(async (_txHash: string): Promise<VerificationResult> => {
    setIsVerifying(true);
    
    try {
      // Simulate verification delay (1-2 seconds)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // TODO: Replace this simulation with real blockchain verification:
      // Option 1: Using ethers.js provider to check transaction
      // const provider = new ethers.providers.InfuraProvider('sepolia', INFURA_KEY);
      // const tx = await provider.getTransaction(txHash);
      // const receipt = await provider.getTransactionReceipt(txHash);
      // if (!tx) {
      //   return { status: 'Failed', timestamp: new Date() };
      // }
      // return {
      //   status: receipt ? 'Verified' : 'Pending',
      //   timestamp: new Date(tx.timestamp * 1000),
      //   confirmations: receipt ? receipt.confirmations : 0,
      //   blockNumber: receipt ? receipt.blockNumber : undefined
      // };
      
      // Option 2: Via Tauri backend command
      // const verification = await invoke('verify_blockchain_transaction', { 
      //   txHash,
      //   network: 'sepolia'
      // });
      
      // Option 3: API call to blockchain explorer or backend
      // const response = await fetch(`/api/blockchain/verify/${txHash}`);
      // const verification = await response.json();

      // As requested, always return "Verified" status with current timestamp
      const verification: VerificationResult = {
        status: 'Verified',
        timestamp: new Date(),
        confirmations: Math.floor(Math.random() * 50) + 12, // 12-62 confirmations
        blockNumber: generateBlockNumber(),
      };
      
      return verification;
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      throw new Error('Transaction verification failed');
    } finally {
      setIsVerifying(false);
    }
  }, [generateBlockNumber]);

  const clearHistory = useCallback(() => {
    setAnchorHistory([]);
  }, []);

  return {
    isAnchoring,
    isVerifying,
    anchorHistory,
    anchorHash,
    verifyTx,
    clearHistory,
  };
};

// Utility functions for blockchain integration
export const formatTxHash = (hash: string, startChars = 6, endChars = 4): string => {
  if (hash.length <= startChars + endChars) return hash;
  return `${hash.substring(0, startChars)}...${hash.substring(hash.length - endChars)}`;
};

export const validateTxHash = (hash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
};

export const formatGasUsed = (gasUsed: string): string => {
  const gas = parseInt(gasUsed);
  return gas.toLocaleString();
};

/*
Example usage:

const BlockchainComponent = () => {
  const { 
    isAnchoring,
    isVerifying, 
    anchorHistory, 
    anchorHash, 
    verifyTx, 
    clearHistory 
  } = useBlockchain();

  const [hashInput, setHashInput] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleAnchorHash = async () => {
    if (!hashInput.trim()) {
      alert('Please enter a hash to anchor');
      return;
    }
    
    try {
      const anchor = await anchorHash(hashInput);
      console.log('Hash anchored successfully:', anchor);
      setHashInput(''); // Clear input after success
      alert(`Hash anchored! Transaction: ${formatTxHash(anchor.txHash)}`);
    } catch (error) {
      console.error('Anchoring failed:', error);
      alert('Failed to anchor hash to blockchain');
    }
  };

  const handleVerifyTx = async () => {
    if (!verificationInput.trim()) {
      alert('Please enter a transaction hash to verify');
      return;
    }
    
    if (!validateTxHash(verificationInput)) {
      alert('Please enter a valid transaction hash (0x followed by 64 hex characters)');
      return;
    }
    
    try {
      const result = await verifyTx(verificationInput);
      setVerificationResult(result);
      console.log('Verification result:', result);
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Failed to verify transaction');
    }
  };

  const handleQuickVerify = async (txHash: string) => {
    setVerificationInput(txHash);
    try {
      const result = await verifyTx(txHash);
      setVerificationResult(result);
    } catch (error) {
      console.error('Quick verification failed:', error);
    }
  };

  return (
    <div className="blockchain-interface">
      <div className="blockchain-section">
        <h3>Blockchain Anchoring</h3>
        <p>Anchor wipe completion hashes to the blockchain for immutable proof.</p>
        
        <div className="anchor-controls">
          <div className="input-group">
            <label htmlFor="hash-input">Hash to Anchor:</label>
            <input
              id="hash-input"
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter SHA256 hash of wipe certificate..."
              disabled={isAnchoring}
            />
            <button 
              onClick={handleAnchorHash}
              disabled={isAnchoring || !hashInput.trim()}
              className="anchor-button"
            >
              {isAnchoring ? 'Anchoring to Blockchain...' : 'Anchor Hash'}
            </button>
          </div>
          
          {isAnchoring && (
            <div className="anchoring-status">
              <div className="loading-spinner"></div>
              <span>Broadcasting transaction to Ethereum Sepolia...</span>
            </div>
          )}
        </div>
      </div>

      <div className="verification-section">
        <h3>Transaction Verification</h3>
        
        <div className="verify-controls">
          <div className="input-group">
            <label htmlFor="tx-input">Transaction Hash:</label>
            <input
              id="tx-input"
              type="text"
              value={verificationInput}
              onChange={(e) => setVerificationInput(e.target.value)}
              placeholder="Enter transaction hash (0x...)"
              disabled={isVerifying}
            />
            <button 
              onClick={handleVerifyTx}
              disabled={isVerifying || !verificationInput.trim()}
              className="verify-button"
            >
              {isVerifying ? 'Verifying...' : 'Verify Transaction'}
            </button>
          </div>
          
          {verificationResult && (
            <div className={`verification-result ${verificationResult.status.toLowerCase()}`}>
              <h4>Verification Result</h4>
              <div className="result-details">
                <div className="status">
                  Status: <strong className={verificationResult.status.toLowerCase()}>
                    {verificationResult.status}
                  </strong>
                </div>
                <div className="timestamp">
                  Verified At: {verificationResult.timestamp.toLocaleString()}
                </div>
                {verificationResult.confirmations && (
                  <div className="confirmations">
                    Confirmations: {verificationResult.confirmations}
                  </div>
                )}
                {verificationResult.blockNumber && (
                  <div className="block">
                    Block Number: {verificationResult.blockNumber.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="history-section">
        <div className="history-header">
          <h3>Anchor History ({anchorHistory.length})</h3>
          {anchorHistory.length > 0 && (
            <button onClick={clearHistory} className="clear-button">
              Clear History
            </button>
          )}
        </div>
        
        {anchorHistory.length === 0 ? (
          <div className="no-history">
            <p>No anchored hashes yet. Anchor your first wipe certificate above.</p>
          </div>
        ) : (
          <div className="history-list">
            {anchorHistory.map((anchor, index) => (
              <div key={index} className="history-item">
                <div className="anchor-header">
                  <div className="tx-hash">
                    <strong>Transaction:</strong> 
                    <code>{formatTxHash(anchor.txHash)}</code>
                    <button 
                      onClick={() => handleQuickVerify(anchor.txHash)}
                      className="quick-verify-btn"
                      title="Quick verify this transaction"
                    >
                      ✓
                    </button>
                  </div>
                  <div className="timestamp">
                    {anchor.timestamp.toLocaleString()}
                  </div>
                </div>
                
                <div className="anchor-details">
                  <span className="network">{anchor.networkName}</span>
                  {anchor.blockNumber && (
                    <span className="block">Block #{anchor.blockNumber.toLocaleString()}</span>
                  )}
                  {anchor.gasUsed && (
                    <span className="gas">Gas: {formatGasUsed(anchor.gasUsed)}</span>
                  )}
                </div>
                
                <div className="anchor-actions">
                  <a 
                    href={anchor.explorerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="explorer-link"
                  >
                    View on Etherscan ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="blockchain-info">
        <small>
          <strong>Network:</strong> Ethereum Sepolia Testnet<br/>
          <strong>Explorer:</strong> sepolia.etherscan.io<br/>
          <strong>Gas Estimation:</strong> ~50,000-80,000 gas per anchor transaction
        </small>
      </div>
    </div>
  );
};
*/