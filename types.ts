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
  
  // Percentages
  profitPct: number;
  // Specialty Maintenance (Floor/Carpet) as a % of monthly cleaning labor, spread over 12 months
  specialtyAnnualLaborFactor: number; 
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
  
  // Base Costs (Pre-Markup)
  baseCleaningLabor: number;
  basePorterLabor: number;
  
  // Specialty (Amortized Pre-Markup)
  amortizedSpecialtyLabor: number;

  // Final Markup-ed Totals
  cleaningTotal: number;
  porterTotal: number;
  specialtyTotal: number;
  
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