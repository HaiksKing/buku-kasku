import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { saveUtang, generateId } from '@/lib/storage';
import { Utang } from '@/types';
import { Receipt, X } from 'lucide-react';

interface UtangFormProps {
  bukuKasId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UtangForm({ bukuKasId, onSuccess, onCancel }: UtangFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    namaPihak: '',
    jumlah: '',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'belum_lunas' as 'belum_lunas' | 'lunas',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.namaPihak.trim()) {
      newErrors.namaPihak = 'Nama pihak wajib diisi';
    } else if (formData.namaPihak.length > 100) {
      newErrors.namaPihak = 'Nama pihak maksimal 100 karakter';
    }

    if (!formData.jumlah.trim()) {
      newErrors.jumlah = 'Jumlah wajib diisi';
    } else {
      const jumlah = parseFloat(formData.jumlah.replace(/[^\d]/g, ''));
      if (isNaN(jumlah) || jumlah <= 0) {
        newErrors.jumlah = 'Jumlah harus lebih dari 0';
      }
    }

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const utang: Utang = {
        id: generateId(),
        bukuKasId,
        namaPihak: formData.namaPihak.trim(),
        jumlah: parseFloat(formData.jumlah.replace(/[^\d]/g, '')),
        tanggal: new Date(formData.tanggal),
        status: formData.status,
        createdAt: new Date(),
      };

      saveUtang(utang);

      toast({
        title: 'Berhasil!',
        description: 'Utang berhasil dicatat.',
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan utang.',
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
    <Card variant="debt">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-debt/20 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-debt" />
          </div>
          <CardTitle>Tambah Utang</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="namaPihak">Nama Pihak *</Label>
              <Input
                id="namaPihak"
                placeholder="Nama orang/perusahaan"
                value={formData.namaPihak}
                onChange={(e) => setFormData({ ...formData, namaPihak: e.target.value })}
                className={errors.namaPihak ? 'border-destructive' : ''}
              />
              {errors.namaPihak && (
                <p className="text-sm text-destructive">{errors.namaPihak}</p>
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
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'belum_lunas' | 'lunas') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="belum_lunas">Belum Lunas</SelectItem>
                  <SelectItem value="lunas">Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
            <Button type="submit" variant="debt" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
