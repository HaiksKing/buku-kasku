import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveTransaksi, generateId } from '@/lib/storage';
import { Transaksi } from '@/types';
import { TrendingUp, TrendingDown, X } from 'lucide-react';

interface TransaksiFormProps {
  bukuKasId: string;
  tipe: 'pemasukan' | 'pengeluaran';
  onSuccess: () => void;
  onCancel: () => void;
}

const kategoriPemasukan = [
  'Gaji',
  'Bonus',
  'Penjualan',
  'Investasi',
  'Hadiah',
  'Lainnya',
];

const kategoriPengeluaran = [
  'Makanan & Minuman',
  'Transportasi',
  'Belanja',
  'Tagihan',
  'Hiburan',
  'Kesehatan',
  'Pendidikan',
  'Lainnya',
];

export default function TransaksiForm({ bukuKasId, tipe, onSuccess, onCancel }: TransaksiFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jumlah: '',
    kategori: '',
    keterangan: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const kategoriList = tipe === 'pemasukan' ? kategoriPemasukan : kategoriPengeluaran;
  const Icon = tipe === 'pemasukan' ? TrendingUp : TrendingDown;
  const title = tipe === 'pemasukan' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi';
    }

    if (!formData.jumlah.trim()) {
      newErrors.jumlah = 'Jumlah wajib diisi';
    } else {
      const jumlah = parseFloat(formData.jumlah.replace(/[^\d]/g, ''));
      if (isNaN(jumlah) || jumlah <= 0) {
        newErrors.jumlah = 'Jumlah harus lebih dari 0';
      }
    }

    if (!formData.kategori) {
      newErrors.kategori = 'Kategori wajib dipilih';
    }

    if (formData.keterangan.length > 500) {
      newErrors.keterangan = 'Keterangan maksimal 500 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const transaksi: Transaksi = {
        id: generateId(),
        bukuKasId,
        tipe,
        tanggal: new Date(formData.tanggal),
        jumlah: parseFloat(formData.jumlah.replace(/[^\d]/g, '')),
        kategori: formData.kategori,
        keterangan: formData.keterangan.trim(),
        createdAt: new Date(),
      };

      saveTransaksi(transaksi);

      toast({
        title: 'Berhasil!',
        description: `${tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'} berhasil dicatat.`,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan transaksi.',
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
    <Card variant={tipe === 'pemasukan' ? 'income' : 'expense'}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${tipe === 'pemasukan' ? 'bg-income/20' : 'bg-expense/20'} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${tipe === 'pemasukan' ? 'text-income' : 'text-expense'}`} />
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal *</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className={errors.tanggal ? 'border-destructive' : ''}
              />
              {errors.tanggal && (
                <p className="text-sm text-destructive">{errors.tanggal}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jumlah">Jumlah (Rp) *</Label>
              <Input
                id="jumlah"
                placeholder="0"
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: formatCurrencyInput(e.target.value) })}
                className={errors.jumlah ? 'border-destructive' : ''}
              />
              {errors.jumlah && (
                <p className="text-sm text-destructive">{errors.jumlah}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori">Kategori *</Label>
            <Select value={formData.kategori} onValueChange={(value) => setFormData({ ...formData, kategori: value })}>
              <SelectTrigger className={errors.kategori ? 'border-destructive' : ''}>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {kategoriList.map((kat) => (
                  <SelectItem key={kat} value={kat}>{kat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kategori && (
              <p className="text-sm text-destructive">{errors.kategori}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              placeholder="Catatan tambahan..."
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              className={errors.keterangan ? 'border-destructive' : ''}
              rows={2}
            />
            {errors.keterangan && (
              <p className="text-sm text-destructive">{errors.keterangan}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
            <Button 
              type="submit" 
              variant={tipe === 'pemasukan' ? 'income' : 'expense'} 
              className="flex-1" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
