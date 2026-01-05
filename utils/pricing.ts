
import { PricingSettings, QuoteCalculations, RoomType, PorterService } from '../types';

export const calculateQuote = (
  settings: PricingSettings,
  rooms: RoomType[],
  porters: PorterService[] = []
): QuoteCalculations => {
  const { 
    industry, 
    squareFootage, 
    frequencyPerWeek, 
    buildingSize, 
    hotelRooms, 
    churchCapacity,
    seatingType,
    retailSize,
    laborHoursPerDay,
    showerCount,
    hasSauna,
    studentCount,
    changingStations
  } = settings;
  
  let grandTotal = 0;
  let method = "";
  let justification = "";
  const breakdown: { label: string; value: number }[] = [];

  const DAYS_PER_MONTH = 21.67; 
  const HOURLY_RATE = 25.50; // Standard labor rate for TFS

  // Helper to calculate room-based labor
  const calculateRoomLabor = (rmList: RoomType[]) => {
    const dailyMins = rmList.reduce((acc, r) => acc + (r.quantity * r.minutesPerRoom), 0);
    return (dailyMins / 60) * DAYS_PER_MONTH * HOURLY_RATE;
  };

  switch (industry) {
    case 'church':
      const churchRoomLabor = calculateRoomLabor(rooms);
      const capacityRate = seatingType === 'pews' ? 1.65 : 1.25; 
      const sanctuaryLabor = (churchCapacity || 250) * capacityRate * 4.33; 
      grandTotal = churchRoomLabor + sanctuaryLabor;
      method = "Capacity-Driven Maintenance Model";
      justification = `Calculated based on a ${churchCapacity}-seat sanctuary with ${seatingType} seating, accounting for high-traffic post-service turnover cycles.`;
      breakdown.push(
        { label: "Sanctuary Intensive Care", value: sanctuaryLabor },
        { label: "Administrative & Annex Areas", value: churchRoomLabor }
      );
      break;

    case 'fitness':
      const fitnessBase = squareFootage * 0.22;
      const showerLabor = (showerCount || 0) * 45; // Surcharge per shower head
      const saunaLabor = hasSauna ? 150 : 0;
      grandTotal = fitnessBase + showerLabor + saunaLabor;
      method = "High-Intensity Wellness Hygiene";
      justification = `Optimized for high-frequency gym equipment sanitization and specialized 'Wet Area' maintenance for ${showerCount} shower units.`;
      breakdown.push(
        { label: "Floor & Equipment Hygiene", value: fitnessBase },
        { label: "Wet Area Sanitation", value: showerLabor + saunaLabor }
      );
      break;

    case 'daycare':
      const daycareBase = calculateRoomLabor(rooms);
      const disinfectionSurcharge = (studentCount || 20) * 18.50; // Enrollment-based touchpoint frequency
      const stationLabor = (changingStations || 0) * 35;
      grandTotal = daycareBase + disinfectionSurcharge + stationLabor;
      method = "Child-Safe Managed Enrollment Model";
      justification = `Managed protocol for ${studentCount} students focusing on daily disinfection of ${changingStations} changing stations using child-safe EPA N-List chemicals.`;
      breakdown.push(
        { label: "Core Facility Labor", value: daycareBase },
        { label: "Disinfection Frequency Surcharge", value: disinfectionSurcharge + stationLabor }
      );
      break;

    case 'medical':
      grandTotal = squareFootage * 0.26;
      method = "Sterile-Grade Terminal Cleaning";
      justification = "Pricing based on clinical-level pathogens logs and high-intensity disinfection for medical suites.";
      breakdown.push({ label: "Terminal Sanitation Labor", value: grandTotal });
      break;

    case 'education':
      const coreEduLabor = calculateRoomLabor(rooms);
      const porterHrs = porters.reduce((acc, p) => acc + (p.quantity * p.hoursPerDay), 0) * DAYS_PER_MONTH;
      const porterCost = porterHrs * 24.50; 
      grandTotal = coreEduLabor + porterCost;
      method = "Integrated Campus Labor Model";
      justification = "A hybrid model combining nightly academic sanitation with on-site Day Porter logistics for restroom rotations.";
      breakdown.push(
        { label: "Academic Area Maintenance", value: coreEduLabor },
        { label: "Day Porter Logistics", value: porterCost }
      );
      break;

    case 'office':
      grandTotal = squareFootage * 0.15;
      method = "Class-A Portfolio Maintenance";
      justification = "Managed precision focused on high-visibility lobby care and common area tenant retention.";
      breakdown.push({ label: "Portfolio-Wide Logistics", value: grandTotal });
      break;

    case 'warehouse':
      const laborCost = (laborHoursPerDay * DAYS_PER_MONTH) * 48; 
      const scrubbingCost = settings.warehouseScrubbingSqFt * 0.10;
      grandTotal = laborCost + scrubbingCost;
      method = "Industrial Performance Model";
      justification = "Calculated for high-bay logistics with ride-on scrubber allocation for heavy floor maintenance.";
      breakdown.push(
        { label: "Managed Man-Hours", value: laborCost },
        { label: "Machine Scrubbing Service", value: scrubbingCost }
      );
      break;

    case 'hotel':
      const guestSuppCost = hotelRooms * 15; 
      const commonAreaCost = squareFootage * 0.17; 
      grandTotal = guestSuppCost + commonAreaCost;
      method = "Hospitality Support Framework";
      justification = "Integrated BOH operational support with premium FOH public area visibility maintenance.";
      breakdown.push(
        { label: "BOH Operational Support", value: guestSuppCost },
        { label: "FOH Public Visibility", value: commonAreaCost }
      );
      break;

    case 'hoa':
      if (buildingSize === 'small') grandTotal = 1100;
      else if (buildingSize === 'medium') grandTotal = 2600;
      else if (buildingSize === 'large') grandTotal = 3200;
      else grandTotal = 5500;
      method = "Common-Area Amenity Pricing";
      justification = "Predictable management for multi-family complexes based on amenity and corridor density.";
      breakdown.push({ label: "Amenity Maintenance", value: grandTotal });
      break;

    default:
      grandTotal = squareFootage * 0.18;
  }

  // One-time service reduction logic
  if (settings.serviceType === 'onetime') {
    grandTotal = grandTotal * 0.7; // Project based estimate is usually ~70% of a monthly full cycle
    method = "Project-Based Scope Estimate";
  }

  return { grandTotal, method, justification, breakdown };
};
