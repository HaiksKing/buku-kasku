import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaksi } from '@/types';
import { formatCurrency, formatDate, formatMonth } from '@/lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface LaporanKeuanganProps {
  bukuKasId: string;
  transaksiList: Transaksi[];
}

export default function LaporanKeuangan({ bukuKasId, transaksiList }: LaporanKeuanganProps) {
  const [periode, setPeriode] = useState<'harian' | 'bulanan' | 'tahunan'>('bulanan');

  const laporanData = useMemo(() => {
    const now = new Date();
    
    // Group transactions by period
    const grouped: Record<string, { pemasukan: number; pengeluaran: number }> = {};

    transaksiList.forEach((t) => {
      let key: string;
      const date = new Date(t.tanggal);
      
      if (periode === 'harian') {
        // Last 7 days
        key = formatDate(date);
      } else if (periode === 'bulanan') {
        // Last 6 months
        key = formatMonth(date);
      } else {
        // Last 3 years
        key = date.getFullYear().toString();
      }

      if (!grouped[key]) {
        grouped[key] = { pemasukan: 0, pengeluaran: 0 };
      }

      if (t.tipe === 'pemasukan') {
        grouped[key].pemasukan += t.jumlah;
      } else {
        grouped[key].pengeluaran += t.jumlah;
      }
    });

    return Object.entries(grouped).map(([name, data]) => ({
      name,
      Pemasukan: data.pemasukan,
      Pengeluaran: data.pengeluaran,
    }));
  }, [transaksiList, periode]);

  const kategoriData = useMemo(() => {
    const grouped: Record<string, number> = {};

    transaksiList
      .filter((t) => t.tipe === 'pengeluaran')
      .forEach((t) => {
        if (!grouped[t.kategori]) {
          grouped[t.kategori] = 0;
        }
        grouped[t.kategori] += t.jumlah;
      });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transaksiList]);

  const totalPemasukan = transaksiList
    .filter((t) => t.tipe === 'pemasukan')
    .reduce((sum, t) => sum + t.jumlah, 0);

  const totalPengeluaran = transaksiList
    .filter((t) => t.tipe === 'pengeluaran')
    .reduce((sum, t) => sum + t.jumlah, 0);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  if (transaksiList.length === 0) {
    return (
      <Card variant="flat" className="text-center py-12">
        <CardContent>
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Belum Ada Data</h3>
          <p className="text-muted-foreground">
            Tambahkan transaksi untuk melihat laporan keuangan
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Tabs */}
      <Tabs value={periode} onValueChange={(v) => setPeriode(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="harian" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Harian
          </TabsTrigger>
          <TabsTrigger value="bulanan">Bulanan</TabsTrigger>
          <TabsTrigger value="tahunan">Tahunan</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="income">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-income/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-income" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                <p className="text-2xl font-bold text-income">{formatCurrency(totalPemasukan)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="expense">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-expense/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-expense" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-expense">{formatCurrency(totalPengeluaran)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Grafik Pemasukan vs Pengeluaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={laporanData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="Pemasukan" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="hsl(var(--expense))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart for Categories */}
      {kategoriData.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Pengeluaran per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kategoriData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {kategoriData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {kategoriData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions Table */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Tanggal</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Tipe</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Kategori</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Keterangan</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {transaksiList
                  .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                  .slice(0, 10)
                  .map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-2 text-sm">{formatDate(t.tanggal)}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                          t.tipe === 'pemasukan' ? 'text-income' : 'text-expense'
                        }`}>
                          {t.tipe === 'pemasukan' ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {t.tipe === 'pemasukan' ? 'Masuk' : 'Keluar'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm">{t.kategori}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground truncate max-w-[200px]">
                        {t.keterangan || '-'}
                      </td>
                      <td className={`py-3 px-2 text-sm font-semibold text-right ${
                        t.tipe === 'pemasukan' ? 'text-income' : 'text-expense'
                      }`}>
                        {t.tipe === 'pemasukan' ? '+' : '-'}{formatCurrency(t.jumlah)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
