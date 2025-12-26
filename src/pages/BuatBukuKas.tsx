import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveBukuKas, generateId } from '@/lib/storage';
import { BukuKas } from '@/types';

export default function BuatBukuKas() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    saldoAwal: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fungsi helper untuk mengubah string format IDR (2.000.000) menjadi angka (2000000)
  const parseCurrencyToNumber = (value: string) => {
    return parseFloat(value.replace(/\./g, '')) || 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama buku kas wajib diisi';
    } else if (formData.nama.length > 100) {
      newErrors.nama = 'Nama buku kas maksimal 100 karakter';
    }

    if (formData.deskripsi.length > 500) {
      newErrors.deskripsi = 'Deskripsi maksimal 500 karakter';
    }

    if (!formData.saldoAwal.trim()) {
      newErrors.saldoAwal = 'Saldo awal wajib diisi';
    } else {
      const saldo = parseCurrencyToNumber(formData.saldoAwal);
      if (isNaN(saldo)) {
        newErrors.saldoAwal = 'Saldo awal harus berupa angka';
      } else if (saldo < 0) {
        newErrors.saldoAwal = 'Saldo awal tidak boleh negatif';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const bukuKas: BukuKas = {
        id: generateId(),
        nama: formData.nama.trim(),
        deskripsi: formData.deskripsi.trim(),
        // Memastikan saldo disimpan sebagai angka murni tanpa titik
        saldoAwal: parseCurrencyToNumber(formData.saldoAwal),
        createdAt: new Date(),
      };

      saveBukuKas(bukuKas);

      toast({
        title: 'Berhasil!',
        description: `Buku kas "${bukuKas.nama}" berhasil dibuat.`,
      });

      navigate(`/dashboard/${bukuKas.id}`);
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat membuat buku kas.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrencyInput = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    if (!number) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(number));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Buku Kas</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <Card variant="elevated" className="animate-scale-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Buat Buku Kas Baru</CardTitle>
            <CardDescription>
              Isi formulir berikut untuk membuat buku kas baru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Buku Kas *</Label>
                <Input
                  id="nama"
                  placeholder="Contoh: Keuangan Pribadi"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className={errors.nama ? 'border-destructive' : ''}
                />
                {errors.nama && (
                  <p className="text-sm text-destructive">{errors.nama}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Deskripsi singkat tentang buku kas ini..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className={errors.deskripsi ? 'border-destructive' : ''}
                  rows={3}
                />
                {errors.deskripsi && (
                  <p className="text-sm text-destructive">{errors.deskripsi}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="saldoAwal">Saldo Awal (Rp) *</Label>
                <Input
                  id="saldoAwal"
                  placeholder="0"
                  value={formData.saldoAwal}
                  onChange={(e) => setFormData({ ...formData, saldoAwal: formatCurrencyInput(e.target.value) })}
                  className={errors.saldoAwal ? 'border-destructive' : ''}
                />
                {errors.saldoAwal && (
                  <p className="text-sm text-destructive">{errors.saldoAwal}</p>
                )}
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Membuat...' : 'Buat Buku Kas'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
