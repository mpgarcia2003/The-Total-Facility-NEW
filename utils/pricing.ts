
import { PricingSettings, QuoteCalculations, RoomType, PorterService, InternalBreakdown } from '../types';

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
  
  // OWNER FINANCIAL CONSTANTS
  const INTERNAL_LABOR_COST = 17.50; // Your actual hourly cost
  const MARGIN_SUPPLIES = 0.03;      // 3% Materials
  const MARGIN_OVERHEAD = 0.05;      // 5% Overhead/Insurance
  const MARGIN_PROFIT = 0.20;        // 20% Target Profit
  
  // The Total Non-Labor Load is 28%. Therefore Labor represents 72% (1 - 0.28) of the quote.
  // We divide the labor cost by 0.72 to find the client's hourly rate that preserves your 20% profit.
  const HOURLY_RATE = parseFloat((INTERNAL_LABOR_COST / 0.72).toFixed(2)); // ~$24.31

  // Helper to calculate room-based labor
  const calculateRoomLabor = (rmList: RoomType[]) => {
    const dailyMins = rmList.reduce((acc, r) => acc + (r.quantity * r.minutesPerRoom), 0);
    const monthlyHours = (dailyMins / 60) * DAYS_PER_MONTH;
    return {
      cost: monthlyHours * HOURLY_RATE,
      hours: monthlyHours
    };
  };

  let totalMonthlyHours = 0;

  switch (industry) {
    case 'church':
      const churchData = calculateRoomLabor(rooms);
      const capacityRate = seatingType === 'pews' ? 1.65 : 1.25; 
      const sanctuaryLabor = (churchCapacity || 250) * capacityRate * 4.33; 
      grandTotal = churchData.cost + sanctuaryLabor;
      totalMonthlyHours = churchData.hours + (sanctuaryLabor / HOURLY_RATE);
      method = "Capacity-Driven Maintenance Model";
      justification = `Calculated based on a ${churchCapacity}-seat sanctuary with ${seatingType} seating, accounting for high-traffic post-service turnover cycles.`;
      breakdown.push(
        { label: "Sanctuary Intensive Care", value: sanctuaryLabor },
        { label: "Administrative & Annex Areas", value: churchData.cost }
      );
      break;

    case 'fitness':
      const fitnessBase = squareFootage * 0.22;
      const showerLabor = (showerCount || 0) * 45;
      const saunaLabor = hasSauna ? 150 : 0;
      grandTotal = fitnessBase + showerLabor + saunaLabor;
      totalMonthlyHours = grandTotal / HOURLY_RATE;
      method = "High-Intensity Wellness Hygiene";
      justification = `Optimized for high-frequency gym equipment sanitization and specialized 'Wet Area' maintenance for ${showerCount} shower units.`;
      breakdown.push(
        { label: "Floor & Equipment Hygiene", value: fitnessBase },
        { label: "Wet Area Sanitation", value: showerLabor + saunaLabor }
      );
      break;

    case 'daycare':
      const daycareData = calculateRoomLabor(rooms);
      const disinfectionSurcharge = (studentCount || 20) * 18.50; 
      const stationLabor = (changingStations || 0) * 35;
      grandTotal = daycareData.cost + disinfectionSurcharge + stationLabor;
      totalMonthlyHours = daycareData.hours + ((disinfectionSurcharge + stationLabor) / HOURLY_RATE);
      method = "Child-Safe Managed Enrollment Model";
      justification = `Managed protocol for ${studentCount} students focusing on daily disinfection of ${changingStations} changing stations using child-safe EPA N-List chemicals.`;
      breakdown.push(
        { label: "Core Facility Labor", value: daycareData.cost },
        { label: "Disinfection Frequency Surcharge", value: disinfectionSurcharge + stationLabor }
      );
      break;

    case 'medical':
      grandTotal = squareFootage * 0.26;
      totalMonthlyHours = grandTotal / HOURLY_RATE;
      method = "Sterile-Grade Terminal Cleaning";
      justification = "Pricing based on clinical-level pathogens logs and high-intensity disinfection for medical suites.";
      breakdown.push({ label: "Terminal Sanitation Labor", value: grandTotal });
      break;

    case 'education':
      const eduData = calculateRoomLabor(rooms);
      const porterHrs = porters.reduce((acc, p) => acc + (p.quantity * p.hoursPerDay), 0) * DAYS_PER_MONTH;
      const porterCost = porterHrs * (HOURLY_RATE * 1.15); // Add a small management premium for porters
      grandTotal = eduData.cost + porterCost;
      totalMonthlyHours = eduData.hours + porterHrs;
      method = "Integrated Campus Labor Model";
      justification = "A hybrid model combining nightly academic sanitation with on-site Day Porter logistics for restroom rotations.";
      breakdown.push(
        { label: "Academic Area Maintenance", value: eduData.cost },
        { label: "Day Porter Logistics", value: porterCost }
      );
      break;

    case 'office':
      grandTotal = squareFootage * 0.15;
      totalMonthlyHours = grandTotal / HOURLY_RATE;
      method = "Class-A Portfolio Maintenance";
      justification = "Managed precision focused on high-visibility lobby care and common area tenant retention.";
      breakdown.push({ label: "Portfolio-Wide Logistics", value: grandTotal });
      break;

    case 'warehouse':
      const warehouseLaborCost = (laborHoursPerDay * DAYS_PER_MONTH) * HOURLY_RATE; 
      const scrubbingCost = settings.warehouseScrubbingSqFt * 0.10;
      grandTotal = warehouseLaborCost + scrubbingCost;
      totalMonthlyHours = (laborHoursPerDay * DAYS_PER_MONTH);
      method = "Industrial Performance Model";
      justification = "Calculated for high-bay logistics with ride-on scrubber allocation for heavy floor maintenance.";
      breakdown.push(
        { label: "Managed Man-Hours", value: warehouseLaborCost },
        { label: "Machine Scrubbing Service", value: scrubbingCost }
      );
      break;

    case 'hotel':
      const guestSuppCost = hotelRooms * 15; 
      const commonAreaCost = squareFootage * 0.17; 
      grandTotal = guestSuppCost + commonAreaCost;
      totalMonthlyHours = grandTotal / HOURLY_RATE;
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
      totalMonthlyHours = grandTotal / HOURLY_RATE;
      method = "Common-Area Amenity Pricing";
      justification = "Predictable management for multi-family complexes based on amenity and corridor density.";
      breakdown.push({ label: "Amenity Maintenance", value: grandTotal });
      break;

    default:
      grandTotal = squareFootage * 0.18;
      totalMonthlyHours = grandTotal / HOURLY_RATE;
  }

  // One-time service adjustment
  if (settings.serviceType === 'onetime') {
    grandTotal = grandTotal * 0.8; 
    totalMonthlyHours = totalMonthlyHours * 0.8;
  }

  // INTERNAL MATH (The "Behind the Scenes" for Owner)
  const laborInternal = totalMonthlyHours * INTERNAL_LABOR_COST;
  const suppliesInternal = grandTotal * MARGIN_SUPPLIES;
  const overheadInternal = grandTotal * MARGIN_OVERHEAD;
  
  // Final Net Profit is calculated to reflect exactly the requested margins
  const netProfit = grandTotal * MARGIN_PROFIT;
  const profitMargin = (netProfit / grandTotal) * 100;

  const internal: InternalBreakdown = {
    laborCost: laborInternal,
    suppliesCost: suppliesInternal,
    overheadCost: overheadInternal,
    netProfit: netProfit,
    profitMargin: profitMargin,
    totalMonthlyHours: totalMonthlyHours
  };

  return { grandTotal, method, justification, breakdown, internal };
};
