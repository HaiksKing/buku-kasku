import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  BarChart3, 
  Plus, 
  ArrowLeft,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBukuKasById, calculateRingkasan, getTransaksiList, getUtangList } from '@/lib/storage';
import { formatCurrency, formatDate } from '@/lib/format';
import { BukuKas, Transaksi, Utang } from '@/types';
import TransaksiForm from '@/components/TransaksiForm';
import UtangForm from '@/components/UtangForm';
import TransaksiList from '@/components/TransaksiList';
import UtangList from '@/components/UtangList';
import LaporanKeuangan from '@/components/LaporanKeuangan';

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bukuKas, setBukuKas] = useState<BukuKas | null>(null);
  const [activeTab, setActiveTab] = useState('ringkasan');
  const [showTransaksiForm, setShowTransaksiForm] = useState<'pemasukan' | 'pengeluaran' | null>(null);
  const [showUtangForm, setShowUtangForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (id) {
      const data = getBukuKasById(id);
      if (data) {
        setBukuKas(data);
      } else {
        navigate('/daftar-buku-kas');
      }
    }
  }, [id, navigate]);

  if (!bukuKas || !id) {
    return null;
  }

  const ringkasan = calculateRingkasan(id);
  const transaksiList = getTransaksiList(id);
  const utangList = getUtangList(id);

  const handleTransaksiSuccess = () => {
    setShowTransaksiForm(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleUtangSuccess = () => {
    setShowUtangForm(false);
    setRefreshKey(prev => prev + 1);
  };

  const summaryCards = [
    {
      title: 'Saldo Saat Ini',
      value: ringkasan.saldo,
      icon: Wallet,
      variant: 'summary' as const,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Total Pemasukan',
      value: ringkasan.totalPemasukan,
      icon: TrendingUp,
      variant: 'income' as const,
      iconBg: 'bg-income/10',
      iconColor: 'text-income',
    },
    {
      title: 'Total Pengeluaran',
      value: ringkasan.totalPengeluaran,
      icon: TrendingDown,
      variant: 'expense' as const,
      iconBg: 'bg-expense/10',
      iconColor: 'text-expense',
    },
    {
      title: 'Total Utang',
      value: ringkasan.totalUtang,
      icon: Receipt,
      variant: 'debt' as const,
      iconBg: 'bg-debt/10',
      iconColor: 'text-debt',
    },
  ];

  return (
    <div className="min-h-screen bg-background" key={refreshKey}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/daftar-buku-kas')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-foreground">{bukuKas.nama}</span>
              {bukuKas.deskripsi && (
                <p className="text-xs text-muted-foreground hidden sm:block">{bukuKas.deskripsi}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((card, index) => (
            <Card 
              key={card.title} 
              variant={card.variant}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">{card.title}</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">
                  {formatCurrency(card.value)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button variant="income" onClick={() => setShowTransaksiForm('pemasukan')}>
            <Plus className="w-4 h-4" />
            Pemasukan
          </Button>
          <Button variant="expense" onClick={() => setShowTransaksiForm('pengeluaran')}>
            <Plus className="w-4 h-4" />
            Pengeluaran
          </Button>
          <Button variant="debt" onClick={() => setShowUtangForm(true)}>
            <Plus className="w-4 h-4" />
            Utang
          </Button>
        </div>

        {/* Forms */}
        {showTransaksiForm && (
          <div className="mb-8 animate-scale-in">
            <TransaksiForm 
              bukuKasId={id} 
              tipe={showTransaksiForm} 
              onSuccess={handleTransaksiSuccess}
              onCancel={() => setShowTransaksiForm(null)}
            />
          </div>
        )}

        {showUtangForm && (
          <div className="mb-8 animate-scale-in">
            <UtangForm 
              bukuKasId={id} 
              onSuccess={handleUtangSuccess}
              onCancel={() => setShowUtangForm(false)}
            />
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
            <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
            <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
            <TabsTrigger value="utang">Utang</TabsTrigger>
          </TabsList>

          <TabsContent value="ringkasan">
            <LaporanKeuangan bukuKasId={id} transaksiList={transaksiList} />
          </TabsContent>

          <TabsContent value="pemasukan">
            <TransaksiList 
              transaksiList={transaksiList.filter(t => t.tipe === 'pemasukan')} 
              onUpdate={() => setRefreshKey(prev => prev + 1)}
            />
          </TabsContent>

          <TabsContent value="pengeluaran">
            <TransaksiList 
              transaksiList={transaksiList.filter(t => t.tipe === 'pengeluaran')} 
              onUpdate={() => setRefreshKey(prev => prev + 1)}
            />
          </TabsContent>

          <TabsContent value="utang">
            <UtangList 
              utangList={utangList} 
              onUpdate={() => setRefreshKey(prev => prev + 1)}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
