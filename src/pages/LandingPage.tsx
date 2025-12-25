import { BookOpen, TrendingUp, TrendingDown, Receipt, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Pencatatan Mudah',
      description: 'Catat pemasukan dan pengeluaran dengan cepat dan mudah dalam hitungan detik.',
    },
    {
      icon: TrendingUp,
      title: 'Pantau Keuangan',
      description: 'Lihat ringkasan keuangan real-time dengan grafik yang informatif.',
    },
    {
      icon: Receipt,
      title: 'Kelola Utang',
      description: 'Catat dan pantau status utang piutang dengan mudah.',
    },
    {
      icon: BarChart3,
      title: 'Laporan Lengkap',
      description: 'Dapatkan laporan harian, bulanan, dan tahunan secara otomatis.',
    },
  ];

  const benefits = [
    'Gratis dan mudah digunakan',
    'Data tersimpan aman',
    'Laporan otomatis dan akurat',
    'Desain modern dan responsif',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Buku Kas</span>
          </div>
          <Button variant="hero" onClick={() => navigate('/buat-buku-kas')}>
            Mulai Sekarang
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              Platform Pembukuan Keuangan Digital
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Kelola Keuangan Anda dengan{' '}
              <span className="text-gradient">Mudah & Rapi</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Buku Kas membantu Anda mencatat, mengelola, dan menganalisis transaksi keuangan 
              secara otomatis dan terstruktur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" onClick={() => navigate('/buat-buku-kas')}>
                Buat Buku Kas
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => navigate('/daftar-buku-kas')}>
                Lihat Buku Kas Saya
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola keuangan dalam satu aplikasi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="elevated"
                className="group animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Kenapa Memilih <span className="text-gradient">Buku Kas</span>?
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative animate-float">
              <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-income/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-income" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                    <p className="text-xl font-bold text-foreground">Rp 15.000.000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-expense/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-expense" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                    <p className="text-xl font-bold text-foreground">Rp 8.500.000</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center animate-scale-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Mulai Kelola Keuangan Anda Sekarang
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Buat buku kas pertama Anda dan nikmati kemudahan pembukuan digital.
          </p>
          <Button variant="hero" size="xl" onClick={() => navigate('/buat-buku-kas')}>
            Buat Buku Kas Gratis
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Buku Kas</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Buku Kas. Platform pembukuan keuangan digital.
          </p>
        </div>
      </footer>
    </div>
  );
}
