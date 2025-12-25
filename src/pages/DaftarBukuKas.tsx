import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBukuKasList, deleteBukuKas, calculateRingkasan } from '@/lib/storage';
import { formatCurrency, formatDate } from '@/lib/format';
import { BukuKas } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function DaftarBukuKas() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bukuKasList, setBukuKasList] = useState<BukuKas[]>([]);

  useEffect(() => {
    setBukuKasList(getBukuKasList());
  }, []);

  const handleDelete = (id: string, nama: string) => {
    deleteBukuKas(id);
    setBukuKasList(getBukuKasList());
    toast({
      title: 'Berhasil dihapus',
      description: `Buku kas "${nama}" telah dihapus.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Buku Kas</span>
          </div>
          <Button onClick={() => navigate('/buat-buku-kas')}>
            <Plus className="w-4 h-4" />
            Buat Baru
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Daftar Buku Kas</h1>
          <p className="text-muted-foreground">Pilih buku kas untuk melihat detail atau buat buku kas baru</p>
        </div>

        {bukuKasList.length === 0 ? (
          <Card variant="flat" className="text-center py-12 animate-fade-in">
            <CardContent>
              <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Belum Ada Buku Kas</h3>
              <p className="text-muted-foreground mb-6">
                Mulai dengan membuat buku kas pertama Anda
              </p>
              <Button variant="hero" onClick={() => navigate('/buat-buku-kas')}>
                <Plus className="w-4 h-4" />
                Buat Buku Kas
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bukuKasList.map((bukuKas, index) => {
              const ringkasan = calculateRingkasan(bukuKas.id);
              return (
                <Card 
                  key={bukuKas.id} 
                  variant="elevated" 
                  className="animate-slide-up cursor-pointer group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div 
                        className="flex-1"
                        onClick={() => navigate(`/dashboard/${bukuKas.id}`)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground text-lg">{bukuKas.nama}</h3>
                            <p className="text-sm text-muted-foreground">
                              Dibuat {formatDate(bukuKas.createdAt)}
                            </p>
                          </div>
                        </div>
                        {bukuKas.deskripsi && (
                          <p className="text-sm text-muted-foreground mb-4 ml-13">
                            {bukuKas.deskripsi}
                          </p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="bg-secondary/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Saldo</p>
                            <p className="font-bold text-foreground">{formatCurrency(ringkasan.saldo)}</p>
                          </div>
                          <div className="bg-income/10 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Pemasukan</p>
                            <p className="font-bold text-income">{formatCurrency(ringkasan.totalPemasukan)}</p>
                          </div>
                          <div className="bg-expense/10 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Pengeluaran</p>
                            <p className="font-bold text-expense">{formatCurrency(ringkasan.totalPengeluaran)}</p>
                          </div>
                          <div className="bg-debt/10 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Utang</p>
                            <p className="font-bold text-debt">{formatCurrency(ringkasan.totalUtang)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => navigate(`/dashboard/${bukuKas.id}`)}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Buku Kas?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus buku kas "{bukuKas.nama}"? 
                                Semua transaksi dan utang yang terkait juga akan dihapus. 
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(bukuKas.id, bukuKas.nama)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
