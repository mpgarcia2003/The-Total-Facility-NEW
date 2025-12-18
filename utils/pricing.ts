import { RoomType, PorterService, PricingSettings, QuoteCalculations } from '../types';

export const calculateQuote = (
  rooms: RoomType[],
  porters: PorterService[],
  settings: PricingSettings,
  includeSummer: boolean,
  includeWinter: boolean
): QuoteCalculations => {
  
  // 1. Cleaning Labor
  let totalDailyMinutes = 0;
  rooms.forEach(r => {
    totalDailyMinutes += (r.quantity * r.minutesPerRoom);
  });

  const totalDailyHours = totalDailyMinutes / 60;
  const monthlyCleaningHours = totalDailyHours * settings.daysInMonth;
  const laborCost = monthlyCleaningHours * settings.hourlyRate;

  // 2. Cleaning Overheads / Margin
  // "Charge 25% extra for margin and profit"
  // Logic: Cost + (Cost * 0.25)
  const materialCost = 0; // settings.materialPct is now 0
  const miscCost = 0;     // settings.miscPct is now 0
  
  // Apply the full markup (25%) to the labor cost
  const profitCost = laborCost * settings.profitPct; 
  
  const cleaningTotal = laborCost + profitCost; // Simple Labor + 25%

  // 3. Add-ons
  const summerStripCost = includeSummer ? (laborCost * settings.summerStripPct) : 0;
  const winterWashCost = includeWinter ? (laborCost * settings.winterWashPct) : 0;

  // 4. Porters
  let totalPorterDailyHours = 0;
  porters.forEach(p => {
    totalPorterDailyHours += (p.quantity * p.hoursPerDay);
  });
  
  const monthlyPorterHours = totalPorterDailyHours * settings.daysInMonth;
  const porterLaborCost = monthlyPorterHours * settings.porterHourlyRate;
  
  // Porter Total
  // Apply same 25% markup logic to Porter labor if consistent with request
  // Request: "Charge 25% extra for my margin and profit"
  const porterMargin = porterLaborCost * settings.profitPct;
  const porterTotal = porterLaborCost + porterMargin + settings.porterUniformCost + settings.porterMiscCost;

  // 5. Grand Total
  const grandTotal = cleaningTotal + summerStripCost + winterWashCost + porterTotal;

  return {
    totalDailyMinutes,
    totalDailyHours,
    monthlyCleaningHours,
    laborCost,
    materialCost,
    miscCost,
    profitCost,
    cleaningTotal,
    summerStripCost,
    winterWashCost,
    totalPorterDailyHours,
    monthlyPorterHours,
    porterLaborCost,
    porterTotal,
    grandTotal
  };
};