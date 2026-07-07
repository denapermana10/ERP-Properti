import React, { useState } from "react";
import { User, ShieldCheck, ClipboardList, Send, Sparkles, CheckCircle, FileText, Upload, Clock } from "lucide-react";

interface PortalsSimulatorProps {
  notifications: string[];
  onAddNotification: (note: string) => void;
}

export default function PortalsSimulator({ notifications, onAddNotification }: PortalsSimulatorProps) {
  const [portalType, setPortalType] = useState<'customer' | 'vendor'>('customer');

  // Customer complaints
  const [complaints, setComplaints] = useState([
    { id: 1, title: "Retakan Halus Dinding Depan", category: "Struktur", status: "Sedang Ditinjau", date: "2026-07-04" },
    { id: 2, title: "Saluran Pipa Air Belakang Tersumbat", category: "Plumbing", status: "Selesai", date: "2026-06-20" }
  ]);
  const [newComplaintTitle, setNewComplaintTitle] = useState("");
  const [newComplaintCat, setNewComplaintCat] = useState("Struktur");

  // Vendor claims
  const [vendorInvoices, setVendorInvoices] = useState([
    { id: "inv-v1", milestone: "Pondasi Beton 100% Blok A", amount: 45000000, status: "Lunas", date: "2026-06-15" },
    { id: "inv-v2", milestone: "Struktur Tiang Rangka Atap Blok B", amount: 65000000, status: "Menunggu Approval", date: "2026-07-01" }
  ]);
  const [newClaimMilestone, setNewClaimMilestone] = useState("");
  const [newClaimAmount, setNewClaimAmount] = useState(25000000);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintTitle) return;

    const newTicket = {
      id: complaints.length + 1,
      title: newComplaintTitle,
      category: newComplaintCat,
      status: "Sedang Ditinjau",
      date: new Date().toISOString().split("T")[0]
    };

    setComplaints([newTicket, ...complaints]);
    onAddNotification(`Komplain baru tentang "${newComplaintTitle}" telah diajukan ke CRM RR Property`);
    setNewComplaintTitle("");
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaimMilestone) return;

    const newInvoice = {
      id: `inv-v${Date.now()}`,
      milestone: newClaimMilestone,
      amount: newClaimAmount,
      status: "Menunggu Approval",
      date: new Date().toISOString().split("T")[0]
    };

    setVendorInvoices([newInvoice, ...vendorInvoices]);
    onAddNotification(`Invoice tagihan kontraktor senilai Rp ${newClaimAmount.toLocaleString()} diajukan ke Direktur Keuangan`);
    setNewClaimMilestone("");
  };

  return (
    <div className="space-y-4 text-[13px]" id="portals-simulator-view">
      {/* Portal Selection Toggle */}
      <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm">Simulasi Portal Eksternal Terintegrasi</h3>
        </div>
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setPortalType('customer')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${portalType === 'customer' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Portal Pembeli (Customer Portal)
          </button>
          <button 
            onClick={() => setPortalType('vendor')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${portalType === 'vendor' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Portal Kontraktor (Vendor Portal)
          </button>
        </div>
      </div>

      {/* =======================================
          PORTAL VIEW: CUSTOMER (FERRY IRAWAN)
          ======================================= */}
      {portalType === 'customer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column (Span 7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Customer Header spec */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex justify-between items-baseline border-b border-slate-50 pb-2 mb-3">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Selamat Datang, Ferry Irawan</h4>
                  <p className="text-[11px] text-slate-400">Unit Terdaftar: <strong>Grand Clusteria - Tulip A-02</strong></p>
                </div>
                <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-bold">
                  AKAD SCHEDULED: 15-AGUSTUS-2026
                </span>
              </div>

              {/* Progress visual tracker */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Progres Pembangunan Rumah Anda</span>
                  <span className="font-mono">55% Selesai (Struktur Dinding & Dak Beton)</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "55%" }} />
                </div>
                
                {/* Simulated photo updates */}
                <div className="pt-2 flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="w-16 h-12 bg-slate-300 rounded overflow-hidden relative flex items-center justify-center shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=150&q=80" 
                      alt="Construction"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Foto Lapangan Terbaru - 05 Juli 2026</span>
                    <p className="text-[11px] text-slate-600 font-medium">Instalasi instalasi kelistrikan dalam dan kusen aluminium jendela utama.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices paid ledger */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <h4 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider text-slate-500">
                Histori Pembayaran & Tagihan KPR
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-50">
                  <div>
                    <span className="font-bold text-slate-700">Booking Fee / UTJ</span>
                    <p className="text-[10px] text-slate-400">Invoice: #INV-2026-001 | Melalui Transfer Mandiri</p>
                  </div>
                  <span className="text-emerald-600 font-bold">Rp 5.000.000 (Lunas)</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-50">
                  <div>
                    <span className="font-bold text-slate-700">Uang Muka / DP Tahap 1</span>
                    <p className="text-[10px] text-slate-400">Invoice: #INV-2026-024 | Melalui Virtual Account</p>
                  </div>
                  <span className="text-emerald-600 font-bold">Rp 25.000.000 (Lunas)</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1">
                  <div>
                    <span className="font-bold text-slate-700">Pelunasan Akad KPR Bank Mandiri</span>
                    <p className="text-[10px] text-slate-400">Invoice: #INV-2026-092 | Menunggu Realisasi Akad</p>
                  </div>
                  <span className="text-amber-600 font-bold">Rp 550.000.000 (Scheduled)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Complaint Box (Span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between h-full">
              <div>
                <h4 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider text-slate-500">
                  Pusat Aduan & Layanan Komplain (CRM)
                </h4>
                
                <form onSubmit={handleSubmitComplaint} className="space-y-2 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Judul Komplain Kerusakan</label>
                    <input 
                      type="text" required placeholder="Cat dinding mengelupas luar..."
                      value={newComplaintTitle} onChange={(e) => setNewComplaintTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Klasifikasi</label>
                    <select 
                      value={newComplaintCat} onChange={(e) => setNewComplaintCat(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                    >
                      <option value="Struktur">Struktur Dinding</option>
                      <option value="Finishing">Finishing Cat / Keramik</option>
                      <option value="Plumbing">Pipa Air / Sanitasi</option>
                      <option value="Kelistrikan">Kabel Listrik / Saklar</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white text-[11px] font-bold py-1.5 rounded flex items-center justify-center gap-1 mt-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Kirim Aduan
                  </button>
                </form>

                {/* Complaints History lists */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-500 text-[10px] block uppercase tracking-wider">Histori Pengajuan Komplain:</span>
                  {complaints.map((c) => (
                    <div key={c.id} className="border border-slate-100 p-2 rounded-lg flex items-center justify-between text-xs hover:bg-slate-50/50">
                      <div>
                        <strong className="text-slate-700 text-[11px] block">{c.title}</strong>
                        <span className="text-[9px] text-slate-400 font-mono">Kategori: {c.category} | {c.date}</span>
                      </div>
                      <span className={`px-2 py-0.2 text-[9px] font-extrabold rounded-full ${
                        c.status === "Selesai" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================
          PORTAL VIEW: VENDOR / CONTRACTOR
          ======================================= */}
      {portalType === 'vendor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Active Work Orders (Span 7) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h4 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider text-slate-500">
              Surat Perintah Kerja (SPK) Aktif Subkontraktor
            </h4>
            <div className="space-y-3">
              <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/30">
                <div className="flex justify-between items-baseline mb-1">
                  <strong className="text-slate-800 text-xs">Pekerjaan Rangka Atap Blok Tulip B</strong>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.2 rounded font-bold font-mono">SPK-2026-081</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Volume: Baja Ringan Atap Galvalum 12 Unit | Pelaksana: CV Karya Abadi <br />
                  Termin Pembayaran: 30% DP, 40% Rangka Atap, 30% Genteng Selesai
                </p>
                <div className="mt-2.5 flex justify-between items-center border-t border-slate-100 pt-2 text-[10.5px]">
                  <span className="text-slate-400">Target Rampung: 15-September-2026</span>
                  <span className="font-bold text-slate-700">Anggaran Nilai: Rp 140.000.000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Claim & Submission (Span 5) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider text-slate-500">
                Pengajuan Klaim Invoice Termin
              </h4>

              <form onSubmit={handleSubmitClaim} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Nama Milestone Pekerjaan</label>
                  <input 
                    type="text" required placeholder="Milestone Atap Selesai 100% Blok B"
                    value={newClaimMilestone} onChange={(e) => setNewClaimMilestone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Jumlah Tagihan (Rp)</label>
                  <input 
                    type="number" required
                    value={newClaimAmount} onChange={(e) => setNewClaimAmount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" /> Unggah Invoice & Tagih
                </button>
              </form>

              {/* Claims tracking logs */}
              <div className="space-y-2 mt-4">
                <span className="font-bold text-slate-500 text-[10px] block uppercase tracking-wider">Status Tagihan Terkirim:</span>
                {vendorInvoices.map((v) => (
                  <div key={v.id} className="border border-slate-100 p-2 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-700 text-[11px] block">{v.milestone}</strong>
                      <span className="text-[9px] text-slate-400 font-mono">Diajukan: {v.date} | Rp {v.amount.toLocaleString()}</span>
                    </div>
                    <span className={`px-2 py-0.2 text-[9px] font-extrabold rounded-full ${
                      v.status === "Lunas" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
