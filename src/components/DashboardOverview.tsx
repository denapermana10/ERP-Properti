import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertCircle, ShoppingBag, Zap, Calendar, User, FileText, CheckCircle } from "lucide-react";
import { ERPApi } from "../lib/store";
import { Unit, Material } from "../types";

interface DashboardOverviewProps {
  units: Unit[];
  materials: Material[];
  onNavigate: (tab: "projects" | "leads" | "bookings" | "construction" | "accounting" | "portals" | "ai-studio") => void;
}

export default function DashboardOverview({ units, materials, onNavigate }: DashboardOverviewProps) {
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const finance = ERPApi.getFinanceSummary();

  useEffect(() => {
    // Generate simulated fresh logs for transactions
    const logs = [
      { id: 1, type: "UTJ", title: "UTJ Booking Diterima", desc: "Ferry Irawan - Unit Tulip A-02", amount: "Rp 5.000.000", time: "12:45" },
      { id: 2, type: "SPR", title: "SPR Berhasil Dibuat", desc: "Siti Rahmawati - Unit Tulip A-03", amount: null, time: "10:12" },
      { id: 3, type: "PO", title: "Purchase Order #PO-2026-002", desc: "Semen Portland - Toko Utama", amount: "Rp 13.600.000", time: "08:22" },
      { id: 4, type: "Progress", title: "Pondasi Rampung", desc: "Unit Pine P-03 - Progress naik ke 50%", amount: null, time: "Kemarin" },
      { id: 5, type: "Followup", title: "Follow Up CRM Berhasil", desc: "Ahmad Subarjo di-upgrade ke Hot Prospect", amount: null, time: "Kemarin" }
    ];
    setRecentLogs(logs);
  }, [units]);

  // Derived unit statistics
  const totalUnits = units.length;
  const soldUnits = units.filter(u => u.status === "Sold").length;
  const bookedUnits = units.filter(u => u.status === "Booking" || u.status === "DP" || u.status === "Akad").length;
  const availableUnits = units.filter(u => u.status === "Available").length;
  const salesRatio = totalUnits > 0 ? Math.round(((soldUnits + bookedUnits) / totalUnits) * 100) : 0;

  // Chart data for cashflow forecast / revenue trend
  const chartData = [
    { name: "Jan", revenue: 400, cashflow: 350 },
    { name: "Feb", revenue: 550, cashflow: 480 },
    { name: "Mar", revenue: 700, cashflow: 620 },
    { name: "Apr", revenue: 850, cashflow: 790 },
    { name: "Mei", revenue: 1100, cashflow: 920 },
    { name: "Jun", revenue: 1350, cashflow: 1150 },
    { name: "Jul", revenue: 1450, cashflow: 1380 },
  ];

  return (
    <div className="space-y-4 text-[13px]">
      {/* Top Core Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Revenue & Kas</p>
          <p className="text-xl font-extrabold text-slate-800">Rp {(finance.revenue / 1e9).toFixed(2)}B</p>
          <div className="flex items-center justify-between text-[11px] text-emerald-600 mt-1.5 font-medium">
            <span>↑ 14% kuartal ini</span>
            <span className="text-slate-500 font-mono text-[10px]">Kas Utama: Rp 1.45B</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Penjualan Unit Kavling</p>
          <div className="flex items-end justify-between">
            <p className="text-xl font-extrabold text-slate-800">{soldUnits + bookedUnits} / {totalUnits}</p>
            <p className="text-[10px] text-slate-500 pb-0.5">{availableUnits} Unit Tersedia</p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${salesRatio}%` }}></div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Piutang Konsumen (KPR/Cicil)</p>
          <p className="text-xl font-extrabold text-slate-800">Rp {(finance.piutang / 1e9).toFixed(2)}B</p>
          <p className="text-[11px] text-orange-600 mt-1.5 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-orange-500" /> 12 Unit Butuh Follow Up Berkas
          </p>
        </div>

        {/* Stat 4 - AI Mini Insight */}
        <div className="bg-emerald-600 p-3.5 rounded-xl shadow-xs text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <p className="text-[9px] font-bold text-emerald-100 uppercase tracking-wider mb-0.5">AI Enterprise Executive Insight</p>
            <p className="text-[11.5px] leading-snug font-medium">Akad Massal Cluster Tulip diprediksi menyumbang kas masuk Rp 2.4B di kuartal depan.</p>
          </div>
          <button 
            onClick={() => onNavigate("ai-studio")}
            className="mt-2 text-[9px] bg-emerald-500 hover:bg-emerald-400 px-2 py-0.5 w-fit rounded text-white font-bold tracking-wider uppercase transition-colors"
          >
            Mulai Analisis
          </button>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/30 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Main Grid: Visuals & Warehouse */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Column 1: Sales trends & Inventory critical indicators (Span 8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Revenue Chart Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-700">Grafik Trend Pendapatan & Arus Kas</h3>
                <p className="text-[11px] text-slate-400">Periode Berjalan Smt-1 2026 (Rupiah Juta)</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 block"></span> Revenue Jual
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 block"></span> Arus Kas
                </span>
              </div>
            </div>

            {/* Recharts Area Container */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                  <Area type="monotone" dataKey="cashflow" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCash)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Construction & Inventory Double Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Construction Milestones */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Milestone Konstruksi Aktif</span>
                <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Proyek Bandung</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Land Clearing & Cut & Fill</span>
                    <span className="font-bold">100%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Infrastruktur Jalan & Drainase</span>
                    <span className="font-bold">68%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Struktur & Rangka Atap Unit</span>
                    <span className="font-bold">45%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Quick Stock Alert */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2 border-b border-slate-50 pb-1.5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-slate-500">
                  Stok Gudang Kritis
                </h3>
                <button onClick={() => onNavigate("construction")} className="text-[10px] text-blue-600 hover:underline">
                  Kelola Stok
                </button>
              </div>
              <div className="space-y-2">
                {materials.map((mat) => {
                  const isLow = mat.stock <= mat.minStock;
                  return (
                    <div key={mat.id} className="flex items-center justify-between py-0.5 text-xs">
                      <span className="text-slate-500 font-medium">{mat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-700 font-bold">{mat.stock} {mat.unitOfMeasure.split(" ")[0]}</span>
                        {isLow ? (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-extrabold rounded-full animate-pulse border border-red-200">LOW</span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-semibold rounded-full border border-emerald-200">SAFE</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Recent Transactions Logs (Span 4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Recent Operations log */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider text-slate-500">
                Log Transaksi & Aktivitas Terbaru
              </h3>
              <div className="space-y-3.5">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      log.type === "UTJ" ? "bg-emerald-50 text-emerald-600" :
                      log.type === "SPR" ? "bg-blue-50 text-blue-600" :
                      log.type === "PO" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600"
                    }`}>
                      {log.type === "UTJ" && <ShoppingBag className="w-3.5 h-3.5" />}
                      {log.type === "SPR" && <FileText className="w-3.5 h-3.5" />}
                      {log.type === "PO" && <Zap className="w-3.5 h-3.5" />}
                      {log.type === "Progress" && <CheckCircle className="w-3.5 h-3.5" />}
                      {log.type === "Followup" && <User className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-bold text-slate-800 text-xs truncate">{log.title}</p>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{log.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{log.desc}</p>
                      {log.amount && (
                        <span className="inline-block mt-1 font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                          {log.amount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => onNavigate("bookings")}
              className="w-full mt-4 py-1.5 border border-slate-100 hover:bg-slate-50 rounded-lg text-[10px] text-slate-500 font-bold transition-colors"
            >
              Lihat Detail Administrasi & Keuangan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
