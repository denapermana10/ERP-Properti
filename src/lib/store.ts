import { 
  Project, Cluster, Unit, Lead, SalesPerson, 
  Booking, Payment, LegalDocument, WorkOrder, 
  Material, Supplier, PurchaseOrder, COA, JournalEntry 
} from "../types";

// Seed Projects
const defaultProjects: Project[] = [
  { id: "proj-1", name: "Grand Clusteria", location: "Bandung, Jawa Barat", description: "Perumahan modern bernuansa resort pegunungan dengan sirkulasi udara optimal dan sistem keamanan pintar.", totalUnits: 60 },
  { id: "proj-2", name: "Serene Hills", location: "Bogor, Jawa Barat", description: "Hunian exclusive ramah lingkungan bertema green-canopy dengan fasilitas olahraga terlengkap.", totalUnits: 40 }
];

// Seed Clusters
const defaultClusters: Cluster[] = [
  { id: "clust-1", projectId: "proj-1", name: "Cluster Tulip", description: "Fase 1 - Rumah Tipe Skandinavia" },
  { id: "clust-2", projectId: "proj-1", name: "Cluster Rose", description: "Fase 2 - Rumah Tipe Minimalis Modern" },
  { id: "clust-3", projectId: "proj-2", name: "Cluster Pine", description: "Fase 1 - Exclusive Smart Home Series" }
];

// Seed Units with X, Y coordinates for SVG Siteplan
const defaultUnits: Unit[] = [
  // Cluster Tulip (Grand Clusteria)
  { id: "unit-101", projectId: "proj-1", clusterId: "clust-1", blockName: "Tulip", number: "A-01", type: "Tipe 45/90", price: 580000000, promo: "Free AJB & BPHTB", status: "Available", progressPercent: 0, coordX: 50, coordY: 50, width: 60, height: 90 },
  { id: "unit-102", projectId: "proj-1", clusterId: "clust-1", blockName: "Tulip", number: "A-02", type: "Tipe 45/90", price: 585000000, status: "Booking", progressPercent: 20, coordX: 120, coordY: 50, width: 60, height: 90 },
  { id: "unit-103", projectId: "proj-1", clusterId: "clust-1", blockName: "Tulip", number: "A-03", type: "Tipe 54/120", price: 720000000, promo: "Diskon DP 10%", status: "DP", progressPercent: 45, coordX: 190, coordY: 50, width: 65, height: 90 },
  { id: "unit-104", projectId: "proj-1", clusterId: "clust-1", blockName: "Tulip", number: "A-04", type: "Tipe 54/120", price: 725000000, status: "Akad", progressPercent: 85, coordX: 265, coordY: 50, width: 65, height: 90 },
  { id: "unit-105", projectId: "proj-1", clusterId: "clust-1", blockName: "Tulip", number: "A-05", type: "Tipe 54/120", price: 730000000, status: "Sold", progressPercent: 100, coordX: 340, coordY: 50, width: 65, height: 90 },
  
  { id: "unit-106", projectId: "proj-1", clusterId: "clust-1", blockName: "Tulip", number: "B-01", type: "Tipe 36/72", price: 420000000, status: "Available", progressPercent: 0, coordX: 50, coordY: 160, width: 50, height: 80 },
  { id: "unit-107", projectId: "proj-1", clusterId: "clust-1", blockName: "Tulip", number: "B-02", type: "Tipe 36/72", price: 420000000, status: "Available", progressPercent: 10, coordX: 110, coordY: 160, width: 50, height: 80 },
  { id: "unit-108", projectId: "proj-1", clusterId: "clust-1", blockName: "Tulip", number: "B-03", type: "Tipe 36/72", price: 425000000, promo: "Subsidi Suku Bunga 2%", status: "Booking", progressPercent: 30, coordX: 170, coordY: 160, width: 50, height: 80 },
  { id: "unit-109", projectId: "proj-1", clusterId: "clust-1", blockName: "Tulip", number: "B-04", type: "Tipe 45/90", price: 590000000, status: "DP", progressPercent: 55, coordX: 230, coordY: 160, width: 60, height: 80 },
  { id: "unit-110", projectId: "proj-1", clusterId: "clust-1", blockName: "Tulip", number: "B-05", type: "Tipe 45/90", price: 595000000, status: "Sold", progressPercent: 100, coordX: 300, coordY: 160, width: 60, height: 80 },

  // Cluster Rose (Grand Clusteria)
  { id: "unit-201", projectId: "proj-1", clusterId: "clust-2", blockName: "Rose", number: "C-01", type: "Tipe 60/130", price: 890000000, promo: "Free Canopy & AC", status: "Available", progressPercent: 0, coordX: 420, coordY: 50, width: 70, height: 90 },
  { id: "unit-202", projectId: "proj-1", clusterId: "clust-2", blockName: "Rose", number: "C-02", type: "Tipe 60/130", price: 895000000, status: "Booking", progressPercent: 15, coordX: 500, coordY: 50, width: 70, height: 90 },
  { id: "unit-203", projectId: "proj-1", clusterId: "clust-2", blockName: "Rose", number: "C-03", type: "Tipe 75/150", price: 1150000000, status: "Sold", progressPercent: 100, coordX: 580, coordY: 50, width: 80, height: 90 },
  { id: "unit-204", projectId: "proj-1", clusterId: "clust-2", blockName: "Rose", number: "D-01", type: "Tipe 60/130", price: 900000000, status: "Available", progressPercent: 0, coordX: 420, coordY: 160, width: 70, height: 80 },
  { id: "unit-205", projectId: "proj-1", clusterId: "clust-2", blockName: "Rose", number: "D-02", type: "Tipe 60/130", price: 905000000, status: "Available", progressPercent: 5, coordX: 500, coordY: 160, width: 70, height: 80 },
  { id: "unit-206", projectId: "proj-1", clusterId: "clust-2", blockName: "Rose", number: "D-03", type: "Tipe 75/150", price: 1180000000, status: "DP", progressPercent: 60, coordX: 580, coordY: 160, width: 80, height: 80 },

  // Cluster Pine (Serene Hills)
  { id: "unit-301", projectId: "proj-2", clusterId: "clust-3", blockName: "Pine", number: "P-01", type: "Tipe 80/160 Premium", price: 1450000000, promo: "Free Smart Home Kit", status: "Available", progressPercent: 0, coordX: 50, coordY: 280, width: 90, height: 100 },
  { id: "unit-302", projectId: "proj-2", clusterId: "clust-3", blockName: "Pine", number: "P-02", type: "Tipe 80/160 Premium", price: 1460000000, status: "Booking", progressPercent: 12, coordX: 150, coordY: 280, width: 90, height: 100 },
  { id: "unit-303", projectId: "proj-2", clusterId: "clust-3", blockName: "Pine", number: "P-03", type: "Tipe 120/200 Executive", price: 1980000000, status: "DP", progressPercent: 50, coordX: 250, coordY: 280, width: 110, height: 100 },
  { id: "unit-304", projectId: "proj-2", clusterId: "clust-3", blockName: "Pine", number: "P-04", type: "Tipe 120/200 Executive", price: 2050000000, status: "Sold", progressPercent: 100, coordX: 370, coordY: 280, width: 110, height: 100 }
];

// Seed CRM Leads
const defaultLeads: Lead[] = [
  { id: "lead-1", name: "Ahmad Subarjo", phone: "081122334455", email: "ahmad.subarjo@gmail.com", status: "Hot", source: "Facebook", assignedTo: "sales-1", notes: "Tertarik Tipe 54/120 Grand Clusteria. Minta informasi cicilan bertahap 24x.", createdAt: "2026-06-15", lastFollowedUp: "2026-07-02", projectName: "Grand Clusteria" },
  { id: "lead-2", name: "Citra Handayani", phone: "081299887766", email: "citra.handayani@yahoo.com", status: "FollowUp", source: "Instagram", assignedTo: "sales-2", notes: "Suka lokasi Serene Hills Bogor. Masih mencocokkan suku bunga KPR bank rekanan.", createdAt: "2026-06-20", lastFollowedUp: "2026-07-04", projectName: "Serene Hills" },
  { id: "lead-3", name: "Denny Setiawan", phone: "085644332211", email: "denny.set@outlook.com", status: "Prospect", source: "WhatsApp", assignedTo: "sales-1", notes: "Tanya pricelist Cluster Tulip. Berencana survei lokasi hari Sabtu ini.", createdAt: "2026-06-28", lastFollowedUp: "2026-06-29", projectName: "Grand Clusteria" },
  { id: "lead-4", name: "Eka Wijaya", phone: "087755662233", email: "eka.wijaya@gmail.com", status: "Lost", source: "Website", assignedTo: "sales-2", notes: "Budget tidak masuk, mencari rentang harga di bawah 300 juta.", createdAt: "2026-05-10", lastFollowedUp: "2026-06-01", projectName: "Grand Clusteria" },
  { id: "lead-5", name: "Ferry Irawan", phone: "082188775544", email: "ferry.irawan@hotmail.com", status: "Booking", source: "Referral", assignedTo: "sales-1", notes: "Sudah memilih unit Tulip A-02. Berkas administrasi sedang dikumpulkan.", createdAt: "2026-06-10", lastFollowedUp: "2026-07-05", projectName: "Grand Clusteria" }
];

// Seed Salespersons
const defaultSales: SalesPerson[] = [
  { id: "sales-1", name: "Hendra Wijaya", email: "hendra.sales@rrproperty.com", phone: "081211112222", targetClosing: 5, actualClosing: 3, commissionEarned: 18500000 },
  { id: "sales-2", name: "Rina Kartika", email: "rina.sales@rrproperty.com", phone: "081233334444", targetClosing: 4, actualClosing: 2, commissionEarned: 12000000 }
];

// Seed Bookings
const defaultBookings: Booking[] = [
  {
    id: "book-1",
    unitId: "unit-102",
    projectName: "Grand Clusteria",
    unitCode: "Tulip A-02",
    buyerName: "Ferry Irawan",
    buyerKtp: "3273012903930002",
    buyerPhone: "082188775544",
    buyerEmail: "ferry.irawan@hotmail.com",
    bookingFee: 5000000,
    paymentMethod: "KPR",
    status: "Approved",
    date: "2026-07-01",
    documents: { ktp: true, npwp: true, kk: true, suratNikah: false }
  },
  {
    id: "book-2",
    unitId: "unit-103",
    projectName: "Grand Clusteria",
    unitCode: "Tulip A-03",
    buyerName: "Siti Rahmawati",
    buyerKtp: "3172081912940003",
    buyerPhone: "081244556677",
    buyerEmail: "siti.rahma@gmail.com",
    bookingFee: 5000000,
    paymentMethod: "Cash Bertahap",
    status: "Approved",
    date: "2026-06-25",
    documents: { ktp: true, npwp: true, kk: true, suratNikah: true }
  }
];

// Seed Materials
const defaultMaterials: Material[] = [
  { id: "mat-1", code: "MAT-SEM-01", name: "Semen Portland (Gresik)", category: "Bahan Pengikat", stock: 450, unitOfMeasure: "Zak (50kg)", minStock: 100, lastPrice: 68000 },
  { id: "mat-2", code: "MAT-BES-12", name: "Besi Beton Ulir 12mm", category: "Besi & Logam", stock: 120, unitOfMeasure: "Batang (12m)", minStock: 50, lastPrice: 135000 },
  { id: "mat-3", code: "MAT-BAT-RB", name: "Bata Ringan Hebel", category: "Batu & Semen", stock: 80, unitOfMeasure: "m3", minStock: 20, lastPrice: 650000 },
  { id: "mat-4", code: "MAT-PSR-BT", name: "Pasir Beton Kasar", category: "Agregat", stock: 15, unitOfMeasure: "Truk (m3)", minStock: 5, lastPrice: 1200000 },
  { id: "mat-5", code: "MAT-CAT-EX", name: "Cat Tembok Exterior Dulux", category: "Finishing", stock: 40, unitOfMeasure: "Pail (20L)", minStock: 10, lastPrice: 1450000 }
];

// Seed COA (Chart of Accounts)
const defaultCOA: COA[] = [
  { code: "11101", name: "Kas Utama", type: "Asset", balance: 1450000000 },
  { code: "11102", name: "Bank Mandiri Proyek", type: "Asset", balance: 3450000000 },
  { code: "11201", name: "Piutang Konsumen KPR", type: "Asset", balance: 1850000000 },
  { code: "11202", name: "Piutang Konsumen Bertahap", type: "Asset", balance: 950000000 },
  { code: "11501", name: "Persediaan Bahan Material", type: "Asset", balance: 85200000 },
  { code: "21101", name: "Hutang Pembelian Supplier", type: "Liability", balance: 340000000 },
  { code: "31101", name: "Modal Pemilik", type: "Equity", balance: 5000000000 },
  { code: "41101", name: "Pendapatan UTJ / Booking", type: "Revenue", balance: 65000000 },
  { code: "41102", name: "Pendapatan Angsuran / Pelunasan", type: "Revenue", balance: 2500000000 },
  { code: "51101", name: "Beban Upah Tukang & Mandor", type: "Expense", balance: 45000000 },
  { code: "51102", name: "Beban Pembelian Material Proyek", type: "Expense", balance: 125000000 }
];

// Seed Journal Entries
const defaultJournals: JournalEntry[] = [
  {
    id: "j-1",
    date: "2026-07-01",
    reference: "BKG-FERRY",
    description: "Penerimaan UTJ Booking Unit Tulip A-02 a.n Ferry Irawan",
    lines: [
      { coaCode: "11101", coaName: "Kas Utama", debit: 5000000, credit: 0 },
      { coaCode: "41101", coaName: "Pendapatan UTJ / Booking", debit: 0, credit: 5000000 }
    ]
  },
  {
    id: "j-2",
    date: "2026-07-03",
    reference: "PO-SUPPLIER-MANDIRI",
    description: "Pembelian Kredit Semen Portland 200 zak dari Toko Utama",
    lines: [
      { coaCode: "11501", coaName: "Persediaan Bahan Material", debit: 13600000, credit: 0 },
      { coaCode: "21101", coaName: "Hutang Pembelian Supplier", debit: 0, credit: 13600000 }
    ]
  }
];

// LocalStorage helpers with type safety
export const getStoredData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(`rr_property_${key}`);
  if (!stored) {
    localStorage.setItem(`rr_property_${key}`, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error(`Error parsing key ${key}`, err);
    return defaultValue;
  }
};

export const setStoredData = <T>(key: string, value: T): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`rr_property_${key}`, JSON.stringify(value));
  }
};

// Global Interactive App State Engine
export class ERPApi {
  static getProjects(): Project[] {
    return getStoredData("projects", defaultProjects);
  }

  static getClusters(): Cluster[] {
    return getStoredData("clusters", defaultClusters);
  }

  static getUnits(): Unit[] {
    return getStoredData("units", defaultUnits);
  }

  static saveUnits(units: Unit[]): void {
    setStoredData("units", units);
  }

  static getLeads(): Lead[] {
    return getStoredData("leads", defaultLeads);
  }

  static saveLeads(leads: Lead[]): void {
    setStoredData("leads", leads);
  }

  static getSales(): SalesPerson[] {
    return getStoredData("sales", defaultSales);
  }

  static saveSales(sales: SalesPerson[]): void {
    setStoredData("sales", sales);
  }

  static getBookings(): Booking[] {
    return getStoredData("bookings", defaultBookings);
  }

  static saveBookings(bookings: Booking[]): void {
    setStoredData("bookings", bookings);
  }

  static getMaterials(): Material[] {
    return getStoredData("materials", defaultMaterials);
  }

  static saveMaterials(materials: Material[]): void {
    setStoredData("materials", materials);
  }

  static getCOA(): COA[] {
    return getStoredData("coa", defaultCOA);
  }

  static saveCOA(coa: COA[]): void {
    setStoredData("coa", coa);
  }

  static getJournals(): JournalEntry[] {
    return getStoredData("journals", defaultJournals);
  }

  static saveJournals(journals: JournalEntry[]): void {
    setStoredData("journals", journals);
  }

  // Derived calculations for Executive Dashboard
  static getFinanceSummary() {
    const coa = this.getCOA();
    const journals = this.getJournals();

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

    return {
      cash: coa.find(a => a.code === "11101")?.balance || 0,
      bank: coa.find(a => a.code === "11102")?.balance || 0,
      piutang: (coa.find(a => a.code === "11201")?.balance || 0) + (coa.find(a => a.code === "11202")?.balance || 0),
      hutang: coa.find(a => a.code === "21101")?.balance || 0,
      netProfit: totalRevenue - totalExpense,
      revenue: totalRevenue,
      expenses: totalExpense
    };
  }
}
