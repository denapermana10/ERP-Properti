import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client to avoid crashes if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        aiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
      } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err);
      }
    }
  }
  return aiClient;
}

// 1. Healthcheck Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. AI Chatbot Agent
app.post("/api/ai/chat", async (req, res) => {
  const { messages, context } = req.body;
  const ai = getAiClient();

  if (!ai) {
    return res.json({
      reply: "Sistem AI sedang offline karena API Key belum dikonfigurasi di panel Secrets. (Menjalankan mode simulasi) \n\nHalo! Saya asisten pintar RR Property. Silakan tanyakan seputar unit perumahan, status cicilan, legalitas SHM/PBG, atau estimasi pengiriman material konstruksi.",
      isSimulated: true
    });
  }

  try {
    const userPrompt = messages[messages.length - 1]?.content || "";
    
    const systemInstruction = `Anda adalah Asisten Virtual Pintar Enterprise untuk RR Property ERP (versi premium dari Clusteria).
Tugas Anda adalah melayani dan menganalisis operasional pengembang properti.
Informasi sistem saat ini:
- Proyek Aktif: Grand Clusteria (60 Unit, Lokasi Bandung), Serene Hills (40 Unit, Lokasi Bogor).
- Proyek baru direncanakan: Emerald Park.
- Cluster Master: Cluster Tulip, Cluster Rose, Cluster Pine, Cluster Oak.
- Status Unit: Available (Bisa dibeli), Booking (Diproses booking), DP (Membayar cicilan DP), Akad (Siap akad kredit), Sold (Sudah terjual), Bangun (Proses konstruksi).
- Integrasi: Terhubung ke WhatsApp Gateway, Pembayaran otomatis Midtrans/Xendit, AI Document generator.
Context Tambahan Operasional: ${JSON.stringify(context || {})}

Berikan jawaban yang profesional, solutif, berbasis data properti, dan sampaikan dalam bahasa Indonesia yang ramah namun formal (gunakan sapaan 'Bapak/Ibu' atau 'Tim RR'). Jika ditanya soal keuangan, buat ringkasan kas, piutang, dan progres teknis secara elegan.`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // Send context + conversation history
    const response = await chat.sendMessage({ message: userPrompt });
    res.json({ reply: response.text, isSimulated: false });
  } catch (err: any) {
    console.error("Gemini API Chat Error:", err);
    res.json({
      reply: `Terjadi kendala saat menghubungi AI Engine. Detail: ${err.message || "Unknown error"}. (Beralih ke respon otomatis RR ERP)`,
      isSimulated: true
    });
  }
});

// 3. AI Predictive Analytics (Cashflow & Material Forecast)
app.post("/api/ai/forecast", async (req, res) => {
  const { type, historicalData } = req.body; // type is 'cashflow' or 'material'
  const ai = getAiClient();

  if (!ai) {
    // Return high-fidelity mock analytic simulation
    if (type === "cashflow") {
      return res.json({
        forecast: [
          { month: "Jul", actual: 1200000000, prediction: 1200000000, confidenceLower: 1200000000, confidenceUpper: 1200000000 },
          { month: "Agu", actual: 1450000000, prediction: 1450000000, confidenceLower: 1450000000, confidenceUpper: 1450000000 },
          { month: "Sep", actual: 1100000000, prediction: 1250000000, confidenceLower: 1150000000, confidenceUpper: 1350000000 },
          { month: "Okt", actual: 0, prediction: 1600000000, confidenceLower: 1400000000, confidenceUpper: 1800000000 },
          { month: "Nov", actual: 0, prediction: 1950000000, confidenceLower: 1700000000, confidenceUpper: 2200000000 },
          { month: "Des", actual: 0, prediction: 2300000000, confidenceLower: 1900000000, confidenceUpper: 2700000000 },
        ],
        insights: "Prediksi menunjukkan pertumbuhan kas 20% di Q4 disokong jadwal akad massal Cluster Tulip Blok B. Direkomendasikan melakukan renegosiasi termin pembayaran vendor baja semen pada bulan November.",
        isSimulated: true
      });
    } else {
      return res.json({
        forecast: [
          { item: "Semen (Zak)", currentStock: 450, neededNext30Days: 1200, neededNext90Days: 4200, recommendedOrder: 1000 },
          { item: "Besi Batang 12mm", currentStock: 120, neededNext30Days: 350, neededNext90Days: 1500, recommendedOrder: 400 },
          { item: "Bata Ringan (m3)", currentStock: 80, neededNext30Days: 240, neededNext90Days: 850, recommendedOrder: 200 },
          { item: "Pasir Beton (Truk)", currentStock: 15, neededNext30Days: 45, neededNext90Days: 180, recommendedOrder: 35 },
          { item: "Cat Dinding (Pail)", currentStock: 40, neededNext30Days: 90, neededNext90Days: 300, recommendedOrder: 70 }
        ],
        insights: "Kebutuhan semen melonjak tajam mulai akhir Agustus karena 12 unit di Cluster Rose masuk tahapan struktur lantai dua. Pemesanan pre-order 1.000 zak semen sekarang disarankan untuk mengamankan diskon volume 8% dari distributor Utama.",
        isSimulated: true
      });
    }
  }

  try {
    const prompt = type === "cashflow" 
      ? `Lakukan forecasting arus kas masuk (cash inflow) pengembang properti RR Property untuk 4 bulan ke depan berdasarkan data historis berikut: ${JSON.stringify(historicalData)}.
Format keluaran wajib JSON murni yang mewakili array objek berisi kunci berikut:
- month (singkatan nama bulan, misal "Sep", "Okt")
- actual (pendapatan aktual jika ada, atau 0 untuk bulan prediksi)
- prediction (prediksi pendapatan kas masuk dalam rupiah)
- confidenceLower (batas bawah prediksi)
- confidenceUpper (batas atas prediksi)

Kembalikan juga sebuah ringkasan insight naratif singkat (maksimal 2 kalimat) sebagai kunci terpisah "insights" di luar array forecast.`
      : `Lakukan analisis prediktif kebutuhan stok bahan material konstruksi pengembang properti RR Property untuk 30 hari dan 90 hari ke depan berdasarkan progres unit aktif: ${JSON.stringify(historicalData)}.
Format keluaran wajib JSON murni yang mewakili array objek berisi kunci berikut:
- item (nama material, misal "Semen (Zak)")
- currentStock (stok saat ini)
- neededNext30Days (kebutuhan 30 hari ke depan)
- neededNext90Days (kebutuhan 90 hari ke depan)
- recommendedOrder (rekomendasi jumlah pembelian segera)

Kembalikan juga narasi ringkasan rekomendasi pembelian sebagai kunci terpisah "insights" di luar array forecast.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["forecast", "insights"],
          properties: {
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  item: { type: Type.STRING },
                  actual: { type: Type.NUMBER },
                  currentStock: { type: Type.NUMBER },
                  prediction: { type: Type.NUMBER },
                  neededNext30Days: { type: Type.NUMBER },
                  neededNext90Days: { type: Type.NUMBER },
                  recommendedOrder: { type: Type.NUMBER },
                  confidenceLower: { type: Type.NUMBER },
                  confidenceUpper: { type: Type.NUMBER },
                }
              }
            },
            insights: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ ...result, isSimulated: false });
  } catch (err: any) {
    console.error("Gemini API Forecast Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4. AI Document Draft Generator (SPR / PPJB Draft Creator)
app.post("/api/ai/document", async (req, res) => {
  const { docType, buyerInfo, unitInfo } = req.body;
  const ai = getAiClient();

  if (!ai) {
    // High-fidelity fallback draft
    return res.json({
      documentNumber: `${docType === "SPR" ? "SPR" : "PPJB"}/RR-ERP/2026/${Math.floor(Math.random() * 900) + 100}`,
      content: `SURAT PESANAN RUMAH (SPR)
RR PROPERTY DEVELOPER - ENTERPRISE SYSTEMS

No. Dokumen: SPR/RR-ERP/2026/${Math.floor(Math.random() * 900) + 100}
Tanggal: ${new Date().toLocaleDateString("id-ID")}

Pihak Pertama (Developer):
PT RR PROPERTY DEVELOPER ENTERPRISE
Alamat: Jl. Clusteria Utama No. 88, Bandung

Pihak Kedua (Pemesan):
Nama: ${buyerInfo.name || "Budi Santoso"}
KTP: ${buyerInfo.ktp || "3273012903930002"}
Telepon: ${buyerInfo.phone || "081234567890"}
Email: ${buyerInfo.email || "buyer@example.com"}

Dengan ini sepakat melakukan pemesanan unit properti pada proyek dengan detail:
Unit Proyek: ${unitInfo.projectName || "Grand Clusteria"}
Blok & No: ${unitInfo.blockName || "Tulip"} - Unit ${unitInfo.number || "A-12"}
Tipe Rumah: ${unitInfo.type || "Tipe 45/90"}
Harga Jual Unit: Rp ${Number(unitInfo.price || 550000000).toLocaleString("id-ID")}
Skema Pembayaran: ${buyerInfo.paymentMethod || "KPR"}

SYARAT DAN KETENTUAN KHUSUS:
1. Pihak Kedua wajib menyetorkan Booking Fee senilai Rp 5.000.000,- (Lima Juta Rupiah) secara penuh.
2. Melengkapi berkas berkas pendukung (KTP, NPWP, Kartu Keluarga, Buku Nikah/Surat Keterangan Belum Menikah) selambat-lambatnya 7 hari kerja sejak dokumen ini dikeluarkan.
3. Apabila terjadi pembatalan sepihak oleh Pihak Kedua, maka Booking Fee dinyatakan hangus dan tidak dapat dikembalikan.
4. Perubahan skema pembayaran atau tipe unit wajib mendapatkan persetujuan tertulis dari Direksi RR Property Developer.

Pernyataan Persetujuan Digital:
Dokumen ini diterbitkan secara elektronik melalui RR Property ERP Portal dan sah secara hukum menggunakan Tanda Tangan Digital Tersertifikasi (QR Secure Verification).`,
      isSimulated: true
    });
  }

  try {
    const prompt = `Buatlah draf naskah resmi Surat Pesanan Rumah (SPR) atau PPJB (Surat Perjanjian Pengikat Jual Beli) dalam Bahasa Indonesia.
Jenis Dokumen: ${docType}
Detail Pembeli:
- Nama: ${buyerInfo.name}
- KTP: ${buyerInfo.ktp}
- Telepon: ${buyerInfo.phone}
- Email: ${buyerInfo.email}
- Skema Pembayaran: ${buyerInfo.paymentMethod}

Detail Unit Properti:
- Proyek: ${unitInfo.projectName}
- Blok / No: ${unitInfo.blockName} - ${unitInfo.number}
- Tipe Rumah: ${unitInfo.type}
- Harga Jual: Rp ${Number(unitInfo.price).toLocaleString("id-ID")}

Format keluaran wajib JSON murni berisi kunci berikut:
- documentNumber (nomor registrasi unik generator otomatis, misal "SPR/RR-BANDUNG/2026/045")
- content (string teks berformat rapi, berparagraf, berisi draf akad legal, pembagian hak kewajiban, tata cara pembayaran cicilan sesuai skema pembayaran, klausul wanprestasi, dan pernyataan tanda tangan digital).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["documentNumber", "content"],
          properties: {
            documentNumber: { type: Type.STRING },
            content: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ ...result, isSimulated: false });
  } catch (err: any) {
    console.error("Gemini API Document Generator Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Setup Vite Middleware and Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RR Property ERP server actively running on http://localhost:${PORT}`);
  });
}

startServer();
