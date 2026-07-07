export type UnitStatus = 'Available' | 'Booking' | 'DP' | 'Akad' | 'Sold';

export interface Unit {
  id: string;
  projectId: string;
  clusterId: string;
  blockName: string; // e.g., "Blok A"
  number: string; // e.g., "12"
  type: string; // e.g., "Tipe 45/90"
  price: number;
  promo?: string;
  status: UnitStatus;
  progressPercent: number; // Construction progress
  coordX: number; // for interactive SVG siteplan mapping
  coordY: number;
  width: number;
  height: number;
}

export interface Cluster {
  id: string;
  projectId: string;
  name: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  totalUnits: number;
}

// CRM Leads
export type LeadStatus = 'New' | 'Prospect' | 'FollowUp' | 'Hot' | 'Cold' | 'Lost' | 'Booking';
export type LeadSource = 'Facebook' | 'Instagram' | 'TikTok' | 'Website' | 'WhatsApp' | 'Pameran' | 'Agent' | 'Referral';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: string; // Sales ID
  notes: string;
  createdAt: string;
  lastFollowedUp: string;
  projectName: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  date: string;
  note: string;
  result: string;
}

// Marketing / Sales
export interface SalesPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetClosing: number;
  actualClosing: number;
  commissionEarned: number;
}

// Booking & Administrasi
export interface Booking {
  id: string;
  unitId: string;
  projectName: string;
  unitCode: string; // e.g., "A-12"
  buyerName: string;
  buyerKtp: string;
  buyerPhone: string;
  buyerEmail: string;
  bookingFee: number;
  paymentMethod: 'KPR' | 'Cash Bertahap' | 'Cash Keras';
  status: 'Pending' | 'Approved' | 'Cancelled';
  date: string;
  documents: {
    ktp: boolean;
    npwp: boolean;
    kk: boolean;
    suratNikah: boolean;
  };
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  date: string;
  type: 'Booking Fee' | 'DP 1' | 'DP 2' | 'DP 3' | 'Cicilan' | 'Pelunasan';
  status: 'Unpaid' | 'Paid';
  invoiceNumber: string;
}

// Legal checklist
export interface LegalDocument {
  id: string; // matches unitId or bookingId
  buyerName: string;
  unitCode: string;
  ajbStatus: 'Belum' | 'Proses' | 'Selesai';
  shmStatus: 'Belum' | 'Proses' | 'Selesai';
  pbgStatus: 'Belum' | 'Proses' | 'Selesai';
  slfStatus: 'Belum' | 'Proses' | 'Selesai';
  akadDate?: string;
  serahTerimaDate?: string;
  notes?: string;
}

// Teknik
export interface WorkOrder {
  id: string;
  unitCode: string;
  contractorName: string;
  mandorName: string;
  startDate: string;
  endDate: string;
  budget: number;
  progressPercent: number;
  status: 'Persiapan' | 'Pondasi' | 'Struktur' | 'Atap' | 'Finishing' | 'Selesai';
}

export interface ProgressPhoto {
  id: string;
  unitId: string;
  date: string;
  percent: number;
  description: string;
  photoUrl: string;
}

// Gudang & Material
export interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  unitOfMeasure: string; // e.g., "Semen (Zak)", "Besi (Batang)"
  minStock: number;
  lastPrice: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  date: string;
  items: {
    materialName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'Draft' | 'Waiting Approval' | 'Approved' | 'Received' | 'Cancelled';
  approvedBy?: string;
}

// Accounting
export interface COA {
  code: string; // e.g. "11101"
  name: string; // e.g. "Kas Utama"
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string; // e.g., "INV-2026-001"
  description: string;
  lines: {
    coaCode: string;
    coaName: string;
    debit: number;
    credit: number;
  }[];
}
