// src/components/AppShell.tsx
import React from "react";
import { Home, MessageSquare, HardDrive, FileText, Settings, Briefcase } from "lucide-react";

const navItems = [
  { id: "main", label: "Dashboard", icon: <Home /> },
  { id: "main", label: "AI Assistant", icon: <MessageSquare /> }, // keep simple id
  { id: "wipeoptions", label: "Wipe Options", icon: <HardDrive /> },
  { id: "reports", label: "Reports", icon: <FileText /> },
  { id: "sme", label: "SME Dashboard", icon: <Briefcase />, pro: true },
  { id: "main", label: "Settings", icon: <Settings /> },
];

export function AppShell({ children, onNavigate }: { children: React.ReactNode; onNavigate?: (page: "main" | "reports" | "sme" | "wipeoptions") => void }) {
  return (
    <div className="flex h-screen bg-background text-white">
      <aside className="w-64 bg-black/60 border-r border-primaryPurple-dark flex flex-col">
        <div className="p-4 text-2xl font-bold text-primaryPurple">Sayonara</div>
        <nav className="flex-1 p-2 space-y-2">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                if (item.id === "sme" && onNavigate) onNavigate("sme");
                else if (item.id === "reports" && onNavigate) onNavigate("reports");
                else if (item.id === "wipeoptions" && onNavigate) onNavigate("wipeoptions");
                else if (onNavigate) onNavigate("main");
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-primaryPurple-dark/20 transition text-left"
            >
              <div className="w-6 h-6">{item.icon}</div>
              <div className="flex-1">{item.label}</div>
              {item.pro && <div className="text-xs text-yellow-400 font-semibold">PRO</div>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
