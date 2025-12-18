import { PricingSettings, RoomType, PorterService } from './types';

// ==========================================
// CONFIGURATION: Adjust Default Rates Here
// ==========================================
export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  daysInMonth: 22,
  hourlyRate: 17.50,       // Updated to your specific cleaning rate
  porterHourlyRate: 20.00, // Updated to your specific porter rate
  porterUniformCost: 0,
  porterMiscCost: 0,
  porterProfit: 0,
  
  // Simplified Markup Logic
  materialPct: 0,          // Removed separate material cost
  miscPct: 0,              // Removed separate misc cost
  profitPct: 0.25,         // 25% extra for margin and profit
  summerStripPct: 0.25,    // Match margin logic
  winterWashPct: 0.20
};

// Comprehensive list from your image
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

export const ANIMATION_DELAY = 100; // ms between items