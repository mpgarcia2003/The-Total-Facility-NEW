import { IndustryType } from './types';

export const INDUSTRY_CONFIG = {
  education: {
    label: 'Education',
    description: 'K-12, Charter & Universities',
    baseRate: 18.50, // Hourly
  },
  office: {
    label: 'Commercial Office',
    description: 'Class A/B & Mixed-Use',
    ratePerSqFt: 0.15, // $0.13 - $0.18 range
  },
  medical: {
    label: 'Medical/Clinical',
    description: 'Clinics & Specialized Med',
    ratePerSqFt: 0.26, // $0.22 - $0.30 range
  },
  retail: {
    label: 'Retail/Strip Mall',
    description: 'Retail & Shopping Centers',
    smallVisit: 90,
    mediumVisit: 135,
    largeVisit: 190,
  },
  warehouse: {
    label: 'Industrial/Warehouse',
    description: 'Logistics & Storage',
    ratePerSqFt: 0.10, 
  },
  hoa: {
    label: 'HOA/Apartment',
    description: 'Common Area Maintenance',
    small: 1100,
    medium: 2600,
    large: 5500,
  },
  hotel: {
    label: 'Hospitality/Hotel',
    description: 'Back-of-House & Public',
    perRoom: 15,
    publicSqFt: 0.17,
  },
  government: {
    label: 'Government',
    description: 'Municipal & Public Bldgs',
    hourlyRate: 52,
  }
};

// Constant for UI animation staggered delays
export const ANIMATION_DELAY = 100;

// Presets for room types by industry used in the calculator
export const PRESET_ROOMS: Record<string, { name: string; minutesPerRoom: number }[]> = {
  education: [
    { name: 'Classroom', minutesPerRoom: 15 },
    { name: 'Restroom', minutesPerRoom: 20 },
    { name: 'Office', minutesPerRoom: 10 },
    { name: 'Hallway', minutesPerRoom: 15 },
    { name: 'Cafeteria', minutesPerRoom: 45 },
    { name: 'Auditorium', minutesPerRoom: 45 },
    { name: 'Gymnasium', minutesPerRoom: 60 },
  ],
  office: [
    { name: 'Private Office', minutesPerRoom: 10 },
    { name: 'Conference Room', minutesPerRoom: 20 },
    { name: 'Open Workspace', minutesPerRoom: 30 },
    { name: 'Kitchen/Breakroom', minutesPerRoom: 25 },
    { name: 'Restroom', minutesPerRoom: 20 },
  ],
  medical: [
    { name: 'Exam Room', minutesPerRoom: 20 },
    { name: 'Waiting Area', minutesPerRoom: 25 },
    { name: 'Lab', minutesPerRoom: 30 },
    { name: 'Restroom', minutesPerRoom: 20 },
  ],
  retail: [
    { name: 'Sales Floor', minutesPerRoom: 40 },
    { name: 'Stock Room', minutesPerRoom: 20 },
    { name: 'Restroom', minutesPerRoom: 15 },
  ],
  warehouse: [
    { name: 'Dock Area', minutesPerRoom: 30 },
    { name: 'Office', minutesPerRoom: 10 },
    { name: 'Restroom', minutesPerRoom: 15 },
  ],
  hoa: [
    { name: 'Lobby', minutesPerRoom: 30 },
    { name: 'Corridor', minutesPerRoom: 20 },
    { name: 'Gym', minutesPerRoom: 45 },
    { name: 'Clubhouse', minutesPerRoom: 60 },
  ],
  hotel: [
    { name: 'Guest Room', minutesPerRoom: 30 },
    { name: 'Lobby', minutesPerRoom: 40 },
    { name: 'Public Restroom', minutesPerRoom: 20 },
  ],
  government: [
    { name: 'Public Office', minutesPerRoom: 15 },
    { name: 'Waiting Room', minutesPerRoom: 20 },
    { name: 'Restroom', minutesPerRoom: 20 },
  ],
};