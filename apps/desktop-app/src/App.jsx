import React, { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import Sidebar from '../../desktop-app/src/components/Sidebar';
import Controls from '../../desktop-app/src/components/Controls';
import LogsPanel from '../../desktop-app/src/components/LogsPanel';
import ChatWindow from '../../desktop-app/src/components/ChatWindow';
import ConfirmModal from '../../desktop-app/src/components/ConfirmModal';
import IsoModal from '../../desktop-app/src/components/IsoModal';

function App() {
  const [theme, setTheme] = useState('dark');
  const [logs, setLogs] = useState([]);
  const [isErasing, setIsErasing] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showIsoModal, setShowIsoModal] = useState(false);
  const [erasureConfig, setErasureConfig] = useState(null);
  const [isoData, setIsoData] = useState(null);
  const [certificate, setCertificate] = useState(null);

  // Mock drive data
  const [drives] = useState([
    { id: 'drive-1', model: 'Samsung SSD 980 PRO', size: '1TB', type: 'SSD' },
    { id: 'drive-2', model: 'WD Black HDD', size: '2TB', type: 'HDD' },
    { id: 'drive-3', model: 'Seagate Barracuda', size: '4TB', type: 'HDD' }
  ]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('sayonara-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    let unlistenLog;
    let unlistenEnd;

    const setupListeners = async () => {
      try {
        unlistenLog = await listen('erase-log', (event) => {
          const logEntry = {
            timestamp: new Date().toISOString(),
            message: event.payload.message,
            level: event.payload.level || 'info'
          };
          setLogs(prev => [...prev, logEntry]);
        });

        unlistenEnd = await listen('erase-end', (event) => {
          setIsErasing(false);
          const logEntry = {
            timestamp: new Date().toISOString(),
            message: `Erasure completed with exit code: ${event.payload.exitCode}`,
            level: event.payload.exitCode === 0 ? 'success' : 'error'
          };
          setLogs(prev => [...prev, logEntry]);

          if (currentJobId && event.payload.exitCode === 0) {
            handleCertificateVerification(currentJobId);
          }
          setCurrentJobId(null);
        });
      } catch (error) {
        console.error('Failed to set up event listeners:', error);
      }
    };

    setupListeners();

    return () => {
      if (unlistenLog) unlistenLog();
      if (unlistenEnd) unlistenEnd();
    };
  }, [currentJobId]);

  const handleCertificateVerification = async (jobId) => {
    try {
      const result = await invoke('verify_certificate', { jobId });
      setCertificate(result);

      const logEntry = {
        timestamp: new Date().toISOString(),
        message: `Certificate ${result.valid ? 'verified successfully' : 'verification failed'}`,
        level: result.valid ? 'success' : 'error'
      };
      setLogs(prev => [...prev, logEntry]);
    } catch (error) {
      console.error('Certificate verification failed:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('sayonara-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleEraseRequest = (config) => {
    setErasureConfig(config);
    setShowConfirmModal(true);
  };

  const handleEraseConfirm = async () => {
    setShowConfirmModal(false);
    setIsErasing(true);
    setCertificate(null);

    try {
      const jobId = await invoke('start_erase', {
        mode: erasureConfig.mode,
        driveId: erasureConfig.driveId,
        wipeOs: erasureConfig.mode === 'os-only'
      });

      setCurrentJobId(jobId);

      const logEntry = {
        timestamp: new Date().toISOString(),
        message: `Started ${erasureConfig.mode} erasure on drive ${erasureConfig.driveId}`,
        level: 'info'
      };
      setLogs(prev => [...prev, logEntry]);

    } catch (error) {
      setIsErasing(false);
      console.error('Failed to start erasure:', error);
      const logEntry = {
        timestamp: new Date().toISOString(),
        message: `Failed to start erasure: ${error}`,
        level: 'error'
      };
      setLogs(prev => [...prev, logEntry]);
    }
  };

  const handleIsoGeneration = async (config) => {
    try {
      const result = await invoke('prepare_iso', {
        mode: config.mode,
        driveId: config.driveId
      });

      setIsoData(result);
      setShowIsoModal(true);

      const logEntry = {
        timestamp: new Date().toISOString(),
        message: `Generated bootable ISO for ${config.mode} mode`,
        level: 'info'
      };
      setLogs(prev => [...prev, logEntry]);

    } catch (error) {
      console.error('Failed to generate ISO:', error);
      const logEntry = {
        timestamp: new Date().toISOString(),
        message: `Failed to generate ISO: ${error}`,
        level: 'error'
      };
      setLogs(prev => [...prev, logEntry]);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <Sidebar
            drives={drives}
            theme={theme}
            onThemeToggle={toggleTheme}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <Controls
              drives={drives}
              onEraseRequest={handleEraseRequest}
              onIsoGeneration={handleIsoGeneration}
              isErasing={isErasing}
            />
          </div>

          <div className="flex-1 flex">
            <div className="flex-1 p-4">
              <ChatWindow />

              {certificate && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Certificate Verification
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Status: {certificate.valid ? 'Valid' : 'Invalid'}
                  </p>
                  {certificate.blockchainTx && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Blockchain TX: {certificate.blockchainTx}
                    </p>
                  )}
                  {certificate.signature && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Signature: {certificate.signature.substring(0, 32)}...
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="w-80 border-l border-gray-200 dark:border-gray-700">
              <LogsPanel
                logs={logs}
                onClear={clearLogs}
              />
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleEraseConfirm}
          config={erasureConfig}
        />

        <IsoModal
          isOpen={showIsoModal}
          onClose={() => setShowIsoModal(false)}
          isoData={isoData}
        />
      </div>
    </div>
  );
}

export default App;