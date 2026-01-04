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
  } = settings;
  
  let grandTotal = 0;
  let method = "";
  let justification = "";
  const breakdown: { label: string; value: number }[] = [];

  const DAYS_PER_MONTH = 21.67; 

  switch (industry) {
    case 'education':
      let totalMins = rooms.reduce((acc, r) => acc + (r.quantity * r.minutesPerRoom), 0);
      let monthlyHrs = (totalMins / 60) * 22;
      let baseEducationCost = monthlyHrs * 18.50 * 1.35; 
      
      const porterHrs = porters.reduce((acc, p) => acc + (p.quantity * p.hoursPerDay), 0) * 22;
      const porterCost = porterHrs * 24.50; 
      
      grandTotal = baseEducationCost + porterCost;
      method = "Integrated Campus Labor Model";
      justification = "Labor allocation based on standardized facility-space metrics and dedicated on-site day porter staffing for high-traffic zones.";
      breakdown.push(
        { label: "Core Maintenance Labor", value: baseEducationCost },
        { label: "Day Porter Staffing", value: porterCost }
      );
      break;

    case 'office':
      grandTotal = squareFootage * 0.15;
      method = "Class-A Managed Maintenance";
      justification = "Strategic labor allocation for high-visibility commercial real estate, amortizing seasonal deep cleaning into a fixed monthly model.";
      breakdown.push({ label: "Portfolio Maintenance", value: grandTotal });
      break;

    case 'medical':
      grandTotal = squareFootage * 0.26;
      method = "Sterile-Grade Compliance Model";
      justification = "Calculated via terminal cleaning standards for clinical environments, including pathogen control and sterile surface surfacing.";
      breakdown.push({ label: "Compliance Sanitation", value: grandTotal });
      break;

    case 'retail':
      let visitRate = 90;
      if (retailSize === 'medium') visitRate = 135;
      if (retailSize === 'large') visitRate = 190;
      
      grandTotal = visitRate * frequencyPerWeek * 4.33; 
      method = "Retail Visit Amortization";
      justification = "Standardized site-visit budgeting based on square footage tier and high-traffic sanitization frequency.";
      breakdown.push({ label: "Store-Front Logistics", value: grandTotal });
      break;

    case 'hotel':
      const bohCost = hotelRooms * 15; 
      const publicCost = squareFootage * 0.17; 
      grandTotal = (bohCost + publicCost);
      method = "Hospitality Hybrid Model";
      justification = "Allocates specialized labor for Back-of-House (BOH) support and premium Front-of-House (FOH) high-visibility upkeep.";
      breakdown.push(
        { label: "BOH Operational Support", value: bohCost },
        { label: "FOH Public Visibility", value: publicCost }
      );
      break;

    case 'warehouse':
      const scrubbingSqFt = settings.warehouseScrubbingSqFt || 5000;
      const laborCost = (laborHoursPerDay * DAYS_PER_MONTH) * 48; 
      const scrubbingCost = (scrubbingSqFt * 0.10); 
      grandTotal = laborCost + scrubbingCost;
      method = "Industrial Performance Model";
      justification = "Industrial-scale budgeting accounting for large-area floor scrubbing and 24/7 logistics labor requirements.";
      breakdown.push(
        { label: "Industrial Man-Hours", value: laborCost },
        { label: "Asset Protection (Scrub)", value: scrubbingCost }
      );
      break;

    case 'hoa':
      if (buildingSize === 'small') grandTotal = 1100;
      else if (buildingSize === 'medium') grandTotal = 2600;
      else if (buildingSize === 'large') grandTotal = 3200;
      else grandTotal = 5500;
      
      method = "HOA Common-Area Fixed Plan";
      justification = "Predictable common-area management based on amenity density and multi-family high-rise classification.";
      breakdown.push({ label: "Common-Area Logistics", value: grandTotal });
      break;

    case 'government':
      const govtLabor = (laborHoursPerDay * DAYS_PER_MONTH) * 52;
      grandTotal = govtLabor;
      method = "Municipal Staffing Framework";
      justification = "Full-burden labor model for public-sector facilities, including specialized municipal compliance oversight.";
      breakdown.push({ label: "Municipal Labor Allocation", value: govtLabor });
      break;

    default:
      grandTotal = squareFootage * 0.15;
  }

  if (settings.serviceType === 'onetime') {
    grandTotal = grandTotal * 0.6;
    method = "Project-Based Engagement";
  }

  return { grandTotal, method, justification, breakdown };
};