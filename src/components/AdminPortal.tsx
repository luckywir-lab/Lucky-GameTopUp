import React, { useState } from 'react';
import { GameItem, Transaction, NominalItem } from '../types';
import { LayoutDashboard, Users, CreditCard, Layers, Plus, DollarSign, Calendar, Edit, Check, X, ShieldAlert, Key, LogOut, CheckCircle, Trash2, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

interface AdminPortalProps {
  games: GameItem[];
  transactions: Transaction[];
  onUpdateTransactions: (updatedTxns: Transaction[]) => void;
  onUpdateGames: (updatedGames: GameItem[]) => void;
  isLoggedIn: boolean;
  onSetLoggedIn: (val: boolean) => void;
  darkMode: boolean;
}

export default function AdminPortal({
  games,
  transactions,
  onUpdateTransactions,
  onUpdateGames,
  isLoggedIn,
  onSetLoggedIn,
  darkMode,
}: AdminPortalProps) {
  // Login input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Editing package states
  const [selectedGameId, setSelectedGameId] = useState(games[0]?.id || '');
  const [newNominalName, setNewNominalName] = useState('');
  const [newNominalPrice, setNewNominalPrice] = useState('');

  // Format currency helper
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password.trim() === 'admin123') {
      onSetLoggedIn(true);
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: 'Selamat datang kembali, Administrator.',
        timer: 1500,
        showConfirmButton: false,
        background: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#ffffff' : '#0f172a',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Username atau password yang Anda masukkan salah.',
        confirmButtonColor: '#ef4444',
        background: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#ffffff' : '#0f172a',
      });
    }
  };

  const handleLogout = () => {
    onSetLoggedIn(false);
    setUsername('');
    setPassword('');
    Swal.fire({
      icon: 'info',
      title: 'Logged Out',
      text: 'Anda telah keluar dari dashboard administrator.',
      timer: 1500,
      showConfirmButton: false,
      background: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#ffffff' : '#0f172a',
    });
  };

  // Mutate Order Status (Selesaikan or Batalkan)
  const changeOrderStatus = (invoice: string, newStatus: 'Selesai' | 'Batal') => {
    const updatedTxns = transactions.map((t) => {
      if (t.invoice === invoice) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    onUpdateTransactions(updatedTxns);
    
    Swal.fire({
      icon: 'success',
      title: 'Status Diperbarui',
      text: `Status Invoice ${invoice} diubah menjadi ${newStatus}.`,
      timer: 1500,
      showConfirmButton: false,
      background: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#ffffff' : '#0f172a',
    });
  };

  // Delete transaction log
  const deleteTransaction = (invoice: string) => {
    Swal.fire({
      title: 'Hapus Transaksi?',
      text: 'Tindakan ini akan menghapus log transaksi ini secara permanen dari LocalStorage.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#ffffff' : '#0f172a',
    }).then((result) => {
      if (result.isConfirmed) {
        const remaining = transactions.filter((t) => t.invoice !== invoice);
        onUpdateTransactions(remaining);
        Swal.fire({
          title: 'Hapus Berhasil',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
          background: darkMode ? '#1e293b' : '#ffffff',
          color: darkMode ? '#ffffff' : '#0f172a',
        });
      }
    });
  };

  // Manage prices of existing Nominals
  const handlePriceChange = (gameId: string, nominalId: string, updatedPrice: number) => {
    const updatedGames = games.map((game) => {
      if (game.id === gameId) {
        const updatedNominals = game.nominals.map((nom) => {
          if (nom.id === nominalId) {
            return { ...nom, price: updatedPrice };
          }
          return nom;
        });
        return { ...game, nominals: updatedNominals };
      }
      return game;
    });
    onUpdateGames(updatedGames);
  };

  // Toggle active status for nominals
  const handleToggleNominalStatus = (gameId: string, nominalId: string, currentActiveState: boolean) => {
    const updatedGames = games.map((game) => {
      if (game.id === gameId) {
        const updatedNominals = game.nominals.map((nom) => {
          if (nom.id === nominalId) {
            return { ...nom, isActive: !currentActiveState };
          }
          return nom;
        });
        return { ...game, nominals: updatedNominals };
      }
      return game;
    });
    onUpdateGames(updatedGames);
  };

  // Add a brand new custom nominal package item to a selected game
  const handleAddNewNominal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNominalName.trim() || !newNominalPrice) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Tambah Paket',
        text: 'Nama nominal dan harga nominal wajib diisi.',
        background: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#ffffff' : '#0f172a',
      });
      return;
    }

    const priceNum = parseInt(newNominalPrice, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Harga Invalid',
        text: 'Masukkan nominal harga angka positif.',
        background: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#ffffff' : '#0f172a',
      });
      return;
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newNominal: NominalItem = {
      id: `${selectedGameId}-custom-${randomSuffix}`,
      name: newNominalName,
      price: priceNum,
      isActive: true,
    };

    const updatedGames = games.map((game) => {
      if (game.id === selectedGameId) {
        return { ...game, nominals: [...game.nominals, newNominal] };
      }
      return game;
    });

    onUpdateGames(updatedGames);
    setNewNominalName('');
    setNewNominalPrice('');

    Swal.fire({
      icon: 'success',
      title: 'Nominal Ditambahkan',
      text: 'Paket produk top up baru berhasil ditambahkan secara lokal.',
      timer: 1500,
      showConfirmButton: false,
      background: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#ffffff' : '#0f172a',
    });
  };

  // Calculators for analytics dashboard
  const totalCompletedEarnings = transactions
    .filter((tx) => tx.status === 'Selesai')
    .reduce((acc, tx) => acc + tx.totalPay, 0);

  const pendingConfirmationCount = transactions.filter((tx) => tx.status === 'Menunggu Pembayaran').length;

  // Render Login Portal if not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12">
        <div className={`p-8 rounded-2xl border text-center space-y-6 ${
          darkMode ? 'bg-[#0f172a] border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-lg'
        }`}>
          <div className="inline-flex p-4 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            <ShieldAlert className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Login Portal Admin</h2>
            <p className="text-xs text-slate-400 mt-1">Gunakan sandi default lokal untuk melihat panel manajemen top up.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan username (admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs sm:text-sm outline-none border transition-all ${
                  darkMode ? 'bg-slate-900/50 border-slate-800 text-white focus:border-yellow-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-yellow-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <Key className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Sandi Admin
              </label>
              <input
                type="password"
                placeholder="Masukkan password (admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs sm:text-sm outline-none border transition-all ${
                  darkMode ? 'bg-slate-900/50 border-slate-800 text-white focus:border-yellow-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-yellow-500'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-yellow-500 to-amber-600 hover:scale-[1.01] transition-transform text-xs sm:text-sm shadow-md cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>Autentikasi Sekarang</span>
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-500 leading-relaxed font-mono bg-slate-900/40 p-3 rounded-xl border border-slate-820">
            Username Pengujian: <span className="text-yellow-400">admin</span><br />
            Password Pengujian: <span className="text-yellow-400">admin123</span>
          </div>
        </div>
      </div>
    );
  }

  // Active Admin Dashboard View
  const targetGame = games.find((g) => g.id === selectedGameId) || games[0];

  return (
    <div className="space-y-8">
      {/* Admin Title Block header & Logout button */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6 text-yellow-400" />
            <span>CENTRAL DASHBOARD ADMNISTRATOR</span>
          </h2>
          <p className="text-xs text-slate-400">Kelola master harga, paket nominal voucher, dan setujui transaksi invoice gamers.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 px-4.5 py-2 rounded-xl text-xs font-semibold bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white duration-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>

      {/* Analytics Statistics Widget Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Transaksi */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Transaksi</span>
            <Layers className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">{transactions.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Log disimpan di memori sistem</p>
        </div>

        {/* Total Pendapatan */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Pendapatan</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 mt-1">
            {formatIDR(totalCompletedEarnings)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Diambil dari status "Selesai"</p>
        </div>

        {/* Jumlah Game */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Katalog Game</span>
            <Layers className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">{games.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Produk game aktif didukung</p>
        </div>

        {/* Antrean Verifikasi */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#0f172a] border-[#eab308]/20 bg-[#eab308]/5' : 'bg-[#eab308]/5 border-[#eab308]/20'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-500 tracking-wider">Menunggu Bayar</span>
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">{pendingConfirmationCount}</p>
          <p className="text-[10px] text-amber-400 mt-1">Perlu tindakan verifikasi Anda</p>
        </div>
      </div>

      {/* Main Split: Left Column pricing edits / Right Column order verification action rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Kelola Nominal & Harga (1 Column) */}
        <div className={`p-6 rounded-2xl border lg:col-span-1 space-y-6 ${
          darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div>
            <h3 className="font-bold text-base text-white tracking-wide border-b border-slate-800 pb-3">
              Kelola Nominal & Atur Harga
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Pilih game, sesuaikan harga jual, atau tambah item nominal baru.</p>
          </div>

          {/* Game dropdown selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Pilih Game Utama</label>
            <select
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-semibold outline-none border cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nominal listings for targeted game */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest border-b pb-1.5 border-dashed border-slate-800 flex justify-between">
              <span>Rinci Paket ({targetGame?.name})</span>
              <span className="text-[10px] text-slate-500 italic">Auto-Save Lokal</span>
            </h4>

            {targetGame?.nominals && targetGame.nominals.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 border-b border-dashed border-slate-800 pb-4">
                {targetGame.nominals.map((nom) => (
                  <div
                    key={nom.id}
                    className={`p-3 rounded-lg border flex flex-col gap-2.5 bg-slate-950/40 relative ${
                      nom.isActive ? 'border-slate-800' : 'border-red-500/25 bg-red-950/5'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">{nom.name}</span>
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={nom.isActive}
                          onChange={() => handleToggleNominalStatus(targetGame.id, nom.id, nom.isActive)}
                          className="rounded border-slate-800 text-blue-500 focus:ring-blue-500 bg-slate-900 pointer-events-auto"
                        />
                        <span className="text-[10px] font-medium text-slate-400">Aktif</span>
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Harga:</span>
                      <input
                        type="number"
                        value={nom.price}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handlePriceChange(targetGame.id, nom.id, isNaN(val) ? 0 : val);
                        }}
                        className={`w-full p-1.5 rounded text-xs text-right font-mono font-bold outline-none border ${
                          darkMode 
                            ? 'bg-slate-900 border-slate-800 text-emerald-400 focus:border-cyan-500' 
                            : 'bg-white border-slate-200 text-slate-800 focus:border-cyan-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Game ini belum memiliki nominal.</p>
            )}
          </div>

          {/* Form to append a new nominal */}
          <form onSubmit={handleAddNewNominal} className="space-y-3.5 pt-2">
            <h4 className="text-xs font-bold text-white uppercase border-l-2 border-blue-500 pl-2">Tambah Paket Baru</h4>
            <div>
              <input
                type="text"
                placeholder="Nama (Contoh: 1000 Diamond)"
                value={newNominalName}
                onChange={(e) => setNewNominalName(e.target.value)}
                className={`w-full p-2 rounded text-xs outline-none border ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Harga (Contoh: 150000)"
                value={newNominalPrice}
                onChange={(e) => setNewNominalPrice(e.target.value)}
                className={`w-full p-2 rounded text-xs outline-none border ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </form>
        </div>

        {/* Riwayat / Konfirmasi Pesanan Baru (2 Columns) */}
        <div className={`p-6 rounded-2xl border lg:col-span-2 space-y-6 ${
          darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white tracking-wide">
                Verifikasi & Manajemen Invoice Pembeli
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest animate-pulse w-fit">
                ● Auto-Callback Gateway Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Seluruh invoice baru terverifikasi otomatis oleh gateway server instan dalam 3-5 detik tanpa aksi manual admin. Anda juga dapat mengubah atau menghapus log secara manual di bawah ini.
            </p>
          </div>

          {/* Order control logs table */}
          {transactions.length > 0 ? (
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-3">Invoice / Game</th>
                    <th className="p-3">Data User ID</th>
                    <th className="p-3">Pembeli</th>
                    <th className="p-3">Total Bayar</th>
                    <th className="p-3 text-center">Aksi Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.invoice} className="hover:bg-slate-900/20 text-slate-300">
                      
                      {/* Invoice and Game info */}
                      <td className="p-3">
                        <span className="font-mono text-xs font-black text-amber-500 block">{tx.invoice}</span>
                        <span className="text-[10px] text-slate-400">{tx.gameName} - <span className="text-cyan-400 font-bold">{tx.nominalName}</span></span>
                      </td>

                      {/* Account IDs */}
                      <td className="p-3">
                        <span className="font-mono text-white select-all font-semibold block">{tx.userId}</span>
                        {tx.serverId && <span className="text-[10px] text-slate-400">Server: {tx.serverId}</span>}
                      </td>

                      {/* Buyer name and phone */}
                      <td className="p-3">
                        <span className="block text-slate-200 font-bold leading-none">{tx.buyerName}</span>
                        <span className="text-[10px] text-slate-400">{tx.buyerPhone}</span>
                      </td>

                      {/* Total Amount & payment channel name */}
                      <td className="p-3 uppercase">
                        <span className="font-mono text-emerald-400 font-bold block">{formatIDR(tx.totalPay)}</span>
                        <span className="text-[10px] text-slate-400">{tx.paymentMethod}</span>
                      </td>

                      {/* Action verification tools */}
                      <td className="p-3">
                        {tx.status === 'Menunggu Pembayaran' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => changeOrderStatus(tx.invoice, 'Selesai')}
                              className="p-1 px-2 pb-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center space-x-0.5 whitespace-nowrap"
                              title="Tandai pembayaran terverifikasi saldo dikirim"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Selesai</span>
                            </button>
                            <button
                              onClick={() => changeOrderStatus(tx.invoice, 'Batal')}
                              className="p-1 px-1.5 pb-1 bg-red-650 hover:bg-red-700 text-white rounded text-[10px] font-bold"
                              title="Batalkan/Tolak Transferan"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 px-1">
                            <span className={`px-2 py-0.5 text-[10.5px] font-bold rounded-full ${
                              tx.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {tx.status}
                            </span>
                            <button
                              onClick={() => deleteTransaction(tx.invoice)}
                              className="text-slate-500 hover:text-red-400 p-1"
                              title="Hapus Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border border-slate-800 border-dashed rounded-xl bg-slate-900/30">
              <p className="text-slate-500 text-xs sm:text-sm">Belum ada invoice yang masuk ke sistem database LocalStorage.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
