import { RoomType, PorterService, PricingSettings, QuoteCalculations } from '../types';

export const calculateQuote = (
  rooms: RoomType[],
  porters: PorterService[],
  settings: PricingSettings
): QuoteCalculations => {
  
  // 1. Base Cleaning Labor
  let totalDailyMinutes = 0;
  rooms.forEach(r => {
    totalDailyMinutes += (r.quantity * r.minutesPerRoom);
  });

  const totalDailyHours = totalDailyMinutes / 60;
  const monthlyCleaningHours = totalDailyHours * settings.daysInMonth;
  const baseCleaningLabor = monthlyCleaningHours * settings.hourlyRate;

  // 2. Specialty Maintenance Amortization
  // Estimate annual specialty labor value (Floor strip, winter wash, carpet shampoo)
  // Logic: Specialty Annual Value = (Base Month Labor * Factor)
  // Monthly amortized = Specialty Annual Value / 12
  const amortizedSpecialtyLabor = (baseCleaningLabor * settings.specialtyAnnualLaborFactor) / 12;

  // 3. Porter Base Labor
  let totalPorterDailyHours = 0;
  porters.forEach(p => {
    totalPorterDailyHours += (p.quantity * p.hoursPerDay);
  });
  const monthlyPorterHours = totalPorterDailyHours * settings.daysInMonth;
  const basePorterLabor = monthlyPorterHours * settings.porterHourlyRate;

  // 4. Final Markup (30%)
  // "Markup applied to all labor-based calculations"
  const cleaningTotal = baseCleaningLabor * (1 + settings.profitPct);
  const porterTotal = basePorterLabor * (1 + settings.profitPct);
  const specialtyTotal = amortizedSpecialtyLabor * (1 + settings.profitPct);

  // 5. Grand Total
  const grandTotal = cleaningTotal + porterTotal + specialtyTotal;

  return {
    totalDailyMinutes,
    totalDailyHours,
    monthlyCleaningHours,
    baseCleaningLabor,
    basePorterLabor,
    amortizedSpecialtyLabor,
    cleaningTotal,
    porterTotal,
    specialtyTotal,
    grandTotal
  };
};