import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // Mengubah BrowserRouter menjadi HashRouter
import Index from "./pages/Index";
import BuatBukuKas from "./pages/BuatBukuKas";
import DaftarBukuKas from "./pages/DaftarBukuKas";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* HashRouter tidak memerlukan 'basename', sehingga lebih aman dari error refresh */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/buat-buku-kas" element={<BuatBukuKas />} />
          <Route path="/daftar-buku-kas" element={<DaftarBukuKas />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          {/* SEMUA RUTE CUSTOM DI ATAS RUTE "*" */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
