import { GameItem, PaymentMethod, PromoBanner, FAQItem } from './types';

export const DEFAULT_GAMES: GameItem[] = [
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=1200&auto=format&fit=crop&q=80',
    category: 'Mobile',
    trackerLabel: 'User ID',
    trackerPlaceholder: 'Masukkan User ID (Contoh: 12345678)',
    hasServer: true,
    serverIdLabel: 'Server ID',
    serverIdPlaceholder: 'Masukkan Server ID (Contoh: 1234)',
    nominals: [
      { id: 'ml-86', name: '86 Diamond', price: 21500, isActive: true },
      { id: 'ml-172', name: '172 Diamond', price: 42500, isActive: true },
      { id: 'ml-257', name: '257 Diamond', price: 63000, isActive: true },
      { id: 'ml-344', name: '344 Diamond', price: 83900, isActive: true },
      { id: 'ml-514', name: '514 Diamond', price: 125000, isActive: true },
      { id: 'ml-706', name: '706 Diamond', price: 167500, isActive: true },
      { id: 'ml-878', name: '878 Diamond', price: 209000, isActive: true },
      { id: 'ml-1412', name: '1412 Diamond', price: 335000, isActive: true },
    ]
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1200&auto=format&fit=crop&q=80',
    category: 'Mobile',
    trackerLabel: 'ID Player',
    trackerPlaceholder: 'Masukkan ID Player (Contoh: 87654321)',
    hasServer: false,
    nominals: [
      { id: 'ff-50', name: '50 Diamond', price: 8000, isActive: true },
      { id: 'ff-70', name: '70 Diamond', price: 11200, isActive: true },
      { id: 'ff-140', name: '140 Diamond', price: 22000, isActive: true },
      { id: 'ff-355', name: '355 Diamond', price: 54000, isActive: true },
      { id: 'ff-720', name: '720 Diamond', price: 108500, isActive: true },
      { id: 'ff-1440', name: '1440 Diamond', price: 214000, isActive: true },
      { id: 'ff-2000', name: '2000 Diamond', price: 295000, isActive: true },
      { id: 'ff-7290', name: '7290 Diamond', price: 1050000, isActive: true },
    ]
  },
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
    category: 'Mobile',
    trackerLabel: 'Karakter ID',
    trackerPlaceholder: 'Masukkan Karakter ID (Contoh: 512345678)',
    hasServer: false,
    nominals: [
      { id: 'pubg-60', name: '60 UC', price: 14500, isActive: true },
      { id: 'pubg-325', name: '325 UC', price: 72500, isActive: true },
      { id: 'pubg-660', name: '660 UC', price: 144000, isActive: true },
      { id: 'pubg-1800', name: '1800 UC', price: 360000, isActive: true },
      { id: 'pubg-3850', name: '3850 UC', price: 725000, isActive: true },
      { id: 'pubg-8100', name: '8100 UC', price: 1435000, isActive: true },
    ]
  },
  {
    id: 'honor-of-kings',
    name: 'Honor of Kings',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    category: 'Mobile',
    trackerLabel: 'Player ID',
    trackerPlaceholder: 'Masukkan Player ID (Contoh: 98127391)',
    hasServer: false,
    nominals: [
      { id: 'hok-80', name: '80 Tokens', price: 16500, isActive: true },
      { id: 'hok-240', name: '240 Tokens', price: 49000, isActive: true },
      { id: 'hok-400', name: '400 Tokens', price: 81000, isActive: true },
      { id: 'hok-800', name: '800 Tokens', price: 162000, isActive: true },
      { id: 'hok-1200', name: '1200 Tokens', price: 243000, isActive: true },
      { id: 'hok-2400', name: '2400 Tokens', price: 485000, isActive: true },
      { id: 'hok-4800', name: '4800 Tokens', price: 970000, isActive: true },
      { id: 'hok-8000', name: '8000 Tokens', price: 1599000, isActive: true },
    ]
  },
  {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    category: 'PC / Mobile',
    trackerLabel: 'UID',
    trackerPlaceholder: 'Masukkan UID genshin (Contoh: 123456789)',
    hasServer: true,
    serverIdLabel: 'Server',
    serverIdPlaceholder: 'Pilih Server Utama',
    nominals: [
      { id: 'gi-60', name: '60 Genesis Crystal', price: 16000, isActive: true },
      { id: 'gi-300', name: '300 Genesis Crystal', price: 79000, isActive: true },
      { id: 'gi-980', name: '980 Genesis Crystal', price: 245000, isActive: true },
      { id: 'gi-1980', name: '1980 Genesis Crystal', price: 479000, isActive: true },
      { id: 'gi-3280', name: '3280 Genesis Crystal', price: 799000, isActive: true },
      { id: 'gi-6480', name: '6480 Genesis Crystal', price: 1599000, isActive: true },
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&auto=format&fit=crop&q=80',
    category: 'PC',
    trackerLabel: 'Riot ID',
    trackerPlaceholder: 'Masukkan Riot ID + Tagline (Contoh: Username#ID1)',
    hasServer: false,
    nominals: [
      { id: 'val-475', name: '475 VP (Valorant Points)', price: 62000, isActive: true },
      { id: 'val-1000', name: '1000 VP (Valorant Points)', price: 125000, isActive: true },
      { id: 'val-2050', name: '2050 VP (Valorant Points)', price: 247000, isActive: true },
      { id: 'val-3650', name: '3650 VP (Valorant Points)', price: 435000, isActive: true },
      { id: 'val-5350', name: '5350 VP (Valorant Points)', price: 620000, isActive: true },
      { id: 'val-11000', name: '11000 VP (Valorant Points)', price: 1235000, isActive: true },
    ]
  },
  {
    id: 'call-of-duty-mobile',
    name: 'Call of Duty Mobile',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    category: 'Mobile',
    trackerLabel: 'UID Player',
    trackerPlaceholder: 'Masukkan UID CODM (Contoh: 1293849182394)',
    hasServer: false,
    nominals: [
      { id: 'cod-31', name: '31 CP', price: 7000, isActive: true },
      { id: 'cod-63', name: '63 CP', price: 13500, isActive: true },
      { id: 'cod-127', name: '127 CP', price: 27000, isActive: true },
      { id: 'cod-317', name: '317 CP', price: 67000, isActive: true },
      { id: 'cod-634', name: '634 CP', price: 133000, isActive: true },
      { id: 'cod-1373', name: '1373 CP', price: 285000, isActive: true },
      { id: 'cod-3177', name: '3177 CP', price: 660000, isActive: true },
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    image: 'https://images.unsplash.com/photo-1587573011392-8e6199ad4a17?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=1200&auto=format&fit=crop&q=80',
    category: 'PC / Mobile',
    trackerLabel: 'Roblox Username',
    trackerPlaceholder: 'Masukkan Username Roblox Anda',
    hasServer: false,
    nominals: [
      { id: 'rblx-80', name: '80 Robux', price: 18000, isActive: true },
      { id: 'rblx-400', name: '400 Robux', price: 89000, isActive: true },
      { id: 'rblx-800', name: '800 Robux', price: 175000, isActive: true },
      { id: 'rblx-1700', name: '1700 Robux', price: 349000, isActive: true },
      { id: 'rblx-4500', name: '4500 Robux', price: 899000, isActive: true },
      { id: 'rblx-10000', name: '10000 Robux', price: 1850000, isActive: true },
    ]
  }
];

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'qris',
    name: 'QRIS (Gopay/Dana/LinkAja)',
    category: 'QRIS',
    logo: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GameTopUpProPayments',
    feePercent: 0.7,
    feeFlat: 0
  },
  {
    id: 'dana',
    name: 'DANA',
    category: 'E-Wallet',
    logo: 'https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?w=100&q=80', // We can style these labels beautifully with appropriate theme colors!
    feePercent: 0,
    feeFlat: 1000
  },
  {
    id: 'ovo',
    name: 'OVO',
    category: 'E-Wallet',
    logo: 'https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?w=100&q=80',
    feePercent: 0,
    feeFlat: 1000
  },
  {
    id: 'gopay',
    name: 'GoPay',
    category: 'E-Wallet',
    logo: 'https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?w=100&q=80',
    feePercent: 0,
    feeFlat: 1000
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    category: 'E-Wallet',
    logo: 'https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?w=100&q=80',
    feePercent: 0,
    feeFlat: 1000
  },
  {
    id: 'bca',
    name: 'Bank BCA',
    category: 'Transfer Bank',
    logo: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=100&q=80',
    feePercent: 0,
    feeFlat: 2500,
    accountNumber: '8310928374',
    accountName: 'PT GAME TOPUP PRO'
  },
  {
    id: 'bri',
    name: 'Bank BRI',
    category: 'Transfer Bank',
    logo: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=100&q=80',
    feePercent: 0,
    feeFlat: 2500,
    accountNumber: '0283-01-002934-50-6',
    accountName: 'PT GAME TOPUP PRO'
  },
  {
    id: 'mandiri',
    name: 'Bank Mandiri',
    category: 'Transfer Bank',
    logo: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=100&q=80',
    feePercent: 0,
    feeFlat: 2500,
    accountNumber: '1270018274836',
    accountName: 'PT GAME TOPUP PRO'
  }
];

export const DEFAULT_PROMOS: PromoBanner[] = [
  {
    id: 'promo-1',
    title: 'Diskon Akhir Pekan 15%',
    subtitle: 'Top up game Mobile Legends & Genshin Impact pakai QRIS dapatkan promo potongan langsung!',
    image: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=1200&auto=format&fit=crop&q=80',
    badge: 'FLASH SALE'
  },
  {
    id: 'promo-2',
    title: 'VALORANT Champions Bundles',
    subtitle: 'Klaim poin eksklusif dan top up VP Anda instan 1 detik langsung masuk akun!',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    badge: 'EVENT BARU'
  },
  {
    id: 'promo-3',
    title: 'Cashback 5.000 via E-Wallet',
    subtitle: 'Minimal transaksi Rp50.000 menggunakan DANA atau GoPay. Tanpa syarat rumit.',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&auto=format&fit=crop&q=80',
    badge: 'HEMAT'
  }
];

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara melakukan top up game di GameTopUp Pro?',
    answer: 'Silakan klik game yang Anda inginkan, masukkan User ID & Server (jika ada), pilih nominal diamond/voucher yang dikehendaki, pilih metode pembayaran, masukkan informasi pembeli lalu klik tombol "Beli Sekarang". Ikuti langkah pembayaran hingga selesai.'
  },
  {
    id: 'faq-2',
    question: 'Berapa lama proses masuknya saldo koin/diamond?',
    answer: 'Proses top up kami menggunakan sistem otomatisasi premium instan. Dalam kondisi normal, diamond/voucher akan masuk ke akun game Anda dalam waktu 1 hingga 5 detik setelah pembayaran terverifikasi.'
  },
  {
    id: 'faq-3',
    question: 'Metode pembayaran apa saja yang didukung?',
    answer: 'Kami menyediakan pilihan metode pembayaran yang sangat lengkap meliputi QRIS (Scan dari Gopay, Dana, OVO, LinkAja, Sakuku, M-Banking), E-Wallet langsung (DANA, OVO, GoPay, ShopeePay), serta Transfer Bank secara virtual account/rekening resmi (BCA, BRI, Mandiri).'
  },
  {
    id: 'faq-4',
    question: 'Apakah melakukan top up di GameTopUp Pro aman dan legal?',
    answer: '100% aman dan legal! Kami bekerja sama langsung melalui partner distribusi resmi penerbit game. Akun game Anda dijamin aman dari risiko banned karena seluruh transaksi kami tercatat resmi.'
  },
  {
    id: 'faq-5',
    question: 'Bagaimana jika saya salah menuliskan User ID saya?',
    answer: 'Karena proses transaksi top up berjalan otomatis secara cepat, kesalahan penulisan User ID merupakan tanggung jawab penuh pembeli. Harap selalu re-check nominal, ID akun, dan status server game Anda sebelum mengklik konfirmasi final.'
  }
];
