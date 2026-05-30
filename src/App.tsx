import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PromoSlider from './components/PromoSlider';
import GameGrid from './components/GameGrid';
import TopUpForm from './components/TopUpForm';
import OrderHistory from './components/OrderHistory';
import AdminPortal from './components/AdminPortal';

import { GameItem, Transaction, PromoBanner, FAQItem } from './types';
import { DEFAULT_GAMES, DEFAULT_PAYMENT_METHODS, DEFAULT_PROMOS, DEFAULT_FAQS } from './data';
import { Gamepad2, Heart, ShieldAlert, Sparkles, HelpCircle, ArrowUp, Zap, Star, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';

export default function App() {
  // Navigation tab route state
  const [currentTab, setTab] = useState<string>('home');
  
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Storage states
  const [games, setGames] = useState<GameItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAdminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);

  // Active game choice state (defaults to Mobile Legends)
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);

  // UI state managers
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    // 1. Theme initialization
    const savedTheme = localStorage.getItem('topup_dark_mode');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    }

    // 2. Games initialization list
    const savedGames = localStorage.getItem('topup_games_catalog');
    if (savedGames) {
      try {
        setGames(JSON.parse(savedGames));
      } catch (e) {
        setGames(DEFAULT_GAMES);
      }
    } else {
      setGames(DEFAULT_GAMES);
      localStorage.setItem('topup_games_catalog', JSON.stringify(DEFAULT_GAMES));
    }

    // Set default selected game to Mobile Legends on load
    const mlGame = DEFAULT_GAMES.find(g => g.id === 'mobile-legends');
    if (mlGame) {
      setSelectedGame(mlGame);
    }

    // 3. Transactions initialization list
    const savedTxns = localStorage.getItem('topup_transactions_log');
    if (savedTxns) {
      try {
        setTransactions(JSON.parse(savedTxns));
      } catch (e) {
        setTransactions([]);
      }
    } else {
      setTransactions([]);
    }

    // 4. Session admin check
    const savedAdminSession = sessionStorage.getItem('topup_admin_logged_in');
    if (savedAdminSession === 'true') {
      setAdminLoggedIn(true);
    }

    // Loading transition simulation to increase premium UX feel
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 800);

    // Scroll display logic
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Save changes callback handlers
  const handleUpdateGames = (updatedGames: GameItem[]) => {
    setGames(updatedGames);
    localStorage.setItem('topup_games_catalog', JSON.stringify(updatedGames));
    
    // Auto-refresh the selected game structure details if active
    if (selectedGame) {
      const refreshedSelected = updatedGames.find((g) => g.id === selectedGame.id);
      if (refreshedSelected) {
        setSelectedGame(refreshedSelected);
      }
    }
  };

  const handleUpdateTransactions = (updatedTxns: Transaction[]) => {
    setTransactions(updatedTxns);
    localStorage.setItem('topup_transactions_log', JSON.stringify(updatedTxns));
  };

  const handleOrderSuccess = (newTxn: Transaction) => {
    const updated = [newTxn, ...transactions];
    setTransactions(updated);
    localStorage.setItem('topup_transactions_log', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Semua riwayat simulasi transaksi personal Anda akan dihapus dari memori komputer ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus Semua!',
      cancelButtonText: 'Jangan Hapus',
      background: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#ffffff' : '#0f172a',
    }).then((result) => {
      if (result.isConfirmed) {
        setTransactions([]);
        localStorage.removeItem('topup_transactions_log');
        Swal.fire({
          title: 'Dibersihkan!',
          text: 'Seluruh riwayat transaksi log berhasil dikosongkan.',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          background: darkMode ? '#1e293b' : '#ffffff',
          color: darkMode ? '#ffffff' : '#0f172a',
        });
      }
    });
  };

  // Toggle theme storage
  const handleSetDarkMode = (val: boolean) => {
    setDarkMode(val);
    localStorage.setItem('topup_dark_mode', val.toString());
  };

  // Real-time automatic instant callback & fulfillment simulator (Auto-Gateway Approval)
  useEffect(() => {
    const pending = transactions.filter(t => t.status === 'Menunggu Pembayaran');
    if (pending.length === 0) return;

    const timers = pending.map((tx) => {
      return setTimeout(() => {
        setTransactions((prevTxns) => {
          const updated = prevTxns.map((t) => {
            if (t.invoice === tx.invoice && t.status === 'Menunggu Pembayaran') {
              // Trigger a lovely success pop-up indicating automatic checkout fulfillment was processed
              Swal.fire({
                title: 'Pembayaran Sukses Terverifikasi!',
                html: `
                  <div class="text-left space-y-2 mt-2 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto p-4 border rounded-xl bg-emerald-500/5 border-emerald-500/20 text-slate-300">
                    <p class="text-emerald-400 font-extrabold mb-2 select-none flex items-center justify-center gap-1.5 text-center text-xs uppercase tracking-wider">
                      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      INSTANT GATEWAY SUCCESS (AUTO-DELIVERY)
                    </p>
                    <p><strong>No. Invoice:</strong> <span class="font-mono text-cyan-400 font-bold font-mono select-all">${t.invoice}</span></p>
                    <p><strong>Game Tujuan:</strong> ${t.gameName}</p>
                    <p><strong>ID Penerima:</strong> ${t.userId} ${t.serverId ? `(${t.serverId})` : ''}</p>
                    <p><strong>Item Produk:</strong> ${t.nominalName}</p>
                    <div class="mt-4 p-2.5 text-[11px] border border-blue-500/20 rounded bg-blue-500/5 text-blue-400 text-center leading-normal">
                      Sistem <b>Instant Callback</b> mendeteksi pembayaran sah. Diamond telah dikirim otomatis melalui Game Server API. Cek Akun Anda!
                    </div>
                  </div>
                `,
                icon: 'success',
                confirmButtonText: 'Selesai & Cek Akun',
                confirmButtonColor: '#10b981',
                background: darkMode ? '#0f172a' : '#ffffff',
                color: darkMode ? '#ffffff' : '#0f172a',
              });
              
              return { ...t, status: 'Selesai' as const };
            }
            return t;
          });
          localStorage.setItem('topup_transactions_log', JSON.stringify(updated));
          return updated;
        });
      }, 4000); // 4 seconds simulated automatic gateway confirmation delay
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [transactions, darkMode]);

  // Set logged in session
  const handleSetAdminLoggedIn = (val: boolean) => {
    setAdminLoggedIn(val);
    if (val) {
      sessionStorage.setItem('topup_admin_logged_in', 'true');
      setTab('admin-dashboard');
    } else {
      sessionStorage.removeItem('topup_admin_logged_in');
      setTab('home');
    }
  };

  const handleSelectGame = (game: GameItem) => {
    setSelectedGame(game);
    // Smooth scroll down directly to step input
    setTimeout(() => {
      const element = document.getElementById('topup-flow-form-label');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // FAQ Expand toggle
  const toggleFaq = (idx: number) => {
    setFaqOpenIndex(faqOpenIndex === idx ? null : idx);
  };

  // Back to top click handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (appLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19] text-white">
        <div className="relative flex flex-col items-center">
          {/* Outer glowing pulsing orb */}
          <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
          
          {/* Spinning loader with double rings */}
          <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-400 border-r-blue-500 animate-spin" />
          
          <div className="mt-6 text-center space-y-1">
            <h1 className="text-xl font-extrabold tracking-widest bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              GAMETOPUP <span className="text-yellow-400">PRO</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest animate-pulse">SYNCHRONIZING SECURE VOUCHER CACHE...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 flex flex-col ${
      darkMode ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* 1. Header/Navbar sticky */}
      <Navbar
        currentTab={currentTab}
        setTab={setTab}
        darkMode={darkMode}
        setDarkMode={handleSetDarkMode}
        isAdminLoggedIn={isAdminLoggedIn}
        setAdminLoggedIn={handleSetAdminLoggedIn}
      />

      {/* Main app body contents */}
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        
        {currentTab === 'home' && (
          <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
            {/* HERO SECTION WITH PROMO BANNER ROTATOR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Promo Banner Left Side Hero labels banner */}
              <div className="lg:col-span-1 space-y-5 text-left py-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold bg-blue-600/15 text-blue-400 border border-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
                  <span>SISTEM VOUCHER INSTAN #1</span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight md:leading-none text-white select-none">
                  Top Up Game <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
                    Murah, Cepat, 
                  </span> 
                  <br />dan Aman
                </h1>
                
                <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Nikmati pengalaman isi ulang saldo gila instan secepat kilat untuk Diamond Mobile Legends, Genshin Impact Genesis, Valorant Points, dan game terkemuka lainnya secara real-time!
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="flex items-center space-x-1 text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-820">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>100% Legal</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-820">
                    <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>Proses 1 Detik</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-820">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>Layanan 24/7</span>
                  </div>
                </div>
              </div>

              {/* Slider Showcase component right side */}
              <div className="lg:col-span-2">
                <PromoSlider
                  promos={DEFAULT_PROMOS}
                  darkMode={darkMode}
                  onTopUpClick={() => {
                    const scrollTarget = document.getElementById('daftar-game-sect');
                    if (scrollTarget) {
                      scrollTarget.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
              </div>
            </div>

            {/* DAFTAR GAME SECTION */}
            <div id="daftar-game-sect" className="space-y-6 pt-6 scroll-mt-24">
              <div className="border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest flex items-center space-x-2">
                  <Gamepad2 className="w-5 h-5 text-blue-500 animate-pulse" />
                  <span>DAFTAR GAME TERSEDIA</span>
                </h2>
                <p className="text-xs text-slate-400">Pilih salah satu ikon game andalan Anda untuk melihat diskon nominal terbaik.</p>
              </div>

              <GameGrid
                games={games}
                selectedGame={selectedGame}
                onSelectGame={handleSelectGame}
                darkMode={darkMode}
              />
            </div>

            {/* REACTIVE TOP UP STEPS FLOW FORM */}
            {selectedGame ? (
              <div id="topup-flow-form-label" className="space-y-6 pt-8 scroll-mt-24 border-t border-slate-820/60 transition-all duration-300">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                    <span>FORMULIR TOP-UP INSTAN: {selectedGame.name}</span>
                  </h2>
                  <p className="text-xs text-slate-400">Selesaikan data akun, nominal diamond, pembayaran dan checkout.</p>
                </div>

                <TopUpForm
                  game={selectedGame}
                  paymentMethods={DEFAULT_PAYMENT_METHODS}
                  onOrderSuccess={handleOrderSuccess}
                  darkMode={darkMode}
                />
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/10">
                <p className="text-slate-400 font-semibold text-sm">Silakan klik salah satu Card game di atas untuk memuat formulir Top Up otomatis.</p>
              </div>
            )}

            {/* FAQ ACCORDION LAYOUT SECTION */}
            <div className="space-y-6 pt-10 border-t border-slate-820/30">
              <div className="border-l-4 border-purple-500 pl-4">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-purple-500" />
                  <span>PERTANYAAN UMUM (FAQ)</span>
                </h2>
                <p className="text-xs text-slate-400">Butuh bantuan? Silakan temukan jawaban tercepat Anda di bawah ini.</p>
              </div>

              <div className="space-y-3 max-w-4xl">
                {DEFAULT_FAQS.map((faq, index) => {
                  const isOpen = faqOpenIndex === index;
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'border-blue-500/40 bg-blue-950/15'
                          : darkMode
                          ? 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left px-5 py-4 font-bold text-xs sm:text-sm text-slate-200 flex justify-between items-center outline-none"
                      >
                        <span>{faq.question}</span>
                        <span className={`text-blue-500 text-lg sm:text-xl font-bold transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                          +
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-820/30 pt-3.5">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {currentTab === 'history' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5 text-blue-500" />
                <span>RIWAYAT TRANSAKSI PERSONAL</span>
              </h2>
              <p className="text-xs text-slate-400">Lacak rincian pembayaran voucher yang Anda simulasikan di situs kami.</p>
            </div>

            <OrderHistory
              transactions={transactions}
              onClearHistory={handleClearHistory}
              darkMode={darkMode}
              onRefresh={() => {
                // Read fresh local transactions
                const fresh = localStorage.getItem('topup_transactions_log');
                if (fresh) {
                  setTransactions(JSON.parse(fresh));
                }
              }}
            />
          </div>
        )}

        {currentTab === 'admin-login' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <AdminPortal
              games={games}
              transactions={transactions}
              onUpdateTransactions={handleUpdateTransactions}
              onUpdateGames={handleUpdateGames}
              isLoggedIn={isAdminLoggedIn}
              onSetLoggedIn={handleSetAdminLoggedIn}
              darkMode={darkMode}
            />
          </div>
        )}

        {currentTab === 'admin-dashboard' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <AdminPortal
              games={games}
              transactions={transactions}
              onUpdateTransactions={handleUpdateTransactions}
              onUpdateGames={handleUpdateGames}
              isLoggedIn={isAdminLoggedIn}
              onSetLoggedIn={handleSetAdminLoggedIn}
              darkMode={darkMode}
            />
          </div>
        )}

      </main>

      {/* FLOATING BACK TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 sm:p-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 border border-blue-400/25 active:scale-95 duration-200 transition-all focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
          title="Ke atas"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* FOOTER SECTION */}
      <footer className={`border-t transition-all mt-16 ${
        darkMode ? 'bg-slate-950 border-slate-930 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow">
                <Gamepad2 className="w-4 h-4" />
              </span>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                GameTopUp <span className="text-yellow-400 font-bold">Pro</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm font-medium">
              GameTopUp Pro menyediakan infrastruktur penyaluran diamond, chip, koin, dan point game terlengkap di Indonesia dengan harga super miring, lisensi resmi legal, dan proses 1-detik instan otomatis online 24 jam penuh.
            </p>
          </div>

          {/* Column 2: Cara Top Up */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-cyan-500 pl-2">Bagaimana Caranya?</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-blue-400 transition-colors pointer-events-auto cursor-pointer" onClick={() => handleSelectGame(games[0])}>1. Pilih Game Favorit Anda</li>
              <li className="hover:text-blue-400 transition-colors pointer-events-auto cursor-pointer" onClick={() => handleSelectGame(games[0])}>2. Masukkan ID Akun Valid</li>
              <li className="hover:text-blue-400 transition-colors pointer-events-auto cursor-pointer" onClick={() => handleSelectGame(games[0])}>3. Klik Nominal & Opsi Bayar</li>
              <li className="hover:text-blue-400 transition-colors pointer-events-auto cursor-pointer" onClick={() => handleSelectGame(games[0])}>4. Selesaikan Transfer & Amankan Item</li>
            </ul>
          </div>

          {/* Column 3: Legal links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-purple-500 pl-2">Kebijakan Hukum</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-blue-400 transition-colors pointer-events-auto cursor-pointer">Syarat & Ketentuan Penggunaan</li>
              <li className="hover:text-blue-400 transition-colors pointer-events-auto cursor-pointer">Kebijakan Perlindungan Privasi</li>
              <li className="hover:text-blue-400 transition-colors pointer-events-auto cursor-pointer">Jaminan Keamanan Anti-Banned</li>
              <li className="hover:text-blue-400 transition-colors pointer-events-auto cursor-pointer">Pengajuan Refund & Pembatalan</li>
            </ul>
          </div>

          {/* Column 4: Kontak Sosial Media */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-yellow-500 pl-2">Saluran Kontak</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>support@gametopup-pro.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>+62 821-9384-9182</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Gedung Bisnis Digital UAS, Makassar, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* copyright and credentials section footer bottom */}
        <div className={`py-6 border-t ${
          darkMode ? 'border-slate-900 bg-slate-930 text-slate-500' : 'border-slate-200 bg-slate-150 text-slate-600'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 font-semibold">
            <p className="tracking-wide">
              &copy; {new Date().getFullYear()} GameTopUp Pro. Seluruh hak cipta dilindungi undang-undang. Dirancang sebagai proyek UAS Bisnis Digital & Algoritma Pemrograman.
            </p>
            <div className="flex space-x-3 text-[11px] font-mono">
              <span className="text-blue-500">HTML5</span>
              <span>&bull;</span>
              <span className="text-cyan-400">TailwindCSS</span>
              <span>&bull;</span>
              <span className="text-purple-400">ReactJS</span>
              <span>&bull;</span>
              <span className="text-yellow-400">LocalStorage</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
