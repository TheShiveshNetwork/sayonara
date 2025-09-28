// src/hooks/useDummyHooks.ts
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
// Note: wipe methods are defined inside the UI component; keep a local default id here

type Msg = { id: string; from: "ai" | "user"; text: string; time?: string; meta?: any };

export function useDummyHooks() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [drives] = useState([{ id: "c", name: "C: SSD", size: "512 GB", usagePct: 75 }, { id: "d", name: "D: HDD", size: "1 TB", usagePct: 40 }]);
  const [selectedDrive, setSelectedDrive] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>('deep'); // default to Sayonara Deep Wipe
  const [progress, setProgress] = useState(0);
  const [certificate, setCertificate] = useState<{ status: 'Verified' | 'Pending'; txHash: string; timestamp: string; explorerUrl: string } | null>(null);
  const [recommendAccepted, setRecommendAccepted] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [logs] = useState([
    { id: '1', drive: 'C: SSD', method: 'Sayonara Deep Wipe', timestamp: '2025-01-15 14:30', verified: true },
    { id: '2', drive: 'D: HDD', method: 'Sayonara Quick Wipe', timestamp: '2025-01-15 12:15', verified: true },
    { id: '3', drive: 'E: USB', method: 'Sayonara Advanced Secure', timestamp: '2025-01-14 16:45', verified: false },
  ]);

  useEffect(() => {
    // initial message with recommendation metadata (AI recommends 3-pass)
    setMessages([
      {
        id: uuidv4(),
        from: "ai",
        text: "Welcome to Sayonara AI — I recommend Sayonara Secure 3-Pass for most SSDs.",
        time: new Date().toLocaleString(),
        meta: { recommendation: true, recommendationLabel: "Sayonara Secure 3-Pass" }
      }
    ]);
  }, []);

  const sendUserMessage = useCallback((text: string) => {
    const m: Msg = { id: uuidv4(), from: "user", text, time: new Date().toLocaleString() };
    setMessages((s) => [...s, m]);
  }, []);

  const selectDrive = useCallback((id: string) => {
    setSelectedDrive(id);
    setMessages((s) => [...s, { id: uuidv4(), from: "ai", text: `Selected ${id}. I recommend Sayonara Deep Wipe.`, time: new Date().toLocaleString() }]);
  }, []);

  const acceptRecommendation = useCallback(() => {
    setRecommendAccepted(true);
    setMessages((s) => [...s, { id: uuidv4(), from: "user", text: "Accepted recommendation", time: new Date().toLocaleString() }]);
  }, []);

  const declineRecommendation = useCallback(() => {
    setRecommendAccepted(false);
    setMessages((s) => [...s, { id: uuidv4(), from: "user", text: "Declined recommendation", time: new Date().toLocaleString() }]);
  }, []);

  const startWipe = useCallback((_driveId?: string) => {
    // open confirmation modal rather than starting immediately
    setConfirmationOpen(true);
    setMessages((s) => [...s, { id: uuidv4(), from: "ai", text: "Please confirm the wipe action by typing the confirmation phrase.", time: new Date().toLocaleString() }]);
  }, []);

  const confirmAndExecuteWipe = useCallback(() => {
    // close modal and simulate wipe progress
    setConfirmationOpen(false);
    setProgress(0);
    setMessages((s) => [...s, { id: uuidv4(), from: "ai", text: "Wipe started. Running Sayonara method: " + (selectedMethod ?? "sayonara-3pass"), time: new Date().toLocaleString() }]);
    let pct = 0;
    const t = setInterval(() => {
      pct += Math.random() * 12;
      if (pct >= 100) {
        pct = 100;
        clearInterval(t);
        const tx = "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6);
        const ts = new Date().toLocaleString();
        setCertificate({ status: "Verified", txHash: tx, timestamp: ts, explorerUrl: '#' });
        setMessages((s) => [...s, { id: uuidv4(), from: "ai", text: "Wipe complete. Certificate anchored on blockchain.", time: ts }]);
      }
      setProgress(pct);
    }, 700);
  }, [selectedMethod]);

  const anchorDummy = useCallback(() => {
    const tx = "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6);
    const ts = new Date().toLocaleString();
    setCertificate({ status: "Verified", txHash: tx, timestamp: ts, explorerUrl: '#' });
    setMessages((s) => [...s, { id: uuidv4(), from: "ai", text: "Anchored dummy certificate on blockchain (testnet).", time: ts }]);
  }, []);

  return {
    messages,
    sendUserMessage,
    drives,
    selectDrive,
    startWipe,
    progress,
    certificate,
    anchorDummy,
    selectedMethod,
    setSelectedMethod,
    recommendAccepted,
    acceptRecommendation,
    declineRecommendation,
    confirmationOpen,
    setConfirmationOpen,
    confirmAndExecuteWipe,
    selectedDrive,
    logs
  };
}
