export interface BukuKas {
  id: string;
  nama: string;
  deskripsi: string;
  saldoAwal: number;
  createdAt: Date;
}

export interface Transaksi {
  id: string;
  bukuKasId: string;
  tipe: 'pemasukan' | 'pengeluaran';
  tanggal: Date;
  jumlah: number;
  kategori: string;
  keterangan: string;
  createdAt: Date;
}

export interface Utang {
  id: string;
  bukuKasId: string;
  namaPihak: string;
  jumlah: number;
  tanggal: Date;
  status: 'belum_lunas' | 'lunas';
  createdAt: Date;
}

export interface RingkasanKeuangan {
  saldo: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  totalUtang: number;
}

export type PeriodeLaporan = 'harian' | 'bulanan' | 'tahunan';
