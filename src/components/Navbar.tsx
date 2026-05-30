import React, { useState, useEffect } from 'react';
import { Gamepad2, History, ShieldAlert, Sun, Moon, Clock, LayoutDashboard, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isAdminLoggedIn: boolean;
  setAdminLoggedIn: (val: boolean) => void;
}

export default function Navbar({
  currentTab,
  setTab,
  darkMode,
  setDarkMode,
  isAdminLoggedIn,
  setAdminLoggedIn,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleNavClick = (tab: string) => {
    setTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuItems = [
    { id: 'home', label: 'Beranda', icon: Gamepad2 },
    { id: 'history', label: 'Riwayat Transaksi', icon: History },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? 'bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 shadow-lg shadow-blue-900/10'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                GameTopUp <span className="text-yellow-400">Pro</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest hidden sm:block uppercase">INSTANT DELIVERY</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : darkMode
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin Dashboard / Portal Button */}
            <button
              onClick={() => handleNavClick(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentTab === 'admin-dashboard' || currentTab === 'admin-login'
                  ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  : darkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-yellow-500" />
              <span>{isAdminLoggedIn ? 'Dashboard Admin' : 'Admin Login'}</span>
            </button>
          </div>

          {/* Clock, Dark Mode & Hamburger menu */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live Clock Widget */}
            <div className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono border ${
              darkMode 
                ? 'bg-slate-900/50 border-slate-800 text-cyan-400' 
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span>{time || '00:00:00'} WITA</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-all duration-150 ${
                darkMode
                  ? 'bg-slate-900/50 border-slate-800 text-yellow-400 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Ganti Tema"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg md:hidden border ${
                darkMode
                  ? 'bg-slate-900/50 border-slate-800 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t animate-[slideDown_0.2s_ease-out] ${
            darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border-l-4 border-l-blue-500'
                      : darkMode
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-150'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => handleNavClick(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${
                currentTab === 'admin-dashboard' || currentTab === 'admin-login'
                  ? 'bg-yellow-500/15 text-yellow-400 border-l-4 border-l-yellow-500'
                  : darkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-yellow-500" />
              <span>{isAdminLoggedIn ? 'Dashboard Admin [Lokal]' : 'Admin Portal [Lokal]'}</span>
            </button>

            {/* Live Clock mobile info */}
            <div className="px-4 py-2.5 flex items-center space-x-2 text-xs text-slate-400 font-mono border-t border-slate-800 mt-2">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              <span>Waktu Server: {time || '00:00:00'} WITA</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
