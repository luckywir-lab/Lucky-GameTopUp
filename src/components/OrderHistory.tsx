import React, { useState } from 'react';
import { Transaction } from '../types';
import { Search, Filter, Calendar, CreditCard, ChevronRight, Eye, RefreshCw, X, ShieldCheck, Mail, ShoppingBag } from 'lucide-react';

interface OrderHistoryProps {
  transactions: Transaction[];
  onClearHistory?: () => void;
  onRefresh?: () => void;
  darkMode: boolean;
}

export default function OrderHistory({ transactions, onClearHistory, onRefresh, darkMode }: OrderHistoryProps) {
  const [searchInvoice, setSearchInvoice] = useState('');
  const [filterGame, setFilterGame] = useState('Semua');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Collect unique game names for the category filter
  const uniqueGames = Array.from(new Set(transactions.map((tx) => tx.gameName)));

  // Filter transactions
  const filteredTxns = transactions.filter((tx) => {
    const matchesInvoice = tx.invoice.toLowerCase().includes(searchInvoice.toLowerCase());
    const matchesGame = filterGame === 'Semua' || tx.gameName === filterGame;
    return matchesInvoice && matchesGame;
  });

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions Header bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Game dropdown filter */}
          <div className="relative">
            <select
              value={filterGame}
              onChange={(e) => setFilterGame(e.target.value)}
              className={`pl-3 pr-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium outline-none border transition-all appearance-none cursor-pointer ${
                darkMode
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300 focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500'
              }`}
            >
              <option value="Semua">Semua Game</option>
              {uniqueGames.map((game) => (
                <option key={game} value={game}>
                  {game}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
          </div>

          {/* Action buttons */}
          {transactions.length > 0 && (
            <button
              onClick={onClearHistory}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                darkMode
                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              }`}
            >
              Hapus Semua Riwayat
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Invoice searching bar */}
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Cari berdasarkan No. Invoice..."
            value={searchInvoice}
            onChange={(e) => setSearchInvoice(e.target.value)}
            className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none border transition-all ${
              darkMode
                ? 'bg-slate-900/60 border-slate-800 text-white focus:border-blue-500'
                : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
            }`}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
        </div>
      </div>

      {/* List content table */}
      {filteredTxns.length > 0 ? (
        <div className={`border rounded-2xl overflow-hidden ${
          darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10.5px] uppercase font-bold tracking-widest ${
                  darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <th className="px-6 py-4">No. Invoice</th>
                  <th className="px-6 py-4">Waktu Transaksi</th>
                  <th className="px-6 py-4">Game</th>
                  <th className="px-6 py-4">Nominal</th>
                  <th className="px-6 py-4">Total Bayar</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs sm:text-sm">
                {filteredTxns.map((tx) => (
                  <tr
                    key={tx.invoice}
                    className={`transition-colors duration-150 ${
                      darkMode ? 'text-slate-200 hover:bg-slate-900/30' : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-6 py-4.5 font-mono select-all text-blue-400 font-bold">{tx.invoice}</td>
                    <td className="px-6 py-4.5 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{tx.date}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4.5 font-bold text-white">{tx.gameName}</td>
                    <td className="px-6 py-4.5 font-medium text-slate-300">{tx.nominalName}</td>
                    <td className="px-6 py-4.5 font-bold font-mono text-emerald-400">{formatIDR(tx.totalPay)}</td>
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide leading-none ${
                        tx.status === 'Selesai'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : tx.status === 'Batal'
                          ? 'bg-red-500/15 text-red-500 border border-red-500/30'
                          : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <button
                        onClick={() => setSelectedTxn(tx)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          darkMode
                            ? 'bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20'
                            : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`text-center py-16 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-semibold mb-1">Tidak ada transaksi ditemukan</p>
          <p className="text-slate-500 text-xs text-center max-w-sm mx-auto p-2">
            Belum ada simulasi order dilakukan, atau tidak ada invoice yang cocok dengan pemfilteran Anda.
          </p>
        </div>
      )}

      {/* POPUP DETAIL MODAL DIALOG */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className={`relative max-w-lg w-full rounded-2xl border overflow-hidden shadow-2xl animate-[scaleUp_0.15s_ease-out] ${
            darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-800 bg-slate-900/60">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Struk Pembayaran</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-blue-400 select-all">{selectedTxn.invoice}</span>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Status Header Block */}
              <div className="text-center pb-4 border-b border-slate-830/60">
                <p className="text-slate-400 text-xs mb-1">Total yang Harus Dibayar</p>
                <p className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">{formatIDR(selectedTxn.totalPay)}</p>
                <div className="mt-3 flex justify-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold leading-none ${
                    selectedTxn.status === 'Selesai'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : selectedTxn.status === 'Batal'
                      ? 'bg-red-500/15 text-red-500 border border-red-500/30'
                      : 'bg-amber-500/15 text-amber-500 border border-amber-500/30 font-semibold'
                  }`}>
                    {selectedTxn.status}
                  </span>
                </div>
              </div>

              {/* Order Lists Details grid */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Game Terpilih:</span>
                  <span className="font-bold text-white">{selectedTxn.gameName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target User ID:</span>
                  <span className="font-mono font-bold text-white select-all">
                    {selectedTxn.userId} {selectedTxn.serverId ? `(${selectedTxn.serverId})` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nominal Item:</span>
                  <span className="font-bold text-blue-400">{selectedTxn.nominalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Harga Produk:</span>
                  <span className="font-mono text-white">{formatIDR(selectedTxn.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Metode Pembayaran:</span>
                  <span className="font-semibold text-cyan-400">{selectedTxn.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Biaya Admin:</span>
                  <span className="font-mono text-amber-500">{formatIDR(selectedTxn.adminFee)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-3">
                  <span className="font-bold text-slate-300">Waktu Order:</span>
                  <span className="text-slate-400 font-medium">{selectedTxn.date}</span>
                </div>
              </div>

              {/* QRIS Code or Bank Accounts Display details */}
              {selectedTxn.status === 'Menunggu Pembayaran' && (
                <div className="p-4 border border-dashed border-slate-700 rounded-xl bg-slate-930/60 text-center space-y-4">
                  {selectedTxn.paymentMethodCategory === 'QRIS' ? (
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">PINDAI KODE QR UNTUK BAYAR</p>
                      <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border flex items-center justify-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Invoice_${selectedTxn.invoice}_Total_${selectedTxn.totalPay}`}
                          alt="QRIS Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">Buka aplikasi e-wallet Anda (Gopay, DANA, OVO, LinkAja) lalu scan kode QR di atas.</p>
                    </div>
                  ) : selectedTxn.paymentMethodCategory === 'Transfer Bank' ? (
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">DIREKTUR TRANSFER MANUAL</p>
                      <p className="text-xs text-slate-300">Silakan kirim pembayaran secara presisi ke rekening berikut:</p>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center font-mono">
                        <p className="text-xs text-slate-400">No. Rekening Resmi:</p>
                        <p className="text-lg font-black text-white select-all">1270018274836</p>
                        <p className="text-[10px] text-slate-400 mt-1">Bank BCA - a/n PT GAME TOPUP PRO</p>
                      </div>
                      <p className="text-[10px] text-slate-400">Proses manual membutuhkan waktu validasi maksimal 15 menit.</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-rose-400 uppercase">DANA E-WALLET LINKED</p>
                      <p className="text-xs text-slate-300">Silakan selesaikan pembayaran di pop-up / push notification aplikasi HP Anda.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-4.5 bg-slate-900/60 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
