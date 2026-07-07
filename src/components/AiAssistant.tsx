import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Bot, Sparkles, Send, BrainCircuit, TrendingUp, AlertCircle, RefreshCw, BarChart2, ShieldAlert } from "lucide-react";
import { Unit, Material } from "../types";

interface AiAssistantProps {
  units: Unit[];
  materials: Material[];
}

export default function AiAssistant({ units, materials }: AiAssistantProps) {
  const [activeModel, setActiveModel] = useState<'chat' | 'forecast'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; content: string; isSimulated?: boolean }[]>([
    { sender: "ai", content: "Halo! Saya RR-AI Enterprise, asisten khusus sistem RR Property ERP. Saya dapat menyusun analisis tren arus kas, memberikan draf legalitas, menganalisis status konstruksi unit, atau memprediksi kelangkaan material besi semen." }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Forecast state
  const [forecastType, setForecastType] = useState<'cashflow' | 'material'>('cashflow');
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [forecastInsights, setForecastInsights] = useState("");
  const [isForecasting, setIsForecasting] = useState(false);

  const handleSendChat = async (presetText?: string) => {
    const textToSend = presetText || inputMessage;
    if (!textToSend.trim()) return;

    // Append user message
    const newMsgs = [...messages, { sender: 'user' as const, content: textToSend }];
    setMessages(newMsgs);
    setInputMessage("");
    setIsSendingChat(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.sender === "ai" ? "assistant" : "user", content: m.content })),
          context: {
            activeUnitsCount: units.length,
            soldCount: units.filter(u => u.status === "Sold").length,
            criticalMaterials: materials.filter(m => m.stock <= m.minStock).map(m => m.name)
          }
        })
      });

      const data = await response.json();
      setMessages([...newMsgs, { sender: "ai", content: data.reply, isSimulated: data.isSimulated }]);
    } catch (err) {
      console.error("Chatbot failed:", err);
      setMessages([...newMsgs, { sender: "ai", content: "Koneksi terputus. Silakan coba kembali setelah mengaktifkan API key." }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleTriggerForecast = async () => {
    setIsForecasting(true);
    setForecastData([]);
    setForecastInsights("");

    try {
      const response = await fetch("/api/ai/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: forecastType,
          historicalData: forecastType === "cashflow" 
            ? [
                { month: "Jan", actual: 850000000 },
                { month: "Feb", actual: 1100000000 },
                { month: "Mar", actual: 1450000000 }
              ]
            : materials.map(m => ({ item: m.name, currentStock: m.stock }))
        })
      });

      const data = await response.json();
      setForecastData(data.forecast || []);
      setForecastInsights(data.insights || "");
    } catch (err) {
      console.error("Forecasting failed:", err);
    } finally {
      setIsForecasting(false);
    }
  };

  return (
    <div className="space-y-4 text-[13px]" id="ai-assistant-view">
      {/* Model Selector Banner */}
      <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm">Pusat Kecerdasan Buatan (AI Engine Suite)</h3>
        </div>
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveModel('chat')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${activeModel === 'chat' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Asisten Interaktif (RR-AI Assistant)
          </button>
          <button 
            onClick={() => setActiveModel('forecast')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${activeModel === 'forecast' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Analitik Prediktif (AI Forecast Models)
          </button>
        </div>
      </div>

      {/* =======================================
          MODEL VIEW 1: RR-AI CHATBOT ASSISTANT
          ======================================= */}
      {activeModel === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Chat Stream Container (Span 8) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col h-[460px] justify-between">
            
            {/* Messages box */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[380px]">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`p-1.5 h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                    m.sender === 'user' ? 'bg-blue-600 text-white font-bold text-[10px]' : 'bg-slate-900 text-emerald-400'
                  }`}>
                    {m.sender === 'user' ? "U" : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`p-3 rounded-2xl text-[12px] leading-relaxed relative ${
                    m.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-xs' 
                      : 'bg-slate-50 text-slate-800 border border-slate-150 rounded-tl-xs'
                  }`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    
                    {m.isSimulated && m.sender === 'ai' && (
                      <span className="text-[8px] absolute -bottom-4 right-1 text-slate-400 font-mono">
                        (Offline Simulation)
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {isSendingChat && (
                <div className="flex gap-2.5 mr-auto">
                  <div className="p-1.5 h-7 w-7 bg-slate-900 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-xs text-slate-500 animate-pulse">
                    Menganalisis data properti...
                  </div>
                </div>
              )}
            </div>

            {/* Controls Input Area */}
            <div className="border-t border-slate-100 pt-3 mt-3 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Tanyakan performa penjualan, ketersediaan unit, atau draf surat..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
              />
              <button 
                onClick={() => handleSendChat()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold p-2.5 rounded-lg shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs h-full">
              <h4 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-1 uppercase tracking-wider">
                <BrainCircuit className="w-4 h-4 text-emerald-600" /> Preset Operasional AI
              </h4>
              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                Pilih salah satu preset tugas di bawah ini untuk menginstruksikan asisten AI melakukan tugas operasional secara instan:
              </p>

              <div className="space-y-2">
                <button 
                  onClick={() => handleSendChat("Buatkan draf surat teguran nasabah telat pembayaran DP")}
                  className="w-full text-left bg-white border border-slate-150 p-2.5 rounded-lg hover:border-emerald-400 hover:shadow-xs transition-all text-xs font-semibold text-slate-700 block"
                >
                  📝 Surat Teguran Telat DP
                </button>
                <button 
                  onClick={() => handleSendChat("Bagaimana performa sales di Bandung dan Bogor saat ini?")}
                  className="w-full text-left bg-white border border-slate-150 p-2.5 rounded-lg hover:border-emerald-400 hover:shadow-xs transition-all text-xs font-semibold text-slate-700 block"
                >
                  📊 Analisis Performa Sales
                </button>
                <button 
                  onClick={() => handleSendChat("Berapa unit yang progres pembangunannya masih di bawah 50%?")}
                  className="w-full text-left bg-white border border-slate-150 p-2.5 rounded-lg hover:border-emerald-400 hover:shadow-xs transition-all text-xs font-semibold text-slate-700 block"
                >
                  🏗️ Cek Unit Lambat Bangun
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================
          MODEL VIEW 2: AI PREDICTIVE FORECASTS
          ======================================= */}
      {activeModel === 'forecast' && (
        <div className="space-y-4">
          
          {/* Controls banner */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                Pengaturan Simulasi AI Predictive Forecasting
              </h4>
              <p className="text-xs text-slate-400">Pilih model peramalan otomatis yang ingin dijalankan:</p>
            </div>

            <div className="flex gap-2">
              <select 
                value={forecastType} 
                onChange={(e) => setForecastType(e.target.value as any)}
                className="border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-hidden"
              >
                <option value="cashflow">Forecasting Arus Kas Masuk (4 Bulan)</option>
                <option value="material">Prediksi Stok & Kebutuhan Material (90 Hari)</option>
              </select>
              <button 
                onClick={handleTriggerForecast}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs flex items-center gap-1"
              >
                {isForecasting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Jalankan Prediksi
              </button>
            </div>
          </div>

          {/* Forecasting outputs grids */}
          {forecastData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Graphic/Table Section (Span 8) */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                {forecastType === 'cashflow' ? (
                  <div className="space-y-4">
                    <h5 className="font-bold text-slate-700 text-xs">Arus Kas Masuk (Actual vs Predicted) dalam Rupiah</h5>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecastData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                          <YAxis stroke="#94a3b8" fontSize={10} />
                          <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString()}`} />
                          <Legend />
                          <Line type="monotone" dataKey="actual" name="Pendapatan Riil" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} />
                          <Line type="monotone" dataKey="prediction" name="Prediksi AI" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h5 className="font-bold text-slate-700 text-xs">Kebutuhan Replenishment Material Konstruksi</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-150 text-[11px] font-bold text-slate-500 bg-slate-50">
                            <th className="py-2 px-3">Nama Material</th>
                            <th className="py-2 px-3 text-center">Stok Saat Ini</th>
                            <th className="py-2 px-3 text-center">Butuh (30 Hari)</th>
                            <th className="py-2 px-3 text-center">Butuh (90 Hari)</th>
                            <th className="py-2 px-3 text-right">Rekomendasi Order</th>
                          </tr>
                        </thead>
                        <tbody>
                          {forecastData.map((d, i) => (
                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/20 text-xs">
                              <td className="py-2.5 px-3 font-bold text-slate-700">{d.item}</td>
                              <td className="py-2.5 px-3 text-center font-mono">{d.currentStock}</td>
                              <td className="py-2.5 px-3 text-center font-mono text-amber-600 font-bold">{d.neededNext30Days}</td>
                              <td className="py-2.5 px-3 text-center font-mono text-red-600 font-bold">{d.neededNext90Days}</td>
                              <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">{d.recommendedOrder}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Insights Column (Span 4) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl shadow-xs h-full flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-500" /> Analisis Rekomendasi AI
                    </h5>
                    <p className="text-xs leading-relaxed font-medium whitespace-pre-wrap">
                      {forecastInsights}
                    </p>
                  </div>
                  <div className="text-[10px] text-emerald-600 italic mt-4">
                    *Diproses menggunakan model peramalan multivariat berbasis real-time progress unit.
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
              <BarChart2 className="w-12 h-12 mx-auto text-slate-300 animate-pulse mb-3" />
              <h5 className="font-bold text-slate-700">Mulai Simulasi Prediktif</h5>
              <p className="text-xs max-w-sm mx-auto mt-1">
                Pilih opsi peramalan lalu klik tombol <strong>"Jalankan Prediksi"</strong> di atas untuk merender visualisasi trendline dan analisis rekomendasi stok material otomatis.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
