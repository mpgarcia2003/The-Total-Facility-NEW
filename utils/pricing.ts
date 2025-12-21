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
    retailSize,
    laborHoursPerDay,
    warehouseScrubbingSqFt 
  } = settings;
  
  let grandTotal = 0;
  let method = "";
  let justification = "";
  const breakdown: { label: string; value: number }[] = [];

  const DAYS_PER_MONTH = 21.67; // Standard business days month avg

  switch (industry) {
    case 'education':
      // Room-based legacy logic
      let totalMins = rooms.reduce((acc, r) => acc + (r.quantity * r.minutesPerRoom), 0);
      let monthlyHrs = (totalMins / 60) * 22;
      let baseEducationCost = monthlyHrs * 18.50 * 1.35; 
      
      // Add Porter Services for Education
      const porterHrs = porters.reduce((acc, p) => acc + (p.quantity * p.hoursPerDay), 0) * 22;
      const porterCost = porterHrs * 24.50; // Middle-market porter rate
      
      grandTotal = baseEducationCost + porterCost;
      method = "Standard Education Labor Model";
      justification = "Calculated via facility inventory and standardized labor minutes per area, plus dedicated day-porter staffing.";
      breakdown.push(
        { label: "Instructional Space Cleaning", value: baseEducationCost },
        { label: "Day Porter Staffing", value: porterCost }
      );
      break;

    case 'office':
      grandTotal = squareFootage * 0.15;
      method = "Monthly Dollars Per Square Foot";
      justification = "Competitive middle-market rate for Class-B/Mixed-Use office portfolios ($0.15/sqft).";
      breakdown.push({ label: "Office Maintenance", value: grandTotal });
      break;

    case 'medical':
      grandTotal = squareFootage * 0.26;
      method = "Medical Standard (SqFt/Month)";
      justification = "Includes clinical-grade sanitation and infection control for medical suites ($0.26/sqft).";
      breakdown.push({ label: "Clinical Sanitation", value: grandTotal });
      break;

    case 'retail':
      let visitRate = 90;
      if (retailSize === 'medium') visitRate = 135;
      if (retailSize === 'large') visitRate = 190;
      
      grandTotal = visitRate * frequencyPerWeek * 4.33; 
      method = "Price Per Visit Model";
      justification = `Middle-market retail pricing at $${visitRate}/visit based on facility scale and frequency.`;
      breakdown.push({ label: "Recurring Store Visits", value: grandTotal });
      break;

    case 'hotel':
      // Hybrid Room/SqFt Model
      const bohCost = hotelRooms * 15; 
      const publicCost = squareFootage * 0.17; 
      grandTotal = (bohCost + publicCost);
      method = "Hybrid Room/SqFt Model";
      justification = "Budget for Back-of-House room turnover ($15/room) and Public Area maintenance ($0.17/sqft).";
      breakdown.push(
        { label: "BOH Room Support", value: bohCost },
        { label: "Public Area Care", value: publicCost }
      );
      break;

    case 'warehouse':
      const laborCost = (laborHoursPerDay * DAYS_PER_MONTH) * 48; 
      const scrubbingCost = (warehouseScrubbingSqFt * 0.10); 
      grandTotal = laborCost + scrubbingCost;
      method = "Task/Hourly Industrial Model";
      justification = "Industrial budget based on $48/labor hour and periodic floor scrubbing at $0.10/sqft.";
      breakdown.push(
        { label: "Industrial Labor", value: laborCost },
        { label: "Floor Scrubbing", value: scrubbingCost }
      );
      break;

    case 'hoa':
      if (buildingSize === 'small') grandTotal = 1100;
      else if (buildingSize === 'medium') grandTotal = 2600;
      else if (buildingSize === 'large') grandTotal = 3200;
      else grandTotal = 5500;
      
      method = "Flat Monthly Multi-Family Rate";
      justification = "Comprehensive common-area maintenance budget based on building classification and amenities.";
      breakdown.push({ label: "Monthly Portfolio Rate", value: grandTotal });
      break;

    case 'government':
      const govtLabor = (laborHoursPerDay * DAYS_PER_MONTH) * 52;
      grandTotal = govtLabor;
      method = "Hourly Municipal Staffing Model";
      justification = "Staffing-justified budget at $52/hr, accounting for labor burden and operational overhead.";
      breakdown.push({ label: "Staffing Requirement", value: govtLabor });
      break;

    default:
      grandTotal = squareFootage * 0.15;
  }

  if (settings.serviceType === 'onetime') {
    grandTotal = grandTotal * 0.6;
    method = "One-Time Project Flat Fee";
  }

  return { grandTotal, method, justification, breakdown };
};