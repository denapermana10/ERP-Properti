import React, { useState } from "react";
import { Booking, Unit, LegalDocument } from "../types";
import { FileText, Award, CheckSquare, Sparkles, Printer, UserCheck, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";

interface BookingManagerProps {
  bookings: Booking[];
  units: Unit[];
  onUpdateBookings: (updated: Booking[]) => void;
  onUpdateUnits: (updated: Unit[]) => void;
}

export default function BookingManager({ bookings, units, onUpdateBookings, onUpdateUnits }: BookingManagerProps) {
  // New booking form inputs
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerKtp, setBuyerKtp] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [bookingFee, setBookingFee] = useState(5000000);
  const [paymentMethod, setPaymentMethod] = useState<'KPR' | 'Cash Bertahap' | 'Cash Keras'>("KPR");

  // State for AI-generated Document
  const [generatedDoc, setGeneratedDoc] = useState<{ documentNumber: string; content: string; isSimulated: boolean } | null>(null);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  // Legal documentation tracking lists
  const [legalDocs, setLegalDocs] = useState<LegalDocument[]>([
    { id: "unit-102", buyerName: "Ferry Irawan", unitCode: "Tulip A-02", ajbStatus: "Proses", shmStatus: "Belum", pbgStatus: "Selesai", slfStatus: "Proses", notes: "KPR disetujui Bank Mandiri" },
    { id: "unit-103", buyerName: "Siti Rahmawati", unitCode: "Tulip A-03", ajbStatus: "Selesai", shmStatus: "Proses", pbgStatus: "Selesai", slfStatus: "Selesai", notes: "DP lunas 100%" }
  ]);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId || !buyerName || !buyerPhone) return;

    const matchedUnit = units.find(u => u.id === selectedUnitId);
    if (!matchedUnit) return;

    // Create Booking
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      unitId: selectedUnitId,
      projectName: matchedUnit.projectId === "proj-1" ? "Grand Clusteria" : "Serene Hills",
      unitCode: `${matchedUnit.blockName} ${matchedUnit.number}`,
      buyerName,
      buyerKtp,
      buyerPhone,
      buyerEmail,
      bookingFee,
      paymentMethod,
      status: "Approved",
      date: new Date().toISOString().split("T")[0],
      documents: { ktp: true, npwp: true, kk: false, suratNikah: false }
    };

    // Update Unit status to 'Booking'
    const updatedUnits = units.map(u => u.id === selectedUnitId ? { ...u, status: "Booking" as const } : u);
    onUpdateUnits(updatedUnits);

    onUpdateBookings([newBooking, ...bookings]);

    // Update legal matrix too
    const newLegal: LegalDocument = {
      id: selectedUnitId,
      buyerName,
      unitCode: `${matchedUnit.blockName} ${matchedUnit.number}`,
      ajbStatus: "Belum",
      shmStatus: "Belum",
      pbgStatus: "Selesai", // assume built-in
      slfStatus: "Belum"
    };
    setLegalDocs([...legalDocs, newLegal]);

    // Reset inputs
    setSelectedUnitId("");
    setBuyerName("");
    setBuyerKtp("");
    setBuyerPhone("");
    setBuyerEmail("");
  };

  const handleGenerateSpu = async (booking: Booking) => {
    setIsGeneratingDoc(true);
    setGeneratedDoc(null);

    const matchedUnit = units.find(u => u.id === booking.unitId) || { type: "Tipe 45/90", price: 580000000, blockName: "Tulip", number: "A-02" };

    try {
      const response = await fetch("/api/ai/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: "SPR",
          buyerInfo: {
            name: booking.buyerName,
            ktp: booking.buyerKtp,
            phone: booking.buyerPhone,
            email: booking.buyerEmail,
            paymentMethod: booking.paymentMethod
          },
          unitInfo: {
            projectName: booking.projectName,
            blockName: matchedUnit.blockName,
            number: matchedUnit.number,
            type: matchedUnit.type,
            price: matchedUnit.price
          }
        })
      });

      const data = await response.json();
      setGeneratedDoc(data);
    } catch (err) {
      console.error("Failed to generate document:", err);
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  const toggleLegalDocStatus = (id: string, field: 'ajbStatus' | 'shmStatus' | 'pbgStatus' | 'slfStatus') => {
    const cycle = (current: 'Belum' | 'Proses' | 'Selesai') => {
      if (current === 'Belum') return 'Proses';
      if (current === 'Proses') return 'Selesai';
      return 'Belum';
    };

    setLegalDocs(legalDocs.map(d => d.id === id ? { ...d, [field]: cycle(d[field]) } : d));
  };

  return (
    <div className="space-y-4 text-[13px]" id="booking-manager-view">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Side: Create Booking UTJ Form & Booking List (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Booking Creator */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-blue-600" /> Formulir Registrasi Booking & UTJ Baru
            </h3>
            
            <form onSubmit={handleCreateBooking} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Pilih Unit Kavling Tersedia</label>
                <select 
                  required
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
                >
                  <option value="">-- Pilih Unit --</option>
                  {units.filter(u => u.status === "Available").map(u => (
                    <option key={u.id} value={u.id}>
                      {u.projectId === "proj-1" ? "[Bandung] " : "[Bogor] "} {u.blockName}-{u.number} ({u.type}) - Rp {u.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Nama Pembeli (KTP)</label>
                <input 
                  type="text" required placeholder="Budi Santoso"
                  value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">No. KTP / NIK</label>
                <input 
                  type="text" placeholder="3273XXXXXXXX"
                  value={buyerKtp} onChange={(e) => setBuyerKtp(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">No. WhatsApp</label>
                <input 
                  type="text" required placeholder="08XXXXXXXX"
                  value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Email Pembeli</label>
                <input 
                  type="email" placeholder="budi@example.com"
                  value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Metode Bayar Pelunasan</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
                >
                  <option value="KPR">Kredit Pemilikan Rumah (KPR)</option>
                  <option value="Cash Bertahap">Cash Bertahap (24x)</option>
                  <option value="Cash Keras">Cash Keras (Pelunasan 30 hari)</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end pt-2 border-t border-slate-50">
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-1.5 rounded-lg shadow-xs flex items-center gap-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" /> Konfirmasi Booking Unit
                </button>
              </div>
            </form>
          </div>

          {/* List Bookings */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider text-slate-500">
              Daftar Konsumen Terbooking
            </h3>
            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
              {bookings.length === 0 ? (
                <p className="text-slate-400 text-center py-6">Belum ada booking terdaftar.</p>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className="border border-slate-100 p-2.5 rounded-lg flex items-center justify-between gap-3 hover:bg-slate-50/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800">{b.buyerName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                          {b.paymentMethod}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                        Proyek: {b.projectName} | Unit: <strong className="text-slate-700">{b.unitCode}</strong>
                      </p>
                    </div>

                    <button 
                      onClick={() => handleGenerateSpu(b)}
                      className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold border border-blue-100 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> Cetak SPR (AI)
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Document Generator Canvas (Span 5) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-800 rounded-xl p-4 text-white min-h-[460px] flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3.5 border-b border-slate-700 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
                    AI Legal Document Engine
                  </h3>
                </div>
                {generatedDoc && (
                  <span className="text-[9px] font-mono bg-blue-600 text-white px-2 py-0.5 rounded-full border border-blue-400">
                    {generatedDoc.isSimulated ? "SIMULATED AI DRAFT" : "GEMINI REAL DRAFT"}
                  </span>
                )}
              </div>

              {isGeneratingDoc ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                  <p className="text-xs text-slate-400 font-mono animate-pulse">Menghubungi Server Gemini AI Pro...</p>
                </div>
              ) : generatedDoc ? (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between bg-slate-750 p-2.5 rounded-lg border border-slate-700 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">No Registrasi Surat</span>
                      <strong className="text-emerald-400 font-mono">{generatedDoc.documentNumber}</strong>
                    </div>
                    {/* Fake Printable QR Code Stamp */}
                    <div className="w-10 h-10 bg-white p-0.5 rounded border border-slate-300 flex items-center justify-center shrink-0">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(generatedDoc.documentNumber)}`} 
                        alt="Secure Stamp"
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Document Raw Contract Area */}
                  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[10.5px] leading-relaxed max-h-[290px] overflow-y-auto whitespace-pre-wrap border border-slate-700/50">
                    {generatedDoc.content}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-28 text-slate-400">
                  <Award className="w-12 h-12 text-slate-500 mb-3 animate-pulse" />
                  <h4 className="font-bold text-slate-300">Draf Kontrak Legal Digital</h4>
                  <p className="text-[11px] max-w-xs mt-1 text-slate-500">
                    Pilih tombol <strong>"Cetak SPR (AI)"</strong> di sebelah kiri untuk menghasilkan dokumen draf PPJB / SPU legal otomatis dengan verifikasi tanda tangan digital.
                  </p>
                </div>
              )}
            </div>

            {generatedDoc && (
              <div className="mt-4 pt-3 border-t border-slate-700 flex gap-2 justify-end">
                <button 
                  onClick={() => window.print()} 
                  className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Kontrak
                </button>
                <button 
                  onClick={() => setGeneratedDoc(null)}
                  className="px-3.5 py-1.5 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg text-xs"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legal & Document Checklists Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <h3 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-indigo-600" /> Matriks Kelengkapan Legalitas & Sertifikasi (AJB / SHM / SLF)
        </h3>
        <p className="text-[11px] text-slate-500 mb-4">
          Klik status pada tabel di bawah ini untuk merubah progress proses kepengurusan administrasi legal dari <strong>Belum &rarr; Proses &rarr; Selesai</strong> secara cepat.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-500">
                <th className="py-2 px-3">Nama Pembeli</th>
                <th className="py-2 px-3">Unit</th>
                <th className="py-2 px-3 text-center">AJB</th>
                <th className="py-2 px-3 text-center">SHM / SHGB</th>
                <th className="py-2 px-3 text-center">PBG IMB</th>
                <th className="py-2 px-3 text-center">SLF (Sertif Layak Fungsi)</th>
                <th className="py-2 px-3">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {legalDocs.map((doc) => {
                const getBadge = (status: 'Belum' | 'Proses' | 'Selesai') => {
                  if (status === 'Belum') return 'bg-red-50 text-red-600 border-red-100';
                  if (status === 'Proses') return 'bg-amber-50 text-amber-600 border-amber-100';
                  return 'bg-emerald-50 text-emerald-600 border-emerald-100';
                };

                return (
                  <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/20">
                    <td className="py-2.5 px-3 font-bold text-slate-800">{doc.buyerName}</td>
                    <td className="py-2.5 px-3 font-mono">{doc.unitCode}</td>
                    
                    <td className="py-2.5 px-3 text-center">
                      <button 
                        onClick={() => toggleLegalDocStatus(doc.id, 'ajbStatus')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full border cursor-pointer ${getBadge(doc.ajbStatus)}`}
                      >
                        {doc.ajbStatus}
                      </button>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <button 
                        onClick={() => toggleLegalDocStatus(doc.id, 'shmStatus')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full border cursor-pointer ${getBadge(doc.shmStatus)}`}
                      >
                        {doc.shmStatus}
                      </button>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <button 
                        onClick={() => toggleLegalDocStatus(doc.id, 'pbgStatus')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full border cursor-pointer ${getBadge(doc.pbgStatus)}`}
                      >
                        {doc.pbgStatus}
                      </button>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <button 
                        onClick={() => toggleLegalDocStatus(doc.id, 'slfStatus')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full border cursor-pointer ${getBadge(doc.slfStatus)}`}
                      >
                        {doc.slfStatus}
                      </button>
                    </td>

                    <td className="py-2.5 px-3 text-slate-500 italic text-[11px]">{doc.notes || "Sertifikat induk terbagi"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
