import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Transaksi } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';
import { deleteTransaksi } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
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

interface TransaksiListProps {
  transaksiList: Transaksi[];
  onUpdate: () => void;
}

export default function TransaksiList({ transaksiList, onUpdate }: TransaksiListProps) {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    deleteTransaksi(id);
    toast({
      title: 'Berhasil dihapus',
      description: 'Transaksi telah dihapus.',
    });
    onUpdate();
  };

  if (transaksiList.length === 0) {
    return (
      <Card variant="flat" className="text-center py-12">
        <CardContent>
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Belum Ada Transaksi</h3>
          <p className="text-muted-foreground">
            Klik tombol di atas untuk menambah transaksi
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort by date descending
  const sortedList = [...transaksiList].sort((a, b) => 
    new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedList.map((transaksi, index) => (
        <Card 
          key={transaksi.id} 
          variant="default"
          className="animate-fade-in group"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  transaksi.tipe === 'pemasukan' ? 'bg-income/10' : 'bg-expense/10'
                }`}>
                  {transaksi.tipe === 'pemasukan' ? (
                    <TrendingUp className="w-5 h-5 text-income" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-expense" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {transaksi.kategori}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaksi.tanggal)}
                    </span>
                  </div>
                  {transaksi.keterangan && (
                    <p className="text-sm text-muted-foreground truncate">
                      {transaksi.keterangan}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`font-bold text-lg ${
                  transaksi.tipe === 'pemasukan' ? 'text-income' : 'text-expense'
                }`}>
                  {transaksi.tipe === 'pemasukan' ? '+' : '-'}{formatCurrency(transaksi.jumlah)}
                </p>
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
                      <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus transaksi ini? 
                        Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(transaksi.id)}
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
