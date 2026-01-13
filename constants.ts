
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
    ratePerSqFt: 0.15,
  },
  medical: {
    label: 'Medical/Clinical',
    description: 'Clinics & Specialized Med',
    ratePerSqFt: 0.26,
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
  },
  church: {
    label: 'Religious/Church',
    description: 'Places of Worship',
    perSeatRate: 1.25,
    pewSurcharge: 1.30, 
  },
  fitness: {
    label: 'Fitness & Wellness',
    description: 'Gyms, Studios & Clubs',
    baseRatePerSqFt: 0.22,
    showerSurcharge: 45.00, 
    saunaSurcharge: 150.00, 
  },
  daycare: {
    label: 'Daycare/Preschool',
    description: 'Childcare Facilities',
    perStudentRate: 18.50,
    changingStationRate: 35.00,
  }
};

export const ANIMATION_DELAY = 100;

export const PRESET_ROOMS: Record<string, { name: string; minutesPerRoom: number }[]> = {
  education: [
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
    { name: 'IT Room', minutesPerRoom: 10 }
  ],
  office: [
    { name: 'Private Office', minutesPerRoom: 10 },
    { name: 'Conference Room', minutesPerRoom: 20 },
    { name: 'Open Workspace', minutesPerRoom: 30 },
  ],
  medical: [
    { name: 'Exam Room', minutesPerRoom: 20 },
    { name: 'Waiting Area', minutesPerRoom: 25 },
    { name: 'Lab', minutesPerRoom: 30 },
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
  fitness: [
    { name: 'Main Weight Floor', minutesPerRoom: 45 },
    { name: 'Cardio Deck', minutesPerRoom: 40 },
    { name: 'Locker Room (Men)', minutesPerRoom: 60 },
    { name: 'Locker Room (Women)', minutesPerRoom: 60 },
    { name: 'Yoga/Group Studio', minutesPerRoom: 25 },
    { name: 'Pool Deck', minutesPerRoom: 30 },
  ],
  daycare: [
    { name: 'Infant Room', minutesPerRoom: 40 },
    { name: 'Toddler Room', minutesPerRoom: 35 },
    { name: 'Indoor Play Area', minutesPerRoom: 45 },
    { name: 'Staff Lounge', minutesPerRoom: 15 },
    { name: 'Restroom', minutesPerRoom: 20 },
  ],
  hoa: [
    { name: 'Lobby', minutesPerRoom: 30 },
    { name: 'Corridor', minutesPerRoom: 20 },
    { name: 'Gym', minutesPerRoom: 45 },
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
  church: [
    { name: 'Main Sanctuary', minutesPerRoom: 60 },
    { name: 'Fellowship Hall', minutesPerRoom: 45 },
    { name: 'Nursery/Childcare', minutesPerRoom: 30 },
    { name: 'Classroom', minutesPerRoom: 15 },
    { name: 'Restroom', minutesPerRoom: 20 },
    { name: 'Vestibule/Lobby', minutesPerRoom: 25 },
  ],
};
