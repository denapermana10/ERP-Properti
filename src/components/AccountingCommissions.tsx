import React, { useState } from "react";
import { COA, JournalEntry, SalesPerson } from "../types";
import { ERPApi } from "../lib/store";
import { Calculator, Landmark, BookOpen, Plus, Sparkles, CheckSquare, Award, AlertTriangle, FileSpreadsheet } from "lucide-react";

interface AccountingCommissionsProps {
  coa: COA[];
  journals: JournalEntry[];
  sales: SalesPerson[];
  onUpdateCOA: (updated: COA[]) => void;
  onUpdateJournals: (updated: JournalEntry[]) => void;
  onUpdateSales: (updated: SalesPerson[]) => void;
}

export default function AccountingCommissions({ coa, journals, sales, onUpdateCOA, onUpdateJournals, onUpdateSales }: AccountingCommissionsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'journal' | 'reports' | 'commissions'>('ledger');

  // Compound Journal Composer State
  const [journalRef, setJournalRef] = useState("");
  const [journalDesc, setJournalDesc] = useState("");
  const [journalLines, setJournalLines] = useState<{ coaCode: string; debit: number; credit: number }[]>([
    { coaCode: "11101", debit: 0, credit: 0 },
    { coaCode: "41102", debit: 0, credit: 0 }
  ]);
  const [journalError, setJournalError] = useState("");

  const handleAddJournalLine = () => {
    setJournalLines([...journalLines, { coaCode: "11101", debit: 0, credit: 0 }]);
  };

  const handleRemoveJournalLine = (index: number) => {
    setJournalLines(journalLines.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: 'coaCode' | 'debit' | 'credit', value: any) => {
    const updated = journalLines.map((line, i) => {
      if (i === index) {
        return { ...line, [field]: value };
      }
      return line;
    });
    setJournalLines(updated);
  };

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    setJournalError("");

    // Calculate sum debits & credits
    const totalDebit = journalLines.reduce((acc, l) => acc + l.debit, 0);
    const totalCredit = journalLines.reduce((acc, l) => acc + l.credit, 0);

    if (totalDebit <= 0 || totalCredit <= 0) {
      setJournalError("Nilai Debit dan Kredit harus lebih dari nol.");
      return;
    }

    if (totalDebit !== totalCredit) {
      setJournalError(`Jurnal tidak balance! Total Debit: Rp ${totalDebit.toLocaleString()} | Total Kredit: Rp ${totalCredit.toLocaleString()}`);
      return;
    }

    // Construct compound entry
    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      reference: journalRef || "GEN-JUR",
      description: journalDesc,
      lines: journalLines.map(line => {
        const acc = coa.find(a => a.code === line.coaCode);
        return {
          coaCode: line.coaCode,
          coaName: acc?.name || "COA Account",
          debit: line.debit,
          credit: line.credit
        };
      })
    };

    // Update COA balances accordingly
    const updatedCOA = coa.map(acc => {
      let balanceChange = 0;
      journalLines.forEach(l => {
        if (l.coaCode === acc.code) {
          // Normal balance sheet calculation: Assets & Expenses increase with Debit, Liabilities, Equity & Revenue increase with Credit
          if (acc.type === "Asset" || acc.type === "Expense") {
            balanceChange += (l.debit - l.credit);
          } else {
            balanceChange += (l.credit - l.debit);
          }
        }
      });
      return { ...acc, balance: acc.balance + balanceChange };
    });

    onUpdateCOA(updatedCOA);
    onUpdateJournals([newEntry, ...journals]);

    // Clear Form
    setJournalRef("");
    setJournalDesc("");
    setJournalLines([
      { coaCode: "11101", debit: 0, credit: 0 },
      { coaCode: "41102", debit: 0, credit: 0 }
    ]);
    setActiveSubTab('ledger');
  };

  const handlePayCommission = (salesId: string) => {
    setAndTrackCommission(salesId);
  };

  const setAndTrackCommission = (salesId: string) => {
    const updatedSales = sales.map(s => {
      if (s.id === salesId) {
        // Post a journal entry debiting Expense, crediting Cash
        const bonus = s.commissionEarned;
        if (bonus > 0) {
          const newEntry: JournalEntry = {
            id: `j-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            reference: `COMM-${s.name.split(" ")[0].toUpperCase()}`,
            description: `Pembayaran komisi closing sales a.n ${s.name}`,
            lines: [
              { coaCode: "51101", coaName: "Beban Upah Tukang & Mandor", debit: bonus, credit: 0 },
              { coaCode: "11101", coaName: "Kas Utama", debit: 0, credit: bonus }
            ]
          };
          onUpdateJournals([newEntry, ...journals]);

          // Decrease cash balance on COA
          const updatedCOA = coa.map(acc => {
            if (acc.code === "11101") return { ...acc, balance: acc.balance - bonus };
            if (acc.code === "51101") return { ...acc, balance: acc.balance + bonus };
            return acc;
          });
          onUpdateCOA(updatedCOA);
        }
        return { ...s, commissionEarned: 0, actualClosing: s.actualClosing + 1 };
      }
      return s;
    });
    onUpdateSales(updatedSales);
  };

  // Derive reports financial totals
  let totalAsset = 0;
  let totalLiability = 0;
  let totalEquity = 0;
  let totalRevenue = 0;
  let totalExpense = 0;

  coa.forEach((acc) => {
    if (acc.type === "Asset") totalAsset += acc.balance;
    else if (acc.type === "Liability") totalLiability += acc.balance;
    else if (acc.type === "Equity") totalEquity += acc.balance;
    else if (acc.type === "Revenue") totalRevenue += acc.balance;
    else if (acc.type === "Expense") totalExpense += acc.balance;
  });

  const netProfit = totalRevenue - totalExpense;

  return (
    <div className="space-y-4 text-[13px]" id="accounting-commissions-view">
      {/* Sub Tabs Toggle */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1">
          <button 
            onClick={() => setActiveSubTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${activeSubTab === 'ledger' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Landmark className="w-3.5 h-3.5" /> Buku Besar & Ledger COA
          </button>
          <button 
            onClick={() => setActiveSubTab('journal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${activeSubTab === 'journal' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Jurnal Transaksi Baru
          </button>
          <button 
            onClick={() => setActiveSubTab('reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${activeSubTab === 'reports' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Calculator className="w-3.5 h-3.5" /> Neraca & Laba Rugi Realtime
          </button>
          <button 
            onClick={() => setActiveSubTab('commissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${activeSubTab === 'commissions' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Award className="w-3.5 h-3.5" /> Sistem Komisi Sales
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: Buku Besar COA */}
      {activeSubTab === 'ledger' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
              Chart of Accounts (Buku Besar Keuangan)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Double-Entry Standard
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 bg-slate-50">
                  <th className="py-2 px-3">Kode COA</th>
                  <th className="py-2 px-3">Nama Akun</th>
                  <th className="py-2 px-3">Tipe Klasifikasi</th>
                  <th className="py-2 px-3 text-right">Saldo Saat Ini (Rupiah)</th>
                </tr>
              </thead>
              <tbody>
                {coa.map((acc) => (
                  <tr key={acc.code} className="border-b border-slate-50 hover:bg-slate-50/20 text-xs">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{acc.code}</td>
                    <td className="py-2.5 px-3 text-slate-800">{acc.name}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full border ${
                        acc.type === 'Asset' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        acc.type === 'Liability' ? 'bg-red-50 text-red-700 border-red-100' :
                        acc.type === 'Revenue' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : "bg-slate-50 text-slate-600"
                      }`}>
                        {acc.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                      Rp {acc.balance.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Compound Journal Entry form */}
      {activeSubTab === 'journal' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
              Formulir Penjurnalan Umum Ganda (Double-Entry Composer)
            </h3>
            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Audit-Ready ledger
            </span>
          </div>

          <form onSubmit={handlePostJournal} className="space-y-4">
            {journalError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{journalError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">No Referensi / Invoice</label>
                <input 
                  type="text" required placeholder="BKG-FERRY-1"
                  value={journalRef} onChange={(e) => setJournalRef(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Deskripsi Transaksi Jelas</label>
                <input 
                  type="text" required placeholder="Penerimaan cicilan DP pertama a.n Ferry"
                  value={journalDesc} onChange={(e) => setJournalDesc(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden"
                />
              </div>
            </div>

            {/* Compound ledger lines */}
            <div className="space-y-2">
              <span className="font-bold text-slate-500 text-[11px] block">Rincian Pos Debit & Kredit (Balance Checker):</span>
              {journalLines.map((line, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="flex-1 min-w-[150px]">
                    <select 
                      value={line.coaCode}
                      onChange={(e) => handleLineChange(idx, 'coaCode', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                    >
                      {coa.map(c => (
                        <option key={c.code} value={c.code}>[{c.code}] {c.name} ({c.type})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <input 
                      type="number" placeholder="Debit"
                      value={line.debit || ""}
                      onChange={(e) => handleLineChange(idx, 'debit', Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono text-right"
                    />
                  </div>
                  <div className="w-32">
                    <input 
                      type="number" placeholder="Kredit"
                      value={line.credit || ""}
                      onChange={(e) => handleLineChange(idx, 'credit', Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono text-right"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveJournalLine(idx)}
                    className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button 
                type="button" 
                onClick={handleAddJournalLine}
                className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs font-bold"
              >
                + Tambah Baris Ledger
              </button>
              <button 
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-1.5 rounded-lg shadow-xs"
              >
                Posting Jurnal & Update Saldo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-VIEW 3: Realtime Neraca & Laba Rugi Reports */}
      {activeSubTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Income Statement (Laba Rugi) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Laporan Laba Rugi Realtime (Profit & Loss)
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-700">Total Pendapatan Usaha (Revenue)</span>
                <span className="font-mono font-bold text-emerald-600">Rp {totalRevenue.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between pl-4 text-slate-500 border-l border-slate-100">
                <span>Pendapatan UTJ / Booking</span>
                <span className="font-mono">Rp {coa.find(c => c.code === "41101")?.balance.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between pl-4 text-slate-500 border-l border-slate-100">
                <span>Pendapatan Angsuran & Pelunasan</span>
                <span className="font-mono">Rp {coa.find(c => c.code === "41102")?.balance.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Beban Operasional Proyek</span>
                <span className="font-mono font-bold text-red-600">Rp {totalExpense.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between pt-3 border-t-2 border-slate-200 text-sm font-bold bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-800">Laba / (Rugi) Bersih Sebelum Pajak</span>
                <span className={`font-mono ${netProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                  Rp {netProfit.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Balance Sheet (Neraca) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Laporan Neraca Realtime (Balance Sheet)
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between bg-blue-50/50 p-1.5 rounded font-bold text-blue-800">
                <span>TOTAL AKTIVA / ASSETS</span>
                <span className="font-mono">Rp {totalAsset.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between pl-3 text-slate-500">
                <span>Kas & Setara Bank</span>
                <span className="font-mono">Rp {((coa.find(c => c.code === "11101")?.balance || 0) + (coa.find(c => c.code === "11102")?.balance || 0)).toLocaleString()}</span>
              </div>

              <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-slate-700">
                <span>TOTAL KEWAJIBAN / LIABILITY</span>
                <span className="font-mono">Rp {totalLiability.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between pl-3 text-slate-500">
                <span>Hutang Pembelian Supplier</span>
                <span className="font-mono">Rp {coa.find(c => c.code === "21101")?.balance.toLocaleString()}</span>
              </div>

              <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-slate-700">
                <span>TOTAL EKUITAS / EQUITY</span>
                <span className="font-mono">Rp {totalEquity.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between pt-3 border-t-2 border-slate-200 text-[11px] font-bold text-slate-600 italic">
                <span>Persamaan Neraca (Aktiva = Pasiva):</span>
                <span>Rp {totalAsset.toLocaleString()} = Rp {(totalLiability + totalEquity).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: Sales Commission matrix */}
      {activeSubTab === 'commissions' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
              Sistem Penghitungan Komisi & Target Sales CRM
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Omset Closing tracking
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sales.map((s) => (
              <div key={s.id} className="border border-slate-100 p-3.5 rounded-xl bg-slate-50/60 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <strong className="text-slate-800 text-sm">{s.name}</strong>
                    <span className="text-[10px] text-slate-400">({s.email})</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Target Unit: <strong>{s.targetClosing}</strong> | Realisasi: <strong className="text-emerald-600">{s.actualClosing} Unit</strong>
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Akumulasi Bonus Komisi: <strong className="text-slate-800">Rp {s.commissionEarned.toLocaleString("id-ID")}</strong>
                  </p>
                </div>

                {s.commissionEarned > 0 ? (
                  <button 
                    onClick={() => handlePayCommission(s.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs shrink-0"
                  >
                    Bayar Komisi (Cairkan)
                  </button>
                ) : (
                  <span className="text-slate-400 text-xs italic shrink-0">Paid / No Commission</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
