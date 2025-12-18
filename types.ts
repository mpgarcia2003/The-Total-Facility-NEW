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
  daysInMonth: number;
  hourlyRate: number;
  porterHourlyRate: number;
  porterUniformCost: number;
  porterMiscCost: number;
  porterProfit: number;
  
  // Percentages
  materialPct: number;
  miscPct: number;
  profitPct: number;
  summerStripPct: number;
  winterWashPct: number;
}

export interface ClientInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
  walkthroughDate: string;
}

export interface QuoteCalculations {
  totalDailyMinutes: number;
  totalDailyHours: number;
  monthlyCleaningHours: number;
  laborCost: number;
  materialCost: number;
  miscCost: number;
  profitCost: number;
  cleaningTotal: number;
  summerStripCost: number;
  winterWashCost: number;
  
  // Porter
  totalPorterDailyHours: number;
  monthlyPorterHours: number;
  porterLaborCost: number;
  porterTotal: number;
  
  // Grand Total
  grandTotal: number;
}

export interface LeadData {
  name: string;
  company: string;
  email: string;
  phone: string;
  bestTime: string;
  notes: string;
}