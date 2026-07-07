import React, { useState } from "react";
import { Material, Unit, WorkOrder, Supplier, PurchaseOrder } from "../types";
import { Hammer, HardHat, Archive, DollarSign, Plus, CheckCircle2, ShieldAlert, Barcode, Trash2 } from "lucide-react";

interface ConstructionWarehouseProps {
  materials: Material[];
  units: Unit[];
  onUpdateMaterials: (updated: Material[]) => void;
  onUpdateUnits: (updated: Unit[]) => void;
}

const DEFAULT_SUPPLIERS: Supplier[] = [
  { id: "sup-1", name: "Toko Material Utama Jaya", contact: "Pak Joko", phone: "081299990000", address: "Jl. Raya Kopo No. 12, Bandung" },
  { id: "sup-2", name: "PT Indosteel Baja Utama", contact: "Bu Maria", phone: "081288881111", address: "Kawasan Industri MM2100, Bekasi" }
];

export default function ConstructionWarehouse({ materials, units, onUpdateMaterials, onUpdateUnits }: ConstructionWarehouseProps) {
  // SPK state
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    { id: "spk-1", unitCode: "Tulip A-02", contractorName: "CV Karya Abadi", mandorName: "Pak Slamet", startDate: "2026-07-02", endDate: "2026-08-15", budget: 120000000, progressPercent: 20, status: "Pondasi" },
    { id: "spk-2", unitCode: "Tulip A-03", contractorName: "PT Graha Konstruksi", mandorName: "Pak Ujang", startDate: "2026-06-10", endDate: "2026-09-30", budget: 180000000, progressPercent: 45, status: "Struktur" }
  ]);

  // Create SPK forms
  const [newUnitCode, setNewUnitCode] = useState("");
  const [newContractor, setNewContractor] = useState("CV Karya Abadi");
  const [newMandor, setNewMandor] = useState("Pak Slamet");
  const [newBudget, setNewBudget] = useState(150000000);

  // Purchase Order Forms
  const [poSupplier, setPoSupplier] = useState("Toko Material Utama Jaya");
  const [poItem, setPoItem] = useState("");
  const [poQty, setPoQty] = useState(100);
  const [poPrice, setPoPrice] = useState(68000);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "po-1",
      poNumber: "PO-2026-002",
      supplierName: "Toko Material Utama Jaya",
      date: "2026-07-03",
      items: [{ materialName: "Semen Portland (Gresik)", quantity: 200, price: 68000 }],
      totalAmount: 13600000,
      status: "Waiting Approval"
    }
  ]);

  const handleCreateSPK = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitCode) return;

    const newSpk: WorkOrder = {
      id: `spk-${Date.now()}`,
      unitCode: newUnitCode,
      contractorName: newContractor,
      mandorName: newMandor,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // +60 days
      budget: newBudget,
      progressPercent: 0,
      status: "Persiapan"
    };

    setWorkOrders([...workOrders, newSpk]);
    setNewUnitCode("");
  };

  const handleUpdateProgress = (unitId: string, value: number) => {
    // Sync with global unit lists
    const updated = units.map(u => u.id === unitId ? { ...u, progressPercent: value } : u);
    onUpdateUnits(updated);

    // Sync with corresponding SPK WorkOrder
    const matchedUnit = units.find(u => u.id === unitId);
    if (matchedUnit) {
      const uCode = `${matchedUnit.blockName} ${matchedUnit.number}`;
      setWorkOrders(workOrders.map(wo => {
        if (wo.unitCode === uCode || wo.unitCode.replace(" ", "") === uCode.replace(" ", "")) {
          let st: WorkOrder['status'] = "Persiapan";
          if (value >= 100) st = "Selesai";
          else if (value > 80) st = "Finishing";
          else if (value > 60) st = "Atap";
          else if (value > 30) st = "Struktur";
          else if (value > 0) st = "Pondasi";
          return { ...wo, progressPercent: value, status: st };
        }
        return wo;
      }));
    }
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poItem) return;

    const total = poQty * poPrice;
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-00${purchaseOrders.length + 3}`,
      supplierName: poSupplier,
      date: new Date().toISOString().split("T")[0],
      items: [{ materialName: poItem, quantity: poQty, price: poPrice }],
      totalAmount: total,
      status: "Waiting Approval"
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setPoItem("");
  };

  const handleApprovePO = (poId: string, approve: boolean) => {
    setPurchaseOrders(purchaseOrders.map(po => {
      if (po.id === poId) {
        if (approve) {
          // Add materials to warehouse stock on approval
          const item = po.items[0];
          const matchedMaterial = materials.find(m => m.name.toLowerCase().includes(item.materialName.split(" ")[0].toLowerCase()));
          if (matchedMaterial) {
            onUpdateMaterials(materials.map(m => m.id === matchedMaterial.id ? { ...m, stock: m.stock + item.quantity, lastPrice: item.price } : m));
          }
          return { ...po, status: "Approved" as const, approvedBy: "Hendra (General Manager)" };
        } else {
          return { ...po, status: "Cancelled" as const };
        }
      }
      return po;
    }));
  };

  return (
    <div className="space-y-4 text-[13px]" id="construction-warehouse-view">
      
      {/* 1. Progress Bangunan & SPK (Work Orders) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* SPK Work Orders & Building Progress (Span 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <h3 className="font-bold text-slate-700 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <HardHat className="w-4 h-4 text-orange-500" /> SPK Pekerjaan & Progres Konstruksi Unit
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">
              Site Authoritative Control
            </span>
          </div>

          {/* Unit Progress Sliders List */}
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {units.filter(u => u.status !== "Available").map((u) => (
              <div key={u.id} className="border border-slate-100 p-2.5 rounded-lg space-y-2 hover:bg-slate-50/50">
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-slate-800 text-xs">{u.blockName}-{u.number}</strong>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">({u.type})</span>
                  </div>
                  <span className={`px-2 py-0.2 text-[9px] font-extrabold rounded-full ${
                    u.progressPercent === 100 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                    {u.progressPercent === 100 ? "SELESAI" : "KONSTRUKSI"}
                  </span>
                </div>

                {/* Range Slider for immediate live update */}
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="0" max="100" 
                    value={u.progressPercent} 
                    onChange={(e) => handleUpdateProgress(u.id, Number(e.target.value))}
                    className="flex-1 accent-orange-500 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                  />
                  <span className="font-mono text-xs text-slate-700 font-bold w-10 text-right">
                    {u.progressPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Form to Spawn New SPK */}
          <form onSubmit={handleCreateSPK} className="bg-slate-50 p-3 rounded-lg border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
            <div className="md:col-span-4 border-b border-slate-200 pb-1 mb-1">
              <span className="font-bold text-slate-600 text-[11px] uppercase tracking-wide">Penerbitan SPK Baru</span>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Kavling</label>
              <input 
                type="text" required placeholder="A-05" 
                value={newUnitCode} onChange={(e) => setNewUnitCode(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Kontraktor</label>
              <select 
                value={newContractor} onChange={(e) => setNewContractor(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
              >
                <option value="CV Karya Abadi">CV Karya Abadi</option>
                <option value="PT Graha Konstruksi">PT Graha Konstruksi</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Anggaran (Rp)</label>
              <input 
                type="number" value={newBudget} onChange={(e) => setNewBudget(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-2 rounded flex items-center justify-center gap-0.5"
              >
                <Plus className="w-3 h-3" /> Buat SPK
              </button>
            </div>
          </form>
        </div>

        {/* 2. Warehouse Stock Ledger (Span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-3">
              <h3 className="font-bold text-slate-700 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Archive className="w-4 h-4 text-blue-600" /> Logistik & Stok Gudang Pusat
              </h3>
              <Barcode className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto">
              {materials.map((mat) => {
                const isBelowMin = mat.stock <= mat.minStock;
                return (
                  <div key={mat.id} className="border border-slate-50 p-2 rounded-lg flex items-center justify-between hover:bg-slate-50/40">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-slate-800 text-xs">{mat.name}</strong>
                        <span className="text-[9px] font-mono text-slate-400">({mat.code})</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Kategori: {mat.category} | Min: {mat.minStock} {mat.unitOfMeasure.split(" ")[0]}</p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md block ${
                        isBelowMin ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      }`}>
                        {mat.stock} {mat.unitOfMeasure.split(" ")[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Rp {mat.lastPrice.toLocaleString()}/u</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Purchasing & Multi-Level Approvals Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Create Purchase Order Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <h3 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider text-slate-500">
            Pembuatan Purchase Order (PO) Gudang
          </h3>

          <form onSubmit={handleCreatePO} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Vendor / Supplier</label>
              <select 
                value={poSupplier} onChange={(e) => setPoSupplier(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
              >
                {DEFAULT_SUPPLIERS.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Nama Barang Material</label>
              <select 
                required value={poItem} onChange={(e) => {
                  setPoItem(e.target.value);
                  const matched = materials.find(m => m.name === e.target.value);
                  if (matched) setPoPrice(matched.lastPrice);
                }}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
              >
                <option value="">-- Pilih Barang --</option>
                {materials.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Jumlah (Quantity)</label>
              <input 
                type="number" required min="1"
                value={poQty} onChange={(e) => setPoQty(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Harga Satuan Negosiasi (Rp)</label>
              <input 
                type="number" required
                value={poPrice} onChange={(e) => setPoPrice(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
              />
            </div>

            <div className="md:col-span-2 flex justify-between items-center pt-2 border-t border-slate-50">
              <span className="text-[11px] text-slate-500">
                Estimasi Total: <strong className="text-slate-800 text-xs">Rp {(poQty * poPrice).toLocaleString()}</strong>
              </span>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-xs"
              >
                Ajukan PO Ke Manajemen
              </button>
            </div>
          </form>
        </div>

        {/* Multi level approval workflow inbox */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <h3 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-pulse" /> Kotak Masuk Approval Workflow (Super Admin / Direksi)
          </h3>
          
          <div className="space-y-3.5 max-h-[190px] overflow-y-auto pr-1">
            {purchaseOrders.length === 0 ? (
              <p className="text-slate-400 text-center py-6 text-[11px]">Tidak ada pengajuan PO aktif.</p>
            ) : (
              purchaseOrders.map((po) => (
                <div key={po.id} className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-800 text-xs">{po.poNumber}</span>
                    <span className={`px-2 py-0.2 text-[9px] font-extrabold rounded-full ${
                      po.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                      po.status === "Cancelled" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {po.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    Vendor: <strong className="text-slate-700">{po.supplierName}</strong> <br />
                    Bahan: {po.items[0]?.materialName} | Jumlah: {po.items[0]?.quantity} pcs <br />
                    Total Dana: <strong className="text-slate-800">Rp {po.totalAmount.toLocaleString()}</strong>
                  </p>

                  {po.status === "Waiting Approval" ? (
                    <div className="flex gap-2 justify-end pt-1">
                      <button 
                        onClick={() => handleApprovePO(po.id, false)}
                        className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold rounded-lg"
                      >
                        Tolak PO
                      </button>
                      <button 
                        onClick={() => handleApprovePO(po.id, true)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg"
                      >
                        Setujui & Tambah Stok
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">
                      Diselesaikan oleh: {po.approvedBy || "Sistem"}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
