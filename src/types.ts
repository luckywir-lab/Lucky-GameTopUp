export interface NominalItem {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface GameItem {
  id: string;
  name: string;
  image: string;
  banner: string;
  category: string;
  trackerLabel: string;
  trackerPlaceholder: string;
  hasServer: boolean;
  serverIdLabel?: string;
  serverIdPlaceholder?: string;
  nominals: NominalItem[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  category: 'QRIS' | 'E-Wallet' | 'Transfer Bank';
  logo: string;
  feePercent: number;
  feeFlat: number;
  accountNumber?: string;
  accountName?: string;
}

export interface Transaction {
  invoice: string;
  date: string;
  userId: string;
  serverId?: string;
  gameId: string;
  gameName: string;
  nominalId: string;
  nominalName: string;
  price: number;
  paymentMethod: string;
  paymentMethodCategory: string;
  adminFee: number;
  totalPay: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  status: 'Menunggu Pembayaran' | 'Selesai' | 'Batal';
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
