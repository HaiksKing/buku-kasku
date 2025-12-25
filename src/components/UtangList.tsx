import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utang } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';
import { deleteUtang, updateUtang } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Receipt, Trash2, Check } from 'lucide-react';
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

interface UtangListProps {
  utangList: Utang[];
  onUpdate: () => void;
}

export default function UtangList({ utangList, onUpdate }: UtangListProps) {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    deleteUtang(id);
    toast({
      title: 'Berhasil dihapus',
      description: 'Utang telah dihapus.',
    });
    onUpdate();
  };

  const handleToggleStatus = (utang: Utang) => {
    const newStatus = utang.status === 'belum_lunas' ? 'lunas' : 'belum_lunas';
    updateUtang({ ...utang, status: newStatus });
    toast({
      title: 'Status diperbarui',
      description: `Utang telah ditandai ${newStatus === 'lunas' ? 'lunas' : 'belum lunas'}.`,
    });
    onUpdate();
  };

  if (utangList.length === 0) {
    return (
      <Card variant="flat" className="text-center py-12">
        <CardContent>
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Belum Ada Utang</h3>
          <p className="text-muted-foreground">
            Klik tombol di atas untuk menambah catatan utang
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort by status (belum lunas first) then by date
  const sortedList = [...utangList].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'belum_lunas' ? -1 : 1;
    }
    return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedList.map((utang, index) => (
        <Card 
          key={utang.id} 
          variant="default"
          className={`animate-fade-in group ${utang.status === 'lunas' ? 'opacity-60' : ''}`}
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-debt/10 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-debt" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">
                      {utang.namaPihak}
                    </span>
                    <Badge variant={utang.status === 'lunas' ? 'secondary' : 'default'} className={`text-xs ${
                      utang.status === 'belum_lunas' ? 'bg-debt text-debt-foreground' : ''
                    }`}>
                      {utang.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(utang.tanggal)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`font-bold text-lg ${utang.status === 'lunas' ? 'text-muted-foreground line-through' : 'text-debt'}`}>
                  {formatCurrency(utang.jumlah)}
                </p>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleToggleStatus(utang)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-income hover:text-income"
                  title={utang.status === 'lunas' ? 'Tandai belum lunas' : 'Tandai lunas'}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Utang?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus catatan utang ini? 
                        Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(utang.id)}
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
      ))}
    </div>
  );
}
