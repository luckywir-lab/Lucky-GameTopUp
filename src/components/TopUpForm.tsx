import React, { useState, useEffect } from 'react';
import { GameItem, NominalItem, PaymentMethod, Transaction } from '../types';
import { DEFAULT_PAYMENT_METHODS } from '../data';
import { User, Server, Wallet, CreditCard, ShieldCheck, Mail, Phone, ShoppingCart, Info, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';

interface TopUpFormProps {
  game: GameItem;
  paymentMethods: PaymentMethod[];
  onOrderSuccess: (txn: Transaction) => void;
  darkMode: boolean;
}

export default function TopUpForm({ game, paymentMethods, onOrderSuccess, darkMode }: TopUpFormProps) {
  // Field States
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  
  const [selectedNominal, setSelectedNominal] = useState<NominalItem | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  // Error validations states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset top-up selections when switched to another game
  useEffect(() => {
    setSelectedNominal(null);
    setSelectedPayment(null);
    setUserId('');
    setServerId('');
    setErrors({});
  }, [game]);

  // Format currency
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculations
  const basePrice = selectedNominal ? selectedNominal.price : 0;
  
  const calculateAdminFee = (price: number, payment: PaymentMethod | null) => {
    if (!payment || price === 0) return 0;
    const fee = (price * (payment.feePercent / 100)) + payment.feeFlat;
    return Math.round(fee);
  };

  const adminFee = calculateAdminFee(basePrice, selectedPayment);
  const totalAmount = basePrice + adminFee;

  // Real-time validations on keystroke
  const validateField = (name: string, value: string) => {
    let err = '';
    if (!value.trim()) {
      err = 'Bagian ini tidak boleh dikosongkan';
    } else if (name === 'buyerEmail' && !/\S+@\S+\.\S+/.test(value)) {
      err = 'Alamat email tidak valid';
    } else if (name === 'buyerPhone' && !/^[0-9+]{8,15}$/.test(value)) {
      err = 'Nomor WhatsApp tidak valid (8-15 digit angka)';
    }
    setErrors((prev) => ({ ...prev, [name]: err }));
    return !err;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check account fields
    const newErrors: { [key: string]: string } = {};
    if (!userId.trim()) {
      newErrors.userId = `${game.trackerLabel} wajib diisi!`;
    }
    if (game.hasServer && !serverId.trim()) {
      newErrors.serverId = `${game.serverIdLabel || 'Server'} wajib diisi!`;
    }

    // 2. Contact details
    if (!buyerName.trim()) {
      newErrors.buyerName = 'Nama Lengkap wajib diisi!';
    }
    if (!buyerEmail.trim()) {
      newErrors.buyerEmail = 'Email wajib diisi!';
    } else if (!/\S+@\S+\.\S+/.test(buyerEmail)) {
      newErrors.buyerEmail = 'Format email salah!';
    }
    if (!buyerPhone.trim()) {
      newErrors.buyerPhone = 'Nomor WhatsApp wajib diisi!';
    } else if (!/^[0-9+]{8,15}$/.test(buyerPhone)) {
      newErrors.buyerPhone = 'Format nomor HP salah! Contoh: 081234567890';
    }

    setErrors(newErrors);

    // 3. Validation highlights for missing Nominal or Payment selections via SweetAlert
    if (!selectedNominal) {
      Swal.fire({
        icon: 'warning',
        title: 'Nominal Belum Dipilih',
        text: 'Silakan pilih nominal produk game terlebih dahulu di Langkah 2.',
        confirmButtonColor: '#3b82f6',
        background: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#ffffff' : '#0f172a',
      });
      return;
    }

    if (!selectedPayment) {
      Swal.fire({
        icon: 'warning',
        title: 'Metode Pembayaran Belum Dipilih',
        text: 'Silakan pilih metode pembayaran Anda di Langkah 3.',
        confirmButtonColor: '#3b82f6',
        background: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#ffffff' : '#0f172a',
      });
      return;
    }

    // Checking if other standard field errors exist
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Detail Belum Lengkap',
        text: 'Silakan koreksi semua bagian form yang bertanda merah.',
        confirmButtonColor: '#ef4444',
        background: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#ffffff' : '#0f172a',
      });
      return;
    }

    // Create Transaction JSON Object
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateObj = new Date();
    const invoiceNumber = `INV-${dateObj.getFullYear()}${(dateObj.getMonth() + 1).toString().padStart(2, '0')}${dateObj.getDate().toString().padStart(2, '0')}-${randomSuffix}`;
    
    const newTransaction: Transaction = {
      invoice: invoiceNumber,
      date: dateObj.toLocaleString('id-ID'),
      userId,
      serverId: game.hasServer ? serverId : undefined,
      gameId: game.id,
      gameName: game.name,
      nominalId: selectedNominal.id,
      nominalName: selectedNominal.name,
      price: selectedNominal.price,
      paymentMethod: selectedPayment.name,
      paymentMethodCategory: selectedPayment.category,
      adminFee,
      totalPay: totalAmount,
      buyerName,
      buyerEmail,
      buyerPhone,
      status: 'Menunggu Pembayaran',
    };

    // Save with Swal Success Alert!
    onOrderSuccess(newTransaction);
    
    Swal.fire({
      icon: 'success',
      title: 'Pesanan Berhasil Dibuat!',
      html: `
        <div class="text-left space-y-2 mt-4 text-xs sm:text-sm leading-relaxed max-w-md mx-auto p-4 border rounded-xl ${
          darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }">
          <p><strong>No. Invoice:</strong> <span class="font-mono text-blue-400 select-all font-bold">${invoiceNumber}</span></p>
          <p><strong>Game:</strong> ${game.name}</p>
          <p><strong>Target ID:</strong> ${userId} ${serverId ? `(${serverId})` : ''}</p>
          <p><strong>Nominal:</strong> ${selectedNominal.name}</p>
          <p><strong>Total Transfer:</strong> <span class="text-emerald-500 font-bold font-mono">${formatIDR(totalAmount)}</span></p>
          <p><strong>Pembayaran:</strong> ${selectedPayment.name}</p>
          <p><strong>Status:</strong> <span class="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-500/20 text-amber-500">Menunggu Pembayaran</span></p>
          <div class="mt-4 p-2 text-[11px] border border-amber-500/20 rounded bg-amber-500/5 text-amber-500 text-center">
            PENTING: Saldo akan diproses secara otomatis segera setelah dana Anda terkirim.
          </div>
        </div>
      `,
      confirmButtonText: 'Saya Mengerti',
      confirmButtonColor: '#10b981',
      background: darkMode ? '#151d30' : '#ffffff',
      color: darkMode ? '#ffffff' : '#0f172a',
    });

    // Clear top up input selections
    setUserId('');
    setServerId('');
    setSelectedNominal(null);
    setSelectedPayment(null);
    setBuyerName('');
    setBuyerEmail('');
    setBuyerPhone('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 4 Steps Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Step Modules: Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STEP 1: ACCOUNT DETAILS */}
          <div className={`p-6 sm:p-8 rounded-2xl border ${
            darkMode ? 'bg-[#0f172a] border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
          }`} id="step-id-account">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4 border-dashed border-slate-800">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">1</span>
              <div>
                <h3 className="font-bold text-lg text-white">Lengkapi Data Akun Game</h3>
                <p className="text-xs text-slate-400">Masukkan detail ID identitas akun game target Anda.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-1.5 text-blue-500" />
                  {game.trackerLabel} <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder={game.trackerPlaceholder}
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    validateField('userId', e.target.value);
                  }}
                  className={`w-full p-3 rounded-xl text-sm outline-none border transition-all ${
                    errors.userId
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/10'
                      : darkMode
                      ? 'bg-slate-900/50 border-slate-800 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                  }`}
                />
                {errors.userId && (
                  <p className="text-[11px] text-red-500 mt-1.5 flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    {errors.userId}
                  </p>
                )}
              </div>

              {game.hasServer && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2 flex items-center">
                    <Server className="w-4 h-4 mr-1.5 text-blue-500" />
                    {game.serverIdLabel} <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  {game.id === 'genshin-impact' ? (
                    <select
                      value={serverId}
                      onChange={(e) => {
                        setServerId(e.target.value);
                        validateField('serverId', e.target.value);
                      }}
                      className={`w-full p-3 rounded-xl text-sm outline-none border transition-all ${
                        errors.serverId
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500/10'
                          : darkMode
                          ? 'bg-slate-900/50 border-slate-800 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    >
                      <option value="">-- Pilih Server --</option>
                      <option value="Asia">Asia (AS)</option>
                      <option value="America">America (NA)</option>
                      <option value="Europe">Europe (EU)</option>
                      <option value="TW_HK_MO">Taiwan/Hong Kong/Macao</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={game.serverIdPlaceholder}
                      value={serverId}
                      onChange={(e) => {
                        setServerId(e.target.value);
                        validateField('serverId', e.target.value);
                      }}
                      className={`w-full p-3 rounded-xl text-sm outline-none border transition-all ${
                        errors.serverId
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500/10'
                          : darkMode
                          ? 'bg-slate-900/50 border-slate-800 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  )}
                  {errors.serverId && (
                    <p className="text-[11px] text-red-500 mt-1.5 flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      {errors.serverId}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: CHOOSE NOMINALS */}
          <div className={`p-6 sm:p-8 rounded-2xl border ${
            darkMode ? 'bg-[#0f172a] border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
          }`} id="step-id-nominals">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4 border-dashed border-slate-800">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">2</span>
              <div>
                <h3 className="font-bold text-lg text-white">Pilih Nominal Top Up</h3>
                <p className="text-xs text-slate-400">Pilih jumlah item/koin/diamond yang ingin Anda beli.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {game.nominals && game.nominals.filter(x => x.isActive).map((nominal) => {
                const isNomActive = selectedNominal?.id === nominal.id;
                return (
                  <div
                    key={nominal.id}
                    onClick={() => setSelectedNominal(nominal)}
                    className={`p-3.5 sm:p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between hover:scale-[1.02] shadow-sm ${
                      isNomActive
                        ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500 text-white shadow-md shadow-blue-500/10'
                        : darkMode
                        ? 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span className="font-bold text-xs sm:text-sm md:text-base leading-tight">
                      {nominal.name}
                    </span>
                    <span className="text-[11px] sm:text-xs text-amber-400 font-mono font-bold mt-2.5">
                      {formatIDR(nominal.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className={`p-6 sm:p-8 rounded-2xl border ${
            darkMode ? 'bg-[#0f172a] border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
          }`} id="step-id-payment">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4 border-dashed border-slate-800">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">3</span>
              <div>
                <h3 className="font-bold text-lg text-white">Pilih Metode Pembayaran</h3>
                <p className="text-xs text-slate-400">Pilih opsi pembayaran paling aman dan mudah.</p>
              </div>
            </div>

            {/* Categories of Payment grouping */}
            <div className="space-y-6">
              {['QRIS', 'E-Wallet', 'Transfer Bank'].map((catName) => {
                const methodsInCat = paymentMethods.filter((pm) => pm.category === catName);
                if (methodsInCat.length === 0) return null;
                return (
                  <div key={catName} className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-1">
                      {catName === 'QRIS' && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                      {catName === 'E-Wallet' && <Wallet className="w-3.5 h-3.5 text-cyan-500" />}
                      {catName === 'Transfer Bank' && <CreditCard className="w-3.5 h-3.5 text-purple-500" />}
                      <span>{catName}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {methodsInCat.map((pm) => {
                        const isPmActive = selectedPayment?.id === pm.id;
                        // Dynamically calculate nominal price if selected
                        const pmFee = calculateAdminFee(basePrice, pm);
                        
                        return (
                          <div
                            key={pm.id}
                            onClick={() => setSelectedPayment(pm)}
                            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.015] ${
                              isPmActive
                                ? 'border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500 shadow-md shadow-cyan-500/10'
                                : darkMode
                                ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden p-1 bg-white">
                                {pm.id === 'qris' ? (
                                  <img src={pm.logo} alt={pm.name} className="w-full h-full object-contain" />
                                ) : (
                                  // Custom aesthetic text icons representing wallet logos
                                  <span className={`text-[10px] font-black tracking-tight ${
                                    pm.id === 'dana' ? 'text-blue-600' :
                                    pm.id === 'ovo' ? 'text-purple-600' :
                                    pm.id === 'gopay' ? 'text-emerald-600' :
                                    pm.id === 'shopeepay' ? 'text-orange-500' : 'text-slate-800'
                                  }`}>
                                    {pm.name.split(' ')[0]}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <span className="font-bold text-xs sm:text-sm text-white select-none">{pm.name}</span>
                                <div className="text-[10px] text-slate-400">
                                  Fee: {pm.feePercent > 0 ? `${pm.feePercent}%` : ''} 
                                  {pm.feePercent > 0 && pm.feeFlat > 0 ? ' + ' : ''}
                                  {pm.feeFlat > 0 ? formatIDR(pm.feeFlat) : 'Gratis'}
                                </div>
                              </div>
                            </div>

                            {/* Dynamic Live Price for payment widget */}
                            <div className="text-right">
                              <span className="text-[10.5px] font-mono font-bold text-emerald-400 block">
                                {selectedNominal ? formatIDR(selectedNominal.price + pmFee) : '-'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: CONTACT INFO */}
          <div className={`p-6 sm:p-8 rounded-2xl border ${
            darkMode ? 'bg-[#0f172a] border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
          }`} id="step-id-contact">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4 border-dashed border-slate-800">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">4</span>
              <div>
                <h3 className="font-bold text-lg text-white">Masukkan Kontak Anda</h3>
                <p className="text-xs text-slate-400">Untuk pengiriman invoice digital dan notifikasi status otomatis.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  Nama Lengkap <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={buyerName}
                  onChange={(e) => {
                    setBuyerName(e.target.value);
                    validateField('buyerName', e.target.value);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${
                    errors.buyerName
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/10'
                      : darkMode
                      ? 'bg-slate-900/50 border-slate-800 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                  }`}
                />
                {errors.buyerName && <p className="text-[10px] text-red-500 mt-1">{errors.buyerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  Alamat Email <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="email"
                  placeholder="budi@domain.com"
                  value={buyerEmail}
                  onChange={(e) => {
                    setBuyerEmail(e.target.value);
                    validateField('buyerEmail', e.target.value);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${
                    errors.buyerEmail
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/10'
                      : darkMode
                      ? 'bg-slate-900/50 border-slate-800 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                  }`}
                />
                {errors.buyerEmail && <p className="text-[10px] text-red-500 mt-1">{errors.buyerEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  No. WhatsApp <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={buyerPhone}
                  onChange={(e) => {
                    setBuyerPhone(e.target.value);
                    validateField('buyerPhone', e.target.value);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${
                    errors.buyerPhone
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/10'
                      : darkMode
                      ? 'bg-slate-900/50 border-slate-800 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                  }`}
                />
                {errors.buyerPhone && <p className="text-[10px] text-red-500 mt-1">{errors.buyerPhone}</p>}
              </div>
            </div>
          </div>

        </div>

        {/* PERSISTENT ORDER SUMMARY & SIDEBAR BILLING PANEL (1 Column) */}
        <div className="space-y-6">
          <div className={`p-6 sm:p-7 rounded-2xl border sticky top-24 ${
            darkMode ? 'bg-[#0f172a] border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
          }`} id="order-summary-box">
            <h3 className="font-extrabold text-base text-white tracking-tight flex items-center space-x-2 border-b pb-4 border-slate-800">
              <ShoppingCart className="w-5 h-5 text-amber-500" />
              <span>Ringkasan Pesanan</span>
            </h3>

            {/* Dynamic Calculations Lists */}
            <div className="mt-5 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Game Terpilih</span>
                <span className="font-bold text-white text-right">{game.name}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">ID Akun</span>
                <span className="font-mono text-white text-right font-semibold select-all">
                  {userId ? `${userId} ${serverId ? `(${serverId})` : ''}` : '-'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Item Nominal</span>
                <span className="font-bold text-blue-400 text-right">
                  {selectedNominal ? selectedNominal.name : '-'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Harga Pokok</span>
                <span className="font-bold font-mono text-white text-right">
                  {selectedNominal ? formatIDR(selectedNominal.price) : 'Rp0'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Metode Bayar</span>
                <span className="font-bold text-cyan-400 text-right">
                  {selectedPayment ? selectedPayment.name : '-'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Biaya Admin (Fee)</span>
                <span className="font-mono text-amber-500 font-bold text-right">
                  {selectedPayment && selectedNominal ? formatIDR(adminFee) : 'Rp0'}
                </span>
              </div>

              {/* Final Calculations Highlight banner */}
              <div className="pt-4 border-t border-dashed border-slate-800">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-bold text-slate-300">Total Pembayaran</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 text-right select-all">
                    {selectedNominal ? formatIDR(totalAmount) : 'Rp0'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 text-right">Sudah termasuk PPN 11% & Admin</p>
              </div>
            </div>

            {/* Information tips box */}
            <div className={`mt-6 p-4 rounded-xl border flex items-start space-x-2 text-[11px] leading-relaxed ${
              darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>
                Isi data akun, pilih nominal, dan pilih metode pembayaran di langkah sebelah kiri untuk melihat rincian pembayaran instan.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* FULL WIDTH Checkout and Beli Sekarang at the very bottom */}
      <div className={`mt-10 p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
        darkMode 
          ? 'bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border-slate-800/80 shadow-2xl' 
          : 'bg-gradient-to-b from-white to-slate-50 border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="text-center md:text-left space-y-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest animate-pulse">
              ● Sistem Instant Auto-Gateway Aktif
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5 justify-center md:justify-start">
              <span className="text-xs sm:text-sm font-semibold text-slate-400">Total Nominal Pembayaran:</span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight select-all">
                {selectedNominal ? formatIDR(totalAmount) : 'Rp0'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sistem pembayaran <b>Gametopup Pro</b> terhubung otomatis dengan API instan. Tanpa approval manual admin - diamond dikirim otomatis dalam detik!
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center gap-1.5 shrink-0">
            <button
              type="submit"
              className="w-full md:px-14 py-4 rounded-xl font-black tracking-wider text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:ring-4 focus:ring-blue-500/20 active:scale-95 duration-200 shadow-lg shadow-blue-500/30 text-xs sm:text-sm uppercase flex items-center justify-center space-x-2.5 cursor-pointer animate-pulse"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Beli Sekarang (Proses Otomatis)</span>
            </button>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider italic">Gateway Auto-Callback Engine v5.04</p>
          </div>
        </div>
      </div>
    </form>
  );
}
