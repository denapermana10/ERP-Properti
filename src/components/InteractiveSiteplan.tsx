import { useState } from "react";
import { Unit, UnitStatus } from "../types";
import { Filter, Home, DollarSign, Wrench, Sparkles, X, Check, Save } from "lucide-react";

interface InteractiveSiteplanProps {
  units: Unit[];
  onUpdateUnit: (updated: Unit) => void;
  onInitiateBooking: (unit: Unit) => void;
}

export default function InteractiveSiteplan({ units, onUpdateUnit, onInitiateBooking }: InteractiveSiteplanProps) {
  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editPrice, setEditPrice] = useState(0);
  const [editStatus, setEditStatus] = useState<UnitStatus>("Available");
  const [editPromo, setEditPromo] = useState("");
  const [editProgress, setEditProgress] = useState(0);

  const filteredUnits = units.filter((unit) => {
    const matchesCluster = selectedCluster === "all" || unit.clusterId === selectedCluster;
    const matchesStatus = selectedStatus === "all" || unit.status === selectedStatus;
    const matchesSearch = 
      unit.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.blockName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCluster && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: UnitStatus) => {
    switch (status) {
      case "Available": return { bg: "bg-emerald-50 fill-emerald-100 stroke-emerald-500", text: "text-emerald-700 bg-emerald-100 border-emerald-300", solid: "bg-emerald-500" };
      case "Booking": return { bg: "bg-sky-50 fill-sky-100 stroke-sky-500", text: "text-sky-700 bg-sky-100 border-sky-300", solid: "bg-sky-500" };
      case "DP": return { bg: "bg-amber-50 fill-amber-100 stroke-amber-500", text: "text-amber-700 bg-amber-100 border-amber-300", solid: "bg-amber-500" };
      case "Akad": return { bg: "bg-indigo-50 fill-indigo-100 stroke-indigo-500", text: "text-indigo-700 bg-indigo-100 border-indigo-300", solid: "bg-indigo-500" };
      case "Sold": return { bg: "bg-slate-100 fill-slate-200 stroke-slate-500", text: "text-slate-700 bg-slate-200 border-slate-300", solid: "bg-slate-500" };
    }
  };

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setEditPrice(unit.price);
    setEditStatus(unit.status);
    setEditPromo(unit.promo || "");
    setEditProgress(unit.progressPercent);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!selectedUnit) return;
    const updated: Unit = {
      ...selectedUnit,
      price: editPrice,
      status: editStatus,
      promo: editPromo,
      progressPercent: editProgress
    };
    onUpdateUnit(updated);
    setSelectedUnit(updated);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-gray-700">Filter Kavling & Siteplan</h3>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Cari Kavling (A-01, Tulip...)"
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-hidden"
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
          >
            <option value="all">Semua Cluster</option>
            <option value="clust-1">Cluster Tulip</option>
            <option value="clust-2">Cluster Rose</option>
            <option value="clust-3">Cluster Pine</option>
          </select>
          <select
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-hidden"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="Available">Available</option>
            <option value="Booking">Booking</option>
            <option value="DP">DP</option>
            <option value="Akad">Akad</option>
            <option value="Sold">Sold / Akad Selesai</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Siteplan SVG Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" /> Siteplan Interaktif (Peta Kavling)
              </h2>
              <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                Interactive SVG Layout
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Peta interaktif pembagian kavling. Arahkan kursor atau klik unit untuk melihat spesifikasi detail teknik, harga, promo khusus, dan status pemesanan.
            </p>
          </div>

          {/* SVG Map Container */}
          <div className="border border-gray-100 rounded-xl bg-slate-50 p-2 overflow-auto max-h-[460px] flex items-center justify-center relative">
            <svg 
              viewBox="0 0 720 420" 
              className="w-full max-w-[700px] h-auto drop-shadow-xs"
              style={{ minWidth: '600px' }}
            >
              {/* Background Site Grid & Road Mappings */}
              <rect x="0" y="0" width="720" height="420" fill="#f8fafc" rx="12" />
              
              {/* Roads (Jalan Utama Perumahan) */}
              {/* Main Road Horizontal */}
              <rect x="10" y="145" width="700" height="30" fill="#e2e8f0" rx="4" />
              <text x="350" y="165" fill="#94a3b8" fontSize="10" fontWeight="bold" letterSpacing="2" textAnchor="middle">
                JALAN UTAMA CLUSTERIA BOULEVARD
              </text>

              {/* Cluster Tulip divider vertical road */}
              <rect x="400" y="10" width="25" height="400" fill="#e2e8f0" rx="4" />
              <text x="412" y="200" fill="#94a3b8" fontSize="10" fontWeight="bold" letterSpacing="2" textAnchor="middle" transform="rotate(-90 412 200)">
                JALAN TULIP BARAT
              </text>

              {/* Site Plan Unit Polygons (Clickable SVGs) */}
              {units.map((unit) => {
                const styles = getStatusColor(unit.status);
                const isFilteredOut = !filteredUnits.find(u => u.id === unit.id);
                const isSelected = selectedUnit?.id === unit.id;

                return (
                  <g 
                    key={unit.id} 
                    className={`cursor-pointer transition-all duration-300 ${isFilteredOut ? 'opacity-20 pointer-events-none' : 'hover:scale-[1.02]'} origin-center`}
                    onClick={() => handleSelectUnit(unit)}
                    id={`kavling-${unit.id}`}
                  >
                    {/* The plot shape */}
                    <rect
                      x={unit.coordX}
                      y={unit.coordY}
                      width={unit.width}
                      height={unit.height}
                      rx="6"
                      className={`transition-colors duration-200 ${styles.bg} ${isSelected ? 'stroke-blue-600 stroke-3 shadow-lg' : 'stroke-2'}`}
                    />
                    {/* Unit Code Label */}
                    <text
                      x={unit.coordX + unit.width / 2}
                      y={unit.coordY + unit.height / 2 - 2}
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-gray-800 pointer-events-none"
                    >
                      {unit.blockName}-{unit.number}
                    </text>
                    {/* Unit Type/Progress Label */}
                    <text
                      x={unit.coordX + unit.width / 2}
                      y={unit.coordY + unit.height / 2 + 12}
                      textAnchor="middle"
                      className="text-[8px] fill-gray-500 font-mono pointer-events-none"
                    >
                      {unit.type.split(" ")[1] || unit.type}
                    </text>
                    {/* Small progress bar dot at the bottom of rectangle if building */}
                    {unit.progressPercent > 0 && unit.progressPercent < 100 && (
                      <circle 
                        cx={unit.coordX + unit.width / 2} 
                        cy={unit.coordY + unit.height - 10} 
                        r="3" 
                        className="fill-blue-500 animate-pulse" 
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legends */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-medium text-gray-600">
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-emerald-100 border border-emerald-400 block" />
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-sky-100 border border-sky-400 block" />
              <span>Booking</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-amber-100 border border-amber-400 block" />
              <span>DP / Cicilan</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-indigo-100 border border-indigo-400 block" />
              <span>Akad</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-slate-200 border border-slate-400 block" />
              <span>Sold / Lunas</span>
            </div>
          </div>
        </div>

        {/* Selected Unit Spec Sheet & Action Panel */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          {selectedUnit ? (
            <div className="space-y-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-bold font-mono">
                    Kavling Detail
                  </span>
                  <button 
                    onClick={() => setSelectedUnit(null)} 
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    Unit {selectedUnit.blockName}-{selectedUnit.number}
                  </h3>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(selectedUnit.status).text}`}>
                    {selectedUnit.status}
                  </span>
                </div>

                {/* Spec details grid */}
                <div className="mt-5 grid grid-cols-2 gap-4 text-sm border-t border-b border-gray-100 py-4">
                  <div>
                    <span className="text-gray-400 text-xs block">Tipe Properti</span>
                    <span className="font-semibold text-gray-700">{selectedUnit.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">Harga Jual Jasa</span>
                    <span className="font-bold text-gray-900 text-base">
                      Rp {selectedUnit.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">Progres Konstruksi</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${selectedUnit.progressPercent}%` }} 
                        />
                      </div>
                      <span className="font-mono text-xs text-gray-600">{selectedUnit.progressPercent}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">Cluster Area</span>
                    <span className="font-semibold text-gray-700">
                      {selectedUnit.clusterId === "clust-1" ? "Tulip" : selectedUnit.clusterId === "clust-2" ? "Rose" : "Pine"}
                    </span>
                  </div>
                </div>

                {selectedUnit.promo && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl flex items-start gap-2 text-xs">
                    <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                    <div>
                      <span className="font-bold">Promo Aktif:</span> {selectedUnit.promo}
                    </div>
                  </div>
                )}

                {/* Inline Editing Form */}
                {isEditing ? (
                  <div className="mt-5 bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Edit Unit Parameter</h4>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Harga Unit (Rp)</label>
                      <input 
                        type="number" 
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Status Unit</label>
                      <select 
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as UnitStatus)}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-sm"
                      >
                        <option value="Available">Available</option>
                        <option value="Booking">Booking</option>
                        <option value="DP">DP</option>
                        <option value="Akad">Akad</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Progres Konstruksi (%)</label>
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={editProgress}
                        onChange={(e) => setEditProgress(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Promo Khusus</label>
                      <input 
                        type="text" 
                        value={editPromo}
                        onChange={(e) => setEditPromo(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-sm animate-pulse"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 bg-gray-200 text-xs font-semibold rounded-lg text-gray-600 hover:bg-gray-300"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        className="px-3 py-1.5 bg-blue-600 text-xs font-semibold rounded-lg text-white hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" /> Simpan
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mt-auto pt-6">
                {!isEditing && (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      <Wrench className="w-3.5 h-3.5 text-gray-500" /> Edit Parameter Unit
                    </button>
                    {selectedUnit.status === "Available" && (
                      <button 
                        onClick={() => onInitiateBooking(selectedUnit)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <DollarSign className="w-4 h-4" /> Ambil Booking UTJ Sekarang
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full py-16 text-gray-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-gray-300 animate-bounce" />
              </div>
              <h4 className="font-bold text-gray-700 text-sm">Pilih Unit Kavling</h4>
              <p className="text-xs max-w-xs mt-1">
                Silakan pilih salah satu kotak kavling pada siteplan interaktif untuk mengelola atau mengambil pemesanan UTJ.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
