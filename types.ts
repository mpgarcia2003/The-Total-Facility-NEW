
export type IndustryType = 'education' | 'office' | 'medical' | 'retail' | 'warehouse' | 'hoa' | 'hotel' | 'government' | 'church' | 'fitness' | 'daycare';
export type ServiceType = 'recurring' | 'onetime';

export interface RoomType {
  id: string;
  name: string;
  quantity: number;
  minutesPerRoom: number;
}

export interface PorterService {
  id: string;
  name: string;
  quantity: number;
  hoursPerDay: number;
}

export interface PricingSettings {
  industry: IndustryType;
  serviceType: ServiceType;
  squareFootage: number;
  frequencyPerWeek: number;
  hotelRooms: number;
  churchCapacity: number;
  seatingType: 'pews' | 'chairs';
  buildingSize: 'small' | 'medium' | 'large' | 'luxury';
  retailSize: 'small' | 'medium' | 'large';
  laborHoursPerDay: number;
  warehouseScrubbingSqFt: number;
  showerCount: number; 
  hasSauna: boolean; 
  studentCount: number;
  changingStations: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  image: string;
  isCited?: boolean;
}

export interface InternalBreakdown {
  laborCost: number;
  suppliesCost: number;
  overheadCost: number;
  netProfit: number;
  profitMargin: number;
  totalMonthlyHours: number;
}

export interface QuoteCalculations {
  grandTotal: number;
  method: string;
  justification: string;
  internal?: InternalBreakdown;
  breakdown: {
    label: string;
    value: number;
  }[];
}

export interface LeadData {
  name: string;
  company: string;
  email: string;
  phone: string;
  industry?: IndustryType;
  serviceType?: ServiceType;
  quoteTotal?: number;
  bestTime?: string;
  notes?: string;
}
