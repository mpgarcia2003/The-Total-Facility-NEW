import { PricingSettings, RoomType, PorterService } from './types';

// ==========================================
// CONFIGURATION: Adjust Default Rates Here
// ==========================================
export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  daysInMonth: 22,
  hourlyRate: 17.50,
  porterHourlyRate: 20.00,
  
  // Updated Markup Logic (30%)
  profitPct: 0.30, 

  // Estimate: Annual specialty work (floors/carpets) equals ~60% of one month's base cleaning labor
  // This value is amortized over 12 months.
  specialtyAnnualLaborFactor: 0.60 
};

export const PRESET_ROOMS: Omit<RoomType, 'id' | 'quantity'>[] = [
  { name: 'Classroom', minutesPerRoom: 15 },
  { name: 'Laboratory (Science/Computer)', minutesPerRoom: 17 },
  { name: 'Library', minutesPerRoom: 60 },
  { name: 'Cafeteria', minutesPerRoom: 60 },
  { name: 'Gymnasium', minutesPerRoom: 60 },
  { name: 'Auditorium', minutesPerRoom: 60 },
  { name: 'Office (Admin/Principal)', minutesPerRoom: 5 },
  { name: 'Staff Room', minutesPerRoom: 15 },
  { name: 'Music Room', minutesPerRoom: 15 },
  { name: 'Art Room', minutesPerRoom: 17 },
  { name: 'Storage Room', minutesPerRoom: 5 },
  { name: 'Restroom', minutesPerRoom: 15 },
  { name: 'Locker Room', minutesPerRoom: 20 },
  { name: 'Hallway', minutesPerRoom: 20 },
  { name: 'Staircase', minutesPerRoom: 15 },
  { name: 'Entryway/Lobby', minutesPerRoom: 15 },
  { name: 'Nurse\'s Office', minutesPerRoom: 7 },
  { name: 'Special Education Room', minutesPerRoom: 15 },
  { name: 'Multipurpose Room', minutesPerRoom: 15 },
  { name: 'Athletic Field', minutesPerRoom: 60 },
  { name: 'Playground', minutesPerRoom: 60 },
  { name: 'Parking Lot', minutesPerRoom: 60 },
  { name: 'Outdoor Common Areas', minutesPerRoom: 60 },
  { name: 'Conference Room', minutesPerRoom: 15 },
  { name: 'Teacher\'s Lounge', minutesPerRoom: 15 },
  { name: 'Counseling Office', minutesPerRoom: 7 },
  { name: 'Janitorial Closet', minutesPerRoom: 5 },
  { name: 'Mechanical Room', minutesPerRoom: 5 },
  { name: 'IT Room', minutesPerRoom: 10 },
];

export const DEFAULT_ROOMS: RoomType[] = [
  { id: '1', name: 'Classroom', quantity: 35, minutesPerRoom: 15 },
  { id: '2', name: 'Cafeteria', quantity: 2, minutesPerRoom: 60 },
  { id: '3', name: 'Office (Admin/Principal)', quantity: 5, minutesPerRoom: 5 },
  { id: '4', name: 'Restroom', quantity: 20, minutesPerRoom: 15 },
  { id: '5', name: 'Staircase', quantity: 6, minutesPerRoom: 15 },
  { id: '6', name: 'Gymnasium', quantity: 1, minutesPerRoom: 60 },
];

export const DEFAULT_PORTERS: PorterService[] = [
  { id: 'p1', name: 'Day Porter', quantity: 0, hoursPerDay: 8 },
];

export const ANIMATION_DELAY = 100;