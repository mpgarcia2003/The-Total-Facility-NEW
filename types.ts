
export type IndustryType = 'education' | 'office' | 'medical' | 'retail' | 'warehouse' | 'hoa' | 'hotel' | 'government';
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
  buildingSize: 'small' | 'medium' | 'large' | 'luxury';
  retailSize: 'small' | 'medium' | 'large';
  laborHoursPerDay: number;
  warehouseScrubbingSqFt: number;
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

export interface QuoteCalculations {
  grandTotal: number;
  method: string;
  justification: string;
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
