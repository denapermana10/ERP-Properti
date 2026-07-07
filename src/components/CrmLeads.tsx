import React, { useState } from "react";
import { Lead, LeadStatus, LeadSource } from "../types";
import { Plus, Users, Search, MessageSquare, ArrowRight, Sparkles, Filter, Trash2, Smartphone } from "lucide-react";

interface CrmLeadsProps {
  leads: Lead[];
  onUpdateLeads: (updated: Lead[]) => void;
}

const LANES: { id: LeadStatus; label: string; color: string; bg: string }[] = [
  { id: "New", label: "Lead Baru", color: "text-blue-700 border-blue-200 bg-blue-100", bg: "bg-blue-50/50" },
  { id: "Prospect", label: "Prospek", color: "text-purple-700 border-purple-200 bg-purple-100", bg: "bg-purple-50/50" },
  { id: "FollowUp", label: "Follow Up", color: "text-indigo-700 border-indigo-200 bg-indigo-100", bg: "bg-indigo-50/50" },
  { id: "Hot", label: "Hot Prospect", color: "text-red-700 border-red-200 bg-red-100", bg: "bg-red-50/50" },
  { id: "Cold", label: "Cold Prospect", color: "text-sky-700 border-sky-200 bg-sky-100", bg: "bg-sky-50/50" },
  { id: "Booking", label: "Deal / Booking", color: "text-emerald-700 border-emerald-200 bg-emerald-100", bg: "bg-emerald-50/50" }
];

export default function CrmLeads({ leads, onUpdateLeads }: CrmLeadsProps) {
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  
  // New lead form inputs
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSource, setNewSource] = useState<LeadSource>("WhatsApp");
  const [newProject, setNewProject] = useState("Grand Clusteria");
  const [newNotes, setNewNotes] = useState("");

  // WhatsApp Simulator Overlay state
  const [whatsappSimulation, setWhatsappSimulation] = useState<{ isOpen: boolean; leadName: string; text: string; success: boolean } | null>(null);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: newName,
      phone: newPhone,
      email: newEmail,
      status: "New",
      source: newSource,
      assignedTo: "sales-1",
      notes: newNotes || "Kavling inquiries",
      createdAt: new Date().toISOString().split("T")[0],
      lastFollowedUp: new Date().toISOString().split("T")[0],
      projectName: newProject
    };

    onUpdateLeads([newLead, ...leads]);
    
    // Clear inputs
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewNotes("");
    setShowAddForm(false);
  };

  const handleMoveStatus = (id: string, newStatus: LeadStatus) => {
    const updated = leads.map(l => l.id === id ? { ...l, status: newStatus, lastFollowedUp: new Date().toISOString().split("T")[0] } : l);
    onUpdateLeads(updated);
  };

  const handleDeleteLead = (id: string) => {
    onUpdateLeads(leads.filter(l => l.id !== id));
  };

  const triggerWhatsappSimulation = (lead: Lead) => {
    const textTemplate = `Halo Bapak/Ibu *${lead.name}*, perkenalkan saya Hendra dari *RR Property Developer*.

Kami senang mendengarkan ketertarikan Anda pada proyek *${lead.projectName}*. 
Saat ini, kami memiliki penawaran promo khusus: *Diskon Booking Fee 10% + Free AJB & BPHTB* khusus untuk bulan ini!

Apakah Anda berminat untuk berkonsultasi lebih lanjut atau melakukan survei lokasi akhir pekan ini? Kami siap menjadwalkan kunjungan Bapak/Ibu.`;

    setWhatsappSimulation({
      isOpen: true,
      leadName: lead.name,
      text: textTemplate,
      success: true
    });

    // Automatically update last follow-up timestamp
    const updated = leads.map(l => l.id === lead.id ? { ...l, lastFollowedUp: new Date().toISOString().split("T")[0] } : l);
    onUpdateLeads(updated);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) || 
                          lead.phone.includes(search) || 
                          lead.notes.toLowerCase().includes(search.toLowerCase());
    const matchesSource = filterSource === "all" || lead.source === filterSource;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-4 text-[13px]" id="crm-leads-view">
      {/* Search & Actions Header */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-slate-800 text-sm">CRM Leads Pipeline & WhatsApp API Center</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari prospek..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs w-48 focus:outline-hidden"
            />
          </div>
          <select 
            value={filterSource} 
            onChange={(e) => setFilterSource(e.target.value)}
            className="border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-hidden"
          >
            <option value="all">Semua Sumber</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
          </select>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Prospek Baru
          </button>
        </div>
      </div>

      {/* Add Lead Inline Drawer / Form */}
      {showAddForm && (
        <form onSubmit={handleAddLead} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
          <div className="md:col-span-4 border-b border-slate-100 pb-2 mb-1">
            <h3 className="font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-emerald-500" /> Daftarkan Prospek Baru
            </h3>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              required
              placeholder="Asep Sunandar" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Nomor WA / Telp</label>
            <input 
              type="text" 
              required
              placeholder="0812XXXXXXXX" 
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Email</label>
            <input 
              type="email" 
              placeholder="asep@mail.com" 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Pilihan Proyek</label>
            <select 
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
            >
              <option value="Grand Clusteria">Grand Clusteria</option>
              <option value="Serene Hills">Serene Hills</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Sumber Prospek</label>
            <select 
              value={newSource}
              onChange={(e) => setNewSource(e.target.value as LeadSource)}
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Catatan Kebutuhan</label>
            <input 
              type="text" 
              placeholder="Tertarik tipe 45 scandinavian. Tanya model cicilan..." 
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
            />
          </div>
          <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t border-slate-50">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-4 py-1.5 rounded-lg"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs"
            >
              Simpan Prospek
            </button>
          </div>
        </form>
      )}

      {/* Kanban Pipeline Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3.5 overflow-x-auto min-h-[450px] pb-4">
        {LANES.map((lane) => {
          const laneLeads = filteredLeads.filter(l => l.status === lane.id);
          return (
            <div key={lane.id} className={`flex flex-col rounded-xl border border-slate-200/60 p-2.5 ${lane.bg} min-w-[150px]`}>
              {/* Lane Title Header */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-200/50 pb-2">
                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border tracking-wide uppercase ${lane.color}`}>
                  {lane.label}
                </span>
                <span className="font-bold text-slate-400 font-mono bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-xs">
                  {laneLeads.length}
                </span>
              </div>

              {/* Lane Prospect Cards */}
              <div className="space-y-2 flex-1 overflow-y-auto max-h-[420px]">
                {laneLeads.length === 0 ? (
                  <div className="h-20 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-[10px] bg-white/40">
                    Kosong
                  </div>
                ) : (
                  laneLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-extrabold text-slate-800 text-[11.5px] truncate max-w-[80%]">
                            {lead.name}
                          </h4>
                          <span className="text-[9px] text-slate-400 font-mono">{lead.source}</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 mb-1">{lead.phone}</p>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium block w-fit">
                          {lead.projectName}
                        </span>
                        <p className="text-[10.5px] text-slate-600 mt-2 italic line-clamp-2 leading-relaxed bg-slate-50 p-1.5 rounded-sm">
                          "{lead.notes}"
                        </p>
                      </div>

                      {/* Action controllers on card */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => triggerWhatsappSimulation(lead)}
                            title="Kirim Pesan WhatsApp API"
                            className="p-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-100"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteLead(lead.id)}
                            title="Hapus Prospek"
                            className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Status advancement selector */}
                        <div className="flex items-center gap-1 text-[10px]">
                          <select 
                            value={lead.status}
                            onChange={(e) => handleMoveStatus(lead.id, e.target.value as LeadStatus)}
                            className="bg-slate-50 border border-slate-200 text-slate-600 rounded px-1.5 py-0.5 font-bold"
                          >
                            <option value="New">New</option>
                            <option value="Prospect">Prosp</option>
                            <option value="FollowUp">F/U</option>
                            <option value="Hot">Hot</option>
                            <option value="Cold">Cold</option>
                            <option value="Booking">Deal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Simulation Modal */}
      {whatsappSimulation && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                <h3 className="font-bold text-slate-800 text-sm">Status Log WhatsApp API (Clusteria Integration)</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                SENT SUCCESSFULLY
              </span>
            </div>
            
            <p className="text-xs text-slate-500">
              Sistem mensimulasikan koneksi WhatsApp Gateway RR Property ke pelanggan: <strong>{whatsappSimulation.leadName}</strong>. Berikut adalah isi template pesan yang berhasil dikirim:
            </p>

            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-auto max-h-56 leading-relaxed whitespace-pre-wrap">
              {whatsappSimulation.text}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button 
                onClick={() => setWhatsappSimulation(null)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
