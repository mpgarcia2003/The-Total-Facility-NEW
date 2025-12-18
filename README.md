# LuminaClean - Instant Janitorial Quote App

A premium React application for generating instant facility cleaning quotes based on room count, minutes per room, and labor variables.

## Logic Replication
This app replicates the Excel pricing model using the following calculation flow:

1. **Room Calculation**: Sums (Quantity * Minutes) for all rooms to get `TotalDailyMinutes`.
2. **Monthly Hours**: Converts daily minutes to hours -> multiplies by `daysInMonth` (Default 22).
3. **Labor Cost**: `MonthlyHours` * `hourlyRate` (Default $17.50).
4. **Overheads**: Adds percentages for Material (4%), Misc (2.5%), and Profit (~26.6%).
5. **Add-ons**: Summer/Winter floor care are calculated as percentages of the Base Labor Cost, toggleable by the user.
6. **Porter Services**: Calculated separately (Hours * Days * Rate) and added to the Grand Total.

## Sanity Check
Based on default inputs:
- Total Daily Minutes: 1665 (Note: Default room list may need slight qty adjustment to hit exactly 1665, currently set to standard defaults).
- Rate: $17.50
- Final logic structure ensures: Labor + 4% + 2.5% + 26.625% = Final Quote.

## Setup Instructions

### 1. Installation
Ensure you have Node.js installed.

```bash
# Create a new Vite project (optional, if starting from scratch)
npm create vite@latest janitorial-quote -- --template react-ts

# Install dependencies
npm install lucide-react clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### 2. Running Locally
Place the provided files in their respective directories (src/).

```bash
npm run dev
```

### 3. Customization
- **Pricing Logic**: Edit `src/utils/pricing.ts`
- **Default Rates**: Edit `src/constants.ts` (Change `hourlyRate`, `profitPct`, etc.)
- **Styling**: `tailwind.config.js` is embedded in `index.html` for this single-file output demo, but in a real project, move it to `tailwind.config.js`.

### 4. Deployment (Vercel)
1. Push code to GitHub.
2. Import project into Vercel.
3. Framework Preset: Vite.
4. Deploy.

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
