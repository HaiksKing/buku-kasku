import { BukuKas, Transaksi, Utang } from '@/types';

const BUKU_KAS_KEY = 'buku_kas_data';
const TRANSAKSI_KEY = 'transaksi_data';
const UTANG_KEY = 'utang_data';

// Buku Kas
export function getBukuKasList(): BukuKas[] {
  const data = localStorage.getItem(BUKU_KAS_KEY);
  if (!data) return [];
  return JSON.parse(data).map((item: BukuKas) => ({
    ...item,
    createdAt: new Date(item.createdAt),
  }));
}

export function getBukuKasById(id: string): BukuKas | undefined {
  return getBukuKasList().find(bk => bk.id === id);
}

export function saveBukuKas(bukuKas: BukuKas): void {
  const list = getBukuKasList();
  list.push(bukuKas);
  localStorage.setItem(BUKU_KAS_KEY, JSON.stringify(list));
}

export function updateBukuKas(bukuKas: BukuKas): void {
  const list = getBukuKasList();
  const index = list.findIndex(bk => bk.id === bukuKas.id);
  if (index !== -1) {
    list[index] = bukuKas;
    localStorage.setItem(BUKU_KAS_KEY, JSON.stringify(list));
  }
}

export function deleteBukuKas(id: string): void {
  const list = getBukuKasList().filter(bk => bk.id !== id);
  localStorage.setItem(BUKU_KAS_KEY, JSON.stringify(list));
  // Also delete related transactions and debts
  deleteTransaksiByBukuKasId(id);
  deleteUtangByBukuKasId(id);
}

// Transaksi
export function getTransaksiList(bukuKasId?: string): Transaksi[] {
  const data = localStorage.getItem(TRANSAKSI_KEY);
  if (!data) return [];
  const list = JSON.parse(data).map((item: Transaksi) => ({
    ...item,
    tanggal: new Date(item.tanggal),
    createdAt: new Date(item.createdAt),
  }));
  return bukuKasId ? list.filter((t: Transaksi) => t.bukuKasId === bukuKasId) : list;
}

export function saveTransaksi(transaksi: Transaksi): void {
  const list = getTransaksiList();
  list.push(transaksi);
  localStorage.setItem(TRANSAKSI_KEY, JSON.stringify(list));
}

export function updateTransaksi(transaksi: Transaksi): void {
  const list = getTransaksiList();
  const index = list.findIndex(t => t.id === transaksi.id);
  if (index !== -1) {
    list[index] = transaksi;
    localStorage.setItem(TRANSAKSI_KEY, JSON.stringify(list));
  }
}

export function deleteTransaksi(id: string): void {
  const list = getTransaksiList().filter(t => t.id !== id);
  localStorage.setItem(TRANSAKSI_KEY, JSON.stringify(list));
}

function deleteTransaksiByBukuKasId(bukuKasId: string): void {
  const list = getTransaksiList().filter(t => t.bukuKasId !== bukuKasId);
  localStorage.setItem(TRANSAKSI_KEY, JSON.stringify(list));
}

// Utang
export function getUtangList(bukuKasId?: string): Utang[] {
  const data = localStorage.getItem(UTANG_KEY);
  if (!data) return [];
  const list = JSON.parse(data).map((item: Utang) => ({
    ...item,
    tanggal: new Date(item.tanggal),
    createdAt: new Date(item.createdAt),
  }));
  return bukuKasId ? list.filter((u: Utang) => u.bukuKasId === bukuKasId) : list;
}

export function saveUtang(utang: Utang): void {
  const list = getUtangList();
  list.push(utang);
  localStorage.setItem(UTANG_KEY, JSON.stringify(list));
}

export function updateUtang(utang: Utang): void {
  const list = getUtangList();
  const index = list.findIndex(u => u.id === utang.id);
  if (index !== -1) {
    list[index] = utang;
    localStorage.setItem(UTANG_KEY, JSON.stringify(list));
  }
}

export function deleteUtang(id: string): void {
  const list = getUtangList().filter(u => u.id !== id);
  localStorage.setItem(UTANG_KEY, JSON.stringify(list));
}

function deleteUtangByBukuKasId(bukuKasId: string): void {
  const list = getUtangList().filter(u => u.bukuKasId !== bukuKasId);
  localStorage.setItem(UTANG_KEY, JSON.stringify(list));
}

// Calculate summary
export function calculateRingkasan(bukuKasId: string) {
  const bukuKas = getBukuKasById(bukuKasId);
  if (!bukuKas) return { saldo: 0, totalPemasukan: 0, totalPengeluaran: 0, totalUtang: 0 };

  const transaksi = getTransaksiList(bukuKasId);
  const utangList = getUtangList(bukuKasId);

  const totalPemasukan = transaksi
    .filter(t => t.tipe === 'pemasukan')
    .reduce((sum, t) => sum + t.jumlah, 0);

  const totalPengeluaran = transaksi
    .filter(t => t.tipe === 'pengeluaran')
    .reduce((sum, t) => sum + t.jumlah, 0);

  const totalUtang = utangList
    .filter(u => u.status === 'belum_lunas')
    .reduce((sum, u) => sum + u.jumlah, 0);

  const saldo = bukuKas.saldoAwal + totalPemasukan - totalPengeluaran;

  return { saldo, totalPemasukan, totalPengeluaran, totalUtang };
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
