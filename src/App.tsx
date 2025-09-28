// src/App.tsx
import { useState } from "react";
import { AppShell } from "./componenets/AppShell";
import ConfirmModal from "./componenets/ConfirmModal";
import CertificateModal from "./componenets/CertificateModal";
import WipeOptions from "./componenets/WipeOption";
import AIChat from "./componenets/AIChat";
import ProgressRing from "./componenets/ProgressRing";
import CertificateCard from "./componenets/CertificateCard";
import ReportsPage from "./componenets/ReportsPage";
import SMEPage from "./componenets/SMEPage";
import { useDummyHooks } from "./hooks/useDummyHooks";

export default function App() {
  const [view, setView] = useState<"main" | "reports" | "sme" | "wipeoptions">("main");
  const [showCertModal, setShowCertModal] = useState(false);

  const {
    messages,
    sendUserMessage,
    drives,
    selectDrive,
    progress,
    certificate,
    selectedMethod,
    setSelectedMethod,
    confirmationOpen,
    setConfirmationOpen,
    confirmAndExecuteWipe,
    selectedDrive,
    logs,
  } = useDummyHooks();


  return (
    <AppShell onNavigate={(page: "main" | "reports" | "sme" | "wipeoptions") => setView(page)}>
      {view === "sme" ? (
        <SMEPage />
      ) : view === "reports" ? (
        <ReportsPage logs={logs} />
      ) : view === "wipeoptions" ? (
        <div className="h-full bg-black/20 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primaryPurple">Wipe Options & Certificates</h2>
            <button
              onClick={() => setView("main")}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wipe Methods Section */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-primaryPurple mb-4">Available Wipe Methods</h3>
              <div className="space-y-4">
                <WipeOptions
                  selected={selectedMethod}
                  onSelect={(m: string) => setSelectedMethod(m)}
                />
              </div>
            </div>

            {/* Certificate Section */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-primaryPurple mb-4">Erasure Certificates</h3>
              {certificate ? (
                <div className="space-y-4">
                  <CertificateCard
                    certificate={certificate}
                    onView={() => setShowCertModal(true)}
                  />
                  <div className="text-sm text-gray-400">
                    Click "View Details" to see the full certificate with blockchain verification.
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">No certificates generated yet</div>
                  <div className="text-sm text-gray-500">
                    Complete a wipe operation to generate your first certificate
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-6 bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-3">About Wipe Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Quick Wipe</h4>
                <p>Fastest method, removes file pointers and overwrites data once. Suitable for general use.</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Deep Wipe</h4>
                <p>Comprehensive erasure including OS. Ideal for preparing drives for new operating systems.</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Advanced Secure</h4>
                <p>Multiple overwrites following DoD 5220.22-M standard. Maximum security for sensitive data.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN DASHBOARD */
        <div className="grid grid-cols-3 gap-6 h-[80vh] font-inter">
          {/* LEFT: AI Chat */}
          <div className="col-span-1 flex flex-col">
            <div className="bg-black/30 backdrop-blur-md rounded-xl shadow-lg flex-1 overflow-hidden">
              <AIChat
                messages={messages}
                onAction={(action: string) => {
                  if (action === "startWipeQuick") {
                    if (selectedDrive) {
                      setConfirmationOpen(true);
                    } else {
                      // Add a message to select a drive first
                      sendUserMessage("Please select a drive first before starting the wipe process.");
                    }
                  }
                  if (action === "verify_blockchain") setView("reports");
                  if (action === "check_logs") setView("reports");
                }}
                onSend={(text: string) => sendUserMessage(text)}
              />
            </div>
          </div>

          {/* MIDDLE: Drives + Wipe Options */}
          <div className="col-span-1 flex flex-col gap-6">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 shadow-lg flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-primaryPurple mb-4">Drives</h3>
              
              {/* Drives in horizontal layout */}
              <div className="flex gap-4 mb-6">
                {drives.map((drive) => {
                  const isSelected = selectedDrive === drive.id;
                  return (
                    <div key={drive.id} className="flex-1">
                      <div className={`p-4 bg-gray-900/80 backdrop-blur-md border rounded-xl text-left transition-all duration-300 hover:border-purple-500/50 ${isSelected ? 'border-purple-500' : 'border-gray-700/50'}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-white text-sm">{drive.name}</h4>
                            <p className="text-xs text-gray-400">{drive.size}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full" style={{ width: `${drive.usagePct}%` }}></div>
                          </div>
                          <p className="text-xs text-right text-gray-500">{drive.usagePct}% Used</p>
                        </div>
                        <button
                          onClick={() => selectDrive(drive.id)}
                          className={`w-full mt-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Proceed to Wipe Button - only visible when drive is selected */}
              {selectedDrive && (
                <div className="mb-6">
                  <button
                    onClick={() => setConfirmationOpen(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 hover:scale-[1.02] transition-all duration-300"
                  >
                    Proceed to Wipe
                  </button>
                </div>
              )}

              <div className="flex-1">
                <h4 className="font-medium text-white mb-4">Wipe Methods</h4>
                <div className="space-y-3">
                  <WipeOptions
                    selected={selectedMethod}
                    onSelect={(m: string) => setSelectedMethod(m)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Progress + Certificate */}
          <div className="col-span-1 flex flex-col gap-6">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-lg flex items-center justify-center flex-1">
              <div className="w-full flex flex-col items-center">
                <h3 className="text-lg font-semibold text-primaryPurple mb-3">Progress</h3>
                <ProgressRing percent={progress} />
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 shadow-lg flex-1">
              <h3 className="text-lg font-semibold text-primaryPurple mb-3">Certificate</h3>
              {certificate ? (
                <CertificateCard
                  certificate={certificate}
                  onView={() => setView("wipeoptions")}
                />
              ) : (
                <div className="text-gray-400">No certificate yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Wipe Modal */}
      <ConfirmModal
        open={confirmationOpen}
        confirmPhrase="SAYONARA WIPE"
        onCancel={() => setConfirmationOpen(false)}
        onConfirm={confirmAndExecuteWipe}
      />

      {/* Certificate Modal */}
      <CertificateModal
        open={showCertModal}
        certificate={certificate}
        onClose={() => setShowCertModal(false)}
      />
    </AppShell>
  );
}
