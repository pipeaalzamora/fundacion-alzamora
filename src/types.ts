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
