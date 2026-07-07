import { useState, useEffect } from "react";
import { 
  Project, Cluster, Unit, Lead, SalesPerson, 
  Booking, Material, COA, JournalEntry 
} from "./types";
import { ERPApi } from "./lib/store";

// Submodules
import InteractiveSiteplan from "./components/InteractiveSiteplan";
import DashboardOverview from "./components/DashboardOverview";
import CrmLeads from "./components/CrmLeads";
import BookingManager from "./components/BookingManager";
import ConstructionWarehouse from "./components/ConstructionWarehouse";
import AccountingCommissions from "./components/AccountingCommissions";
import PortalsSimulator from "./components/PortalsSimulator";
import AiAssistant from "./components/AiAssistant";

// Icons
import { 
  LayoutDashboard, Layers, Users, Landmark, 
  BookOpen, Bot, Shield, HelpCircle, 
  Bell, Search, Map, Sparkles, Building2
} from "lucide-react";

export default function App() {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "leads" | "bookings" | "construction" | "accounting" | "portals" | "ai-studio">("dashboard");

  // Core Global States synced via LocalStorage
  const [projects, setProjects] = useState<Project[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sales, setSales] = useState<SalesPerson[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [coa, setCOA] = useState<COA[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<string[]>([
    "Sistem Berhasil Sinkronisasi dengan WhatsApp API Gateway",
    "Pembaruan database: 15 Kavling Cluster Tulip terdaftar."
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load initial dataset from Storage API
  useEffect(() => {
    setProjects(ERPApi.getProjects());
    setClusters(ERPApi.getClusters());
    setUnits(ERPApi.getUnits());
    setLeads(ERPApi.getLeads());
    setSales(ERPApi.getSales());
    setBookings(ERPApi.getBookings());
    setMaterials(ERPApi.getMaterials());
    setCOA(ERPApi.getCOA());
    setJournals(ERPApi.getJournals());
  }, []);

  // Sync back to storage on updates
  const handleUpdateUnits = (updatedUnits: Unit[]) => {
    setUnits(updatedUnits);
    ERPApi.saveUnits(updatedUnits);
  };

  const handleUpdateLeads = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    ERPApi.saveLeads(updatedLeads);
  };

  const handleUpdateBookings = (updatedBookings: Booking[]) => {
    setBookings(updatedBookings);
    ERPApi.saveBookings(updatedBookings);
  };

  const handleUpdateMaterials = (updatedMaterials: Material[]) => {
    setMaterials(updatedMaterials);
    ERPApi.saveMaterials(updatedMaterials);
  };

  const handleUpdateCOA = (updatedCOA: COA[]) => {
    setCOA(updatedCOA);
    ERPApi.saveCOA(updatedCOA);
  };

  const handleUpdateJournals = (updatedJournals: JournalEntry[]) => {
    setJournals(updatedJournals);
    ERPApi.saveJournals(updatedJournals);
  };

  const handleUpdateSales = (updatedSales: SalesPerson[]) => {
    setSales(updatedSales);
    ERPApi.saveSales(updatedSales);
  };

  const handleAddNotification = (note: string) => {
    setNotifications([note, ...notifications]);
  };

  // Quick unit update on siteplan spec sheet
  const handleUpdateUnit = (updatedUnit: Unit) => {
    const nextUnits = units.map(u => u.id === updatedUnit.id ? updatedUnit : u);
    handleUpdateUnits(nextUnits);
    handleAddNotification(`Parameter Unit ${updatedUnit.blockName}-${updatedUnit.number} diperbarui.`);
  };

  const handleInitiateBookingFromSiteplan = (unit: Unit) => {
    setActiveTab("bookings");
    handleAddNotification(`Silakan melengkapi registrasi booking untuk unit ${unit.blockName}-${unit.number}.`);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-56 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-extrabold text-white text-lg">
            R
          </div>
          <div>
            <span className="font-extrabold text-white tracking-tight block text-sm leading-none">RR Property</span>
            <span className="text-[10px] text-emerald-400 font-mono">ERP Enterprise v1.0</span>
          </div>
        </div>

        {/* Navigation lists */}
        <nav className="flex-1 p-2 space-y-0.5 text-[12px] overflow-y-auto">
          <div className="px-3 py-1.5 text-emerald-400 font-bold uppercase text-[9px] tracking-wider">
            Main Dashboard
          </div>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors font-semibold text-left ${activeTab === "dashboard" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview & Analytics
          </button>
          <button 
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors font-semibold text-left ${activeTab === "projects" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <Layers className="w-4 h-4" /> Master & Siteplan Matrix
          </button>

          <div className="px-3 py-1.5 mt-4 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
            Operations
          </div>
          <button 
            onClick={() => setActiveTab("leads")}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors font-semibold text-left ${activeTab === "leads" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <Users className="w-4 h-4" /> CRM & Leads Pipeline
          </button>
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors font-semibold text-left ${activeTab === "bookings" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <BookOpen className="w-4 h-4" /> Booking & Legal SPU
          </button>
          <button 
            onClick={() => setActiveTab("construction")}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors font-semibold text-left ${activeTab === "construction" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <Building2 className="w-4 h-4" /> Teknik & Stock Gudang
          </button>

          <div className="px-3 py-1.5 mt-4 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
            Finance & Portals
          </div>
          <button 
            onClick={() => setActiveTab("accounting")}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors font-semibold text-left ${activeTab === "accounting" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <Landmark className="w-4 h-4" /> Ledger & Pajak PPN
          </button>
          <button 
            onClick={() => setActiveTab("portals")}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors font-semibold text-left ${activeTab === "portals" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <Shield className="w-4 h-4" /> Portals Simulator
          </button>

          <div className="px-3 py-1.5 mt-4 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
            AI Cognitive Studio
          </div>
          <button 
            onClick={() => setActiveTab("ai-studio")}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors font-semibold text-left ${activeTab === "ai-studio" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <Bot className="w-4 h-4" /> AI Assistant & Forecast
          </button>
        </nav>

        {/* User profile footer card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs select-none">
            HW
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-white truncate">Hendra Wijaya</p>
            <p className="text-[10px] text-slate-500 font-mono">General Manager</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky Header */}
        <header className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              {activeTab === "dashboard" && "Dashboard Executive Overview"}
              {activeTab === "projects" && "Master Projects & Interactive Siteplan Grid"}
              {activeTab === "leads" && "CRM Pipelines & WhatsApp Communication Terminal"}
              {activeTab === "bookings" && "Pemesanan Unit, SPU & Checklist Legalitas Sertifikat"}
              {activeTab === "construction" && "Logistik Gudang & Surat Perintah Kerja Konstruksi"}
              {activeTab === "accounting" && "Double-Entry Ledger, Financial Statements & Komisi Sales"}
              {activeTab === "portals" && "Simulasi Portal Multi-User (Pembeli & Subkontraktor)"}
              {activeTab === "ai-studio" && "AI Cognitive Assistant & Predictive Intelligence Analytics"}
            </h1>
            
            <div className="hidden md:flex items-center bg-emerald-50 text-emerald-700 rounded px-2.5 py-0.5 text-[10.5px] font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Live Syncing Active
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors relative"
              >
                <Bell className="w-4 h-4 text-slate-500" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              {/* Notification Dropdown Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 space-y-2 text-xs">
                  <div className="font-bold border-b border-slate-100 pb-1 text-slate-700 flex justify-between">
                    <span>Notifikasi Sistem</span>
                    <button onClick={() => setNotifications([])} className="text-[10px] text-red-500 hover:underline">Clear</button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-slate-600">
                    {notifications.length === 0 ? (
                      <p className="text-slate-400 text-center py-4">Tidak ada notifikasi baru.</p>
                    ) : (
                      notifications.map((note, idx) => (
                        <div key={idx} className="p-1.5 bg-slate-50 rounded-md border-l-2 border-emerald-500">
                          {note}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="text-xs font-bold text-slate-400 font-mono">6 Jul 2026</span>
          </div>
        </header>

        {/* Primary Page Canvas (Scrollable) */}
        <div className="flex-1 p-5 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <DashboardOverview 
              units={units} 
              materials={materials} 
              onNavigate={(tab) => setActiveTab(tab)} 
            />
          )}

          {activeTab === "projects" && (
            <InteractiveSiteplan 
              units={units} 
              onUpdateUnit={handleUpdateUnit} 
              onInitiateBooking={handleInitiateBookingFromSiteplan} 
            />
          )}

          {activeTab === "leads" && (
            <CrmLeads 
              leads={leads} 
              onUpdateLeads={handleUpdateLeads} 
            />
          )}

          {activeTab === "bookings" && (
            <BookingManager 
              bookings={bookings} 
              units={units} 
              onUpdateBookings={handleUpdateBookings} 
              onUpdateUnits={handleUpdateUnits} 
            />
          )}

          {activeTab === "construction" && (
            <ConstructionWarehouse 
              materials={materials} 
              units={units} 
              onUpdateMaterials={handleUpdateMaterials} 
              onUpdateUnits={handleUpdateUnits} 
            />
          )}

          {activeTab === "accounting" && (
            <AccountingCommissions 
              coa={coa} 
              journals={journals} 
              sales={sales} 
              onUpdateCOA={handleUpdateCOA} 
              onUpdateJournals={handleUpdateJournals} 
              onUpdateSales={handleUpdateSales} 
            />
          )}

          {activeTab === "portals" && (
            <PortalsSimulator 
              notifications={notifications} 
              onAddNotification={handleAddNotification} 
            />
          )}

          {activeTab === "ai-studio" && (
            <AiAssistant 
              units={units} 
              materials={materials} 
            />
          )}
        </div>

        {/* 3. STATUS BAR FOOTER */}
        <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-400 shrink-0 select-none">
          <div className="flex gap-4">
            <span>Sistem Versi: 1.0.4-enterprise</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
              WhatsApp Gateway Online
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
              Midtrans API Active
            </span>
          </div>
          <div>&copy; 2026 RR Property ERP • Sistem Manajemen Perumahan Mandiri</div>
        </footer>

      </main>

    </div>
  );
}
