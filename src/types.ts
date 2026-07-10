export type Region = 'general' | 'chile';

export interface VolunteerSignup {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  areasInterest: string[];
  message: string;
  region: Region;
  timestamp: string;
}

export type NeedType = 'comida' | 'abrigo' | 'salud' | 'apoyo' | 'otro';

export interface NeedReport {
  id: string;
  location: string;
  cityCommune: string;
  needType: NeedType;
  description: string;
  contactName?: string;
  contactPhone?: string;
  region: Region;
  status: 'pendiente' | 'atendido' | 'en_ruta';
  timestamp: string;
}

export interface Donation {
  id: string;
  amount: number;
  currency: 'CLP' | 'EUR' | 'USD';
  donorName: string;
  email: string;
  region: Region;
  impactText: string;
  isMonthly: boolean;
  timestamp: string;
}

export interface Route {
  id: string;
  name: string;
  city: string;
  schedule: string;
  volunteersCount: number;
  mealsDelivered: number;
  description: string;
  status: 'activo' | 'completado';
  latitudePercent: number; // For plotting on stylized map
  longitudePercent: number; // For plotting on stylized map
}

export interface Story {
  id: string;
  title: string;
  name: string;
  age?: number;
  region: Region;
  location: string;
  quote: string;
  summary: string;
  fullStory: string;
  imageUrl: string;
  date: string;
}

// ----- Tipos del contrato de la API real (backend Express) -----

export type PaymentMethod = 'webpay' | 'paypal';
export type PaymentCurrency = 'CLP' | 'USD';

export interface CreateDonationInput {
  amount: number;
  currency: PaymentCurrency;
  donorName: string;
  email: string;
  method: PaymentMethod;
  isMonthly?: boolean;
  impactText?: string;
}

export interface CreateDonationResponse {
  donationId: string;
  redirectUrl: string;
}

export interface DonationStatus {
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: PaymentCurrency;
}

export interface TransparencyStats {
  mealsCount: number;
  kitsCount: number;
  biblesCount: number;
  clothingCount: number;
  volunteersCount: number;
  totalDonations: number;
  totalRaisedCLP: number;
  totalExpensesCLP: number;
  balanceCLP: number;
  updatedAt: string;
}

export interface PublicDonation {
  donorName: string;
  amount: number;
  currency: PaymentCurrency;
  isMonthly: boolean;
  impactText: string;
  timestamp: string;
}

export interface LedgerMovement {
  [key: string]: unknown;
}

export interface Ledger {
  totalRaisedCLP: number;
  totalExpensesCLP: number;
  balanceCLP: number;
  expensesByCategory: Record<string, number>;
  movements: LedgerMovement[];
}

export interface CreateVolunteerInput {
  fullName: string;
  phone: string;
  email: string;
  commune: string;
  areasInterest: string[];
  message: string;
}

export interface CreateNeedReportInput {
  location: string;
  cityCommune: string;
  needType: NeedType;
  description: string;
  contactName?: string;
  contactPhone?: string;
}

export interface CreatedIdResponse {
  id: string;
}

// ----- Suscripciones mensuales (aporte de socio recurrente) -----

export interface CreateSubscriptionInput {
  amount: number;
  currency: PaymentCurrency;
  donorName: string;
  email: string;
  method: PaymentMethod;
  impactText?: string;
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  redirectUrl: string;
}

export interface SubscriptionStatus {
  id: string;
  status: 'pending' | 'active' | 'cancelled' | 'failed';
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethod;
}

// ----- Panel de administración -----

export type DeliveryType = 'comida' | 'kit' | 'biblia' | 'ropa';

export interface CreateDeliveryInput {
  type: DeliveryType;
  quantity: number;
  commune: string;
  routeName?: string;
  notes?: string;
  deliveredAt?: string;
}

export interface Delivery {
  id: string;
  type: DeliveryType;
  quantity: number;
  commune: string;
  routeName?: string;
  notes?: string;
  deliveredAt?: string;
  createdAt?: string;
}

export type ExpenseCategory =
  | 'alimentos'
  | 'kits'
  | 'biblias'
  | 'ropa'
  | 'transporte'
  | 'operacional'
  | 'otro';

export interface CreateExpenseInput {
  category: ExpenseCategory;
  amount: number;
  description: string;
  commune?: string;
  spentAt?: string;
  receiptUrl?: string;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  commune?: string;
  spentAt?: string;
  receiptUrl?: string;
  createdAt?: string;
}

export interface Subscription {
  id: string;
  amount: number;
  currency: PaymentCurrency;
  donorName: string;
  email: string;
  method: PaymentMethod;
  status: 'pending' | 'active' | 'cancelled' | 'failed';
  chargesCount: number;
  nextChargeAt?: string;
  createdAt: string;
}
