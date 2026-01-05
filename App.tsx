
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PricingSettings, 
  RoomType, 
  PorterService,
  IndustryType,
  ServiceType,
  BlogPost
} from './types';
import { calculateQuote } from './utils/pricing';
import { formatCurrency } from './utils/format';
import { leadService } from './utils/leadService';
import emailjs from '@emailjs/browser';

// Components
import RoomList from './components/RoomList';
import PorterList from './components/PorterList';
import LeadForm from './components/LeadForm';
import SchedulingModal from './components/SchedulingModal';
import IndustryExplainerModal from './components/IndustryExplainerModal';
import ResourceModal from './components/ResourceModal';
import BlogReader from './components/BlogReader';
import { 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Building2,
  GraduationCap,
  Stethoscope,
  Users,
  Store,
  Warehouse,
  Hotel,
  GanttChartSquare,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
  Phone,
  X,
  ClipboardCheck,
  HardHat,
  Globe,
  FileText,
  Mail,
  Loader2,
  LayoutDashboard,
  Dumbbell
} from 'lucide-react';

const EMAILJS_PUBLIC_KEY = "4ye26ZtWxpi6Pkk5f";

const LogoIcon = ({ className = "w-10 h-10", light = false }: { className?: string, light?: boolean }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="20" y="15" width="20" height="20" rx="4" fill={light ? "white" : "#0d9488"} />
    <rect x="20" y="55" width="20" height="20" rx="4" fill={light ? "white" : "#cbd5e1"} fillOpacity={light ? "0.3" : "1"} />
  </svg>
);

const App: React.FC = () => {
  const [wizardStep, setWizardStep] = useState<'industry' | 'objective' | 'calculator'>('industry');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [settings, setSettings] = useState<PricingSettings>({
    industry: 'education',
    serviceType: 'recurring',
    squareFootage: 15000,
    frequencyPerWeek: 5,
    hotelRooms: 50,
    churchCapacity: 300,
    seatingType: 'pews',
    buildingSize: 'medium',
    retailSize: 'medium',
    laborHoursPerDay: 8,
    warehouseScrubbingSqFt: 5000,
    showerCount: 5,
    hasSauna: false,
    studentCount: 50,
    changingStations: 4
  });

  const [rooms, setRooms] = useState<RoomType[]>([
    { id: '1', name: 'Standard Classroom', quantity: 10, minutesPerRoom: 15 },
    { id: '2', name: 'Restroom', quantity: 4, minutesPerRoom: 20 }
  ]);

  const [porters, setPorters] = useState<PorterService[]>([
    { id: 'p1', name: 'Day Porter', quantity: 1, hoursPerDay: 8 }
  ]);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockEmail, setUnlockEmail] = useState('');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [activeIndustryExplainer, setActiveIndustryExplainer] = useState<string | null>(null);
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);

  const quoteSectionRef = useRef<HTMLDivElement>(null);
  const industriesSectionRef = useRef<HTMLDivElement>(null);

  const quote = useMemo(() => calculateQuote(settings, rooms, porters), [settings, rooms, porters]);

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = ref.current;
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const selectIndustry = (industry: IndustryType) => {
    setSettings(prev => ({ ...prev, industry }));
    
    // Auto-populate rooms based on industry choice
    const presets: Record<string, RoomType[]> = {
      church: [
        { id: 'c1', name: 'Main Sanctuary', quantity: 1, minutesPerRoom: 60 },
        { id: 'c2', name: 'Fellowship Hall', quantity: 1, minutesPerRoom: 45 },
        { id: 'c3', name: 'Restroom (Public)', quantity: 4, minutesPerRoom: 20 }
      ],
      fitness: [
        { id: 'f1', name: 'Main Weight Floor', quantity: 1, minutesPerRoom: 45 },
        { id: 'f2', name: 'Locker Room (Men)', quantity: 1, minutesPerRoom: 60 },
        { id: 'f3', name: 'Locker Room (Women)', quantity: 1, minutesPerRoom: 60 }
      ],
      daycare: [
        { id: 'd1', name: 'Infant/Toddler Room', quantity: 2, minutesPerRoom: 40 },
        { id: 'd2', name: 'Indoor Play Zone', quantity: 1, minutesPerRoom: 45 },
        { id: 'd3', name: 'Restroom (Child)', quantity: 3, minutesPerRoom: 20 }
      ],
      medical: [
        { id: 'm1', name: 'Exam Room', quantity: 8, minutesPerRoom: 20 },
        { id: 'm2', name: 'Waiting Area', quantity: 1, minutesPerRoom: 30 },
        { id: 'm3', name: 'Laboratory', quantity: 1, minutesPerRoom: 45 }
      ]
    };

    if (presets[industry]) setRooms(presets[industry]);
    setWizardStep('objective');
  };

  const selectObjective = (serviceType: ServiceType) => {
    setSettings(prev => ({ ...prev, serviceType }));
    setWizardStep('calculator');
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnlocking) return;
    if (!unlockEmail.includes('@')) return;

    setIsUnlocking(true);
    try {
      await leadService.submitLead({
        name: "Quick Lead",
        email: unlockEmail,
        company: "New Inquiry",
        funnel_stage: 'UNLOCK',
        industry: settings.industry,
        quote_total: formatCurrency(quote.grandTotal)
      });
      setIsUnlocked(true);
    } catch (err) {
      console.error("Unlock error:", err);
      setIsUnlocked(true);
    } finally {
      setIsUnlocking(false);
    }
  };

  const resetApp = () => {
    setWizardStep('industry');
    setIsUnlocked(false);
    setUnlockEmail('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden">
      
      {/* NAVIGATION BAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-2xl shadow-xl py-3 border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <LogoIcon className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110" light={!isScrolled} />
            <div className="flex flex-col text-left">
              <span className={`font-black text-sm sm:text-lg leading-none tracking-tight uppercase transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                TOTAL FACILITY SERVICES LLC
              </span>
              <span className={`text-[8px] tracking-[0.4em] font-black uppercase transition-opacity duration-300 ${isScrolled ? 'text-brand-accent opacity-100' : 'text-white opacity-60'}`}>Managed Precision</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <a href="tel:8444543101" className={`flex items-center gap-2 text-xs font-black transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              <Phone size={14} className="text-brand-accent" /> (844) 454-3101
            </a>
            <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="bg-gradient-to-r from-brand-accent to-brand-accentLight text-white px-6 py-3 rounded-xl text-[10px] font-black shadow-lg uppercase tracking-widest">
              Instant Quote
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"></div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[160px] translate-x-1/3"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-left">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-full mb-8">
               <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
               <span className="text-brand-accent text-[10px] font-black uppercase tracking-widest">NY, FL, NJ, & CT Multi-Site Portfolios</span>
             </div>
             <h1 className="text-5xl sm:text-8xl lg:text-[105px] font-black text-white leading-[0.85] tracking-tighter mb-8">
              Managed <br />Facility <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight via-teal-200 to-white">Labor Models.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-lg leading-relaxed font-medium mb-12">
              Beyond basic cleaning. We provide technical labor allocations for Class-A assets, medical portfolios, and educational campuses.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="group px-10 py-5 bg-brand-accent text-white font-black rounded-2xl shadow-xl shadow-brand-accent/20 transition-all flex items-center justify-center gap-4 text-lg">
                Get Your Quote <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
        </div>
      </header>

      {/* WIZARD SECTION */}
      <section id="quote-section" ref={quoteSectionRef} className="py-24 md:py-32 bg-slate-50 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {wizardStep === 'industry' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-center">
               <div className="mb-16">
                 <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-4 block">Selection Step 1 of 3</span>
                 <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight">Select Sector.</h2>
                 <p className="text-slate-500 mt-4 font-medium text-lg">Choose your facility type to load specialized labor drivers.</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                 {[
                   { id: 'education', icon: <GraduationCap size={40} />, title: 'Education', desc: 'K-12 & Higher Ed' },
                   { id: 'medical', icon: <Stethoscope size={40} />, title: 'Medical/Clinical', desc: 'Terminal Cleaning' },
                   { id: 'church', icon: <LayoutDashboard size={40} />, title: 'Religious', desc: 'Worship Facilities' },
                   { id: 'fitness', icon: <Zap size={40} />, title: 'Fitness/Gym', desc: 'Wellness & Spas' },
                   { id: 'daycare', icon: <Users size={40} />, title: 'Daycare', desc: 'Early Childhood' },
                   { id: 'office', icon: <Building2 size={40} />, title: 'Commercial', desc: 'Office Portfolios' },
                   { id: 'hotel', icon: <Hotel size={40} />, title: 'Hotel', desc: 'FOH & BOH Support' },
                   { id: 'warehouse', icon: <Warehouse size={40} />, title: 'Industrial', desc: 'Logistics Centers' },
                   { id: 'government', icon: <GanttChartSquare size={40} />, title: 'Public Sector', desc: 'Municipal Assets' },
                 ].map((item) => (
                   <button key={item.id} onClick={() => selectIndustry(item.id as IndustryType)} className="group flex flex-col items-center text-center p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-brand-accent hover:shadow-2xl transition-all">
                     <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-brand-accent/10 group-hover:text-brand-accent mb-6 transition-all">{item.icon}</div>
                     <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                   </button>
                 ))}
               </div>
            </div>
          )}

          {wizardStep === 'objective' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
               <div className="text-center mb-16">
                 <button onClick={() => setWizardStep('industry')} className="text-brand-accent text-[10px] font-black uppercase tracking-widest mb-6 inline-flex items-center gap-2 hover:translate-x-[-4px] transition-transform"><ChevronLeft size={14} /> Back to Sector</button>
                 <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">Financial Objective.</h2>
               </div>
               <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
                 <button onClick={() => selectObjective('recurring')} className="group p-10 md:p-14 bg-white border-2 border-slate-100 rounded-[3rem] text-left hover:border-brand-accent hover:shadow-2xl transition-all">
                   <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-brand-accent mb-8"><Calendar size={32} /></div>
                   <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Recurring Maintenance</h4>
                   <p className="text-slate-500 font-medium mb-8">Daily managed labor delivered as a fixed, predictable monthly budget.</p>
                   <div className="text-brand-accent text-xs font-black uppercase tracking-widest flex items-center gap-2">Initialize Model <ArrowRight size={14} /></div>
                 </button>
                 <button onClick={() => selectObjective('onetime')} className="group p-10 md:p-14 bg-[#0f172a] text-white border-2 border-slate-800 rounded-[3rem] text-left hover:border-brand-accent hover:shadow-2xl transition-all">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-accent mb-8"><Sparkles size={32} /></div>
                   <h4 className="text-2xl md:text-3xl font-black mb-4">Specific RFP / Project</h4>
                   <p className="text-slate-400 font-medium mb-8">One-time deep sanitation, floor restoration, or specific bidding invitation.</p>
                   <div className="text-brand-accent text-xs font-black uppercase tracking-widest flex items-center gap-2">Get Project Estimate <ArrowRight size={14} /></div>
                 </button>
               </div>
            </div>
          )}

          {wizardStep === 'calculator' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
                 <div className="flex items-center gap-4">
                    <button onClick={() => setWizardStep('objective')} className="text-slate-400 hover:text-slate-900"><ChevronLeft size={24}/></button>
                    <div className="px-4 py-2 bg-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">Sector: {settings.industry} • {settings.serviceType}</div>
                 </div>
                 <button onClick={resetApp} className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest">Start New Assessment</button>
               </div>
               
               <div className="grid lg:grid-cols-12 gap-12 items-start">
                  <div className="lg:col-span-8 space-y-12 text-left">
                    <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-14 shadow-sm">
                      <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                        <span className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-bold">1</span>
                        Facility Configuration
                      </h3>
                      
                      {/* INDUSTRY SPECIFIC INPUTS */}
                      <div className="space-y-12">
                        {settings.industry === 'church' && (
                           <div className="space-y-12">
                              <div className="p-10 bg-teal-50/50 border border-teal-100 rounded-[2.5rem] space-y-8">
                                <div className="flex justify-between items-end">
                                  <h4 className="text-xl font-black text-slate-900">Sanctuary Capacity</h4>
                                  <div className="text-3xl font-black text-brand-accent">{settings.churchCapacity} <span className="text-sm text-slate-400">Seats</span></div>
                                </div>
                                <input type="range" min="50" max="3000" step="50" value={settings.churchCapacity} onChange={e => setSettings({...settings, churchCapacity: parseInt(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                                <div className="pt-4 border-t border-teal-100/30">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Seating Type</label>
                                   <div className="grid grid-cols-2 gap-4">
                                      <button onClick={() => setSettings({...settings, seatingType: 'pews'})} className={`p-4 rounded-2xl border-2 font-black transition-all ${settings.seatingType === 'pews' ? 'border-brand-accent bg-white text-brand-accent shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>Fixed Pews</button>
                                      <button onClick={() => setSettings({...settings, seatingType: 'chairs'})} className={`p-4 rounded-2xl border-2 font-black transition-all ${settings.seatingType === 'chairs' ? 'border-brand-accent bg-white text-brand-accent shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>Stackable Chairs</button>
                                   </div>
                                </div>
                              </div>
                              <RoomList rooms={rooms} onChange={setRooms} industry="church" />
                           </div>
                        )}

                        {settings.industry === 'fitness' && (
                           <div className="space-y-12">
                              <div className="p-10 bg-teal-50/50 border border-teal-100 rounded-[2.5rem] grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                   <h4 className="text-xl font-black text-slate-900">Showers/Wet Areas</h4>
                                   <div className="text-3xl font-black text-brand-accent">{settings.showerCount} <span className="text-sm text-slate-400">Heads</span></div>
                                   <input type="range" min="0" max="50" step="1" value={settings.showerCount} onChange={e => setSettings({...settings, showerCount: parseInt(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                                </div>
                                <div className="space-y-4">
                                   <button onClick={() => setSettings({...settings, hasSauna: !settings.hasSauna})} className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${settings.hasSauna ? 'border-brand-accent bg-white shadow-lg' : 'border-slate-100 bg-slate-50'}`}>
                                     <div className="text-left"><div className="font-black text-sm">Sauna/Steam</div><div className="text-[10px] font-bold text-slate-400 uppercase">Daily Sanitization</div></div>
                                     <CheckCircle2 size={24} className={settings.hasSauna ? 'text-brand-accent' : 'text-slate-200'} />
                                   </button>
                                </div>
                              </div>
                              <RoomList rooms={rooms} onChange={setRooms} industry="fitness" />
                           </div>
                        )}

                        {settings.industry === 'daycare' && (
                           <div className="space-y-12">
                              <div className="p-10 bg-teal-50/50 border border-teal-100 rounded-[2.5rem] grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                   <h4 className="text-xl font-black text-slate-900">Student Enrollment</h4>
                                   <div className="text-3xl font-black text-brand-accent">{settings.studentCount} <span className="text-sm text-slate-400">Capacity</span></div>
                                   <input type="range" min="10" max="300" step="10" value={settings.studentCount} onChange={e => setSettings({...settings, studentCount: parseInt(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                                </div>
                                <div className="space-y-6">
                                   <h4 className="text-xl font-black text-slate-900">Changing Stations</h4>
                                   <div className="text-3xl font-black text-brand-accent">{settings.changingStations} <span className="text-sm text-slate-400">Total</span></div>
                                   <input type="range" min="1" max="20" step="1" value={settings.changingStations} onChange={e => setSettings({...settings, changingStations: parseInt(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                                </div>
                              </div>
                              <RoomList rooms={rooms} onChange={setRooms} industry="daycare" />
                           </div>
                        )}

                        {/* DEFAULT VIEW FOR OTHERS */}
                        {!['church', 'fitness', 'daycare'].includes(settings.industry) && (
                           <div className="space-y-12">
                              <div className="space-y-8">
                                <div className="flex justify-between items-end">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portfolio Square Footage</label>
                                  <span className="text-3xl font-black text-brand-accent">{settings.squareFootage.toLocaleString()} <span className="text-sm text-slate-400">SQ FT</span></span>
                                </div>
                                <input type="range" min="1000" max="150000" step="1000" value={settings.squareFootage} onChange={e => setSettings({...settings, squareFootage: parseInt(e.target.value)})} className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                              </div>
                              <RoomList rooms={rooms} onChange={setRooms} industry={settings.industry} />
                           </div>
                        )}
                      </div>
                    </div>
                    <LeadForm 
                        quote={quote} 
                        industry={settings.industry} 
                        serviceType={settings.serviceType} 
                        rooms={rooms} 
                        initialEmail={unlockEmail}
                        onSubmit={() => {}} 
                        onSchedule={() => setIsSchedulerOpen(true)} 
                        onReset={resetApp}
                      />
                  </div>

                  {/* SIDEBAR - THE "LOCKED" QUOTE */}
                  <aside className="lg:col-span-4 lg:sticky lg:top-32 w-full">
                    {!isUnlocked ? (
                      <div className="bg-[#0f172a] text-white p-12 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent animate-pulse"></div>
                        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-brand-accent border border-white/10"><Lock size={32}/></div>
                        <div>
                          <h4 className="text-3xl font-black tracking-tighter mb-4 text-center">Labor Model Ready</h4>
                          <p className="text-slate-400 font-medium text-center text-sm leading-relaxed">Enter your corporate email to reveal the calculated monthly budget for this facility profile.</p>
                        </div>
                        <form onSubmit={handleUnlock} className="space-y-4">
                           <div className="relative">
                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                             <input 
                              required
                              type="email" 
                              placeholder="john@company.com" 
                              value={unlockEmail}
                              onChange={(e) => setUnlockEmail(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 font-bold text-white focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all"
                             />
                           </div>
                           <button type="submit" disabled={isUnlocking} className="w-full bg-brand-accent hover:bg-brand-accentLight py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-brand-accent/20 transition-all flex items-center justify-center gap-3">
                             {isUnlocking ? <Loader2 className="animate-spin" size={16}/> : 'Unlock Target Quote'}
                           </button>
                        </form>
                      </div>
                    ) : (
                      <div className="bg-[#0f172a] text-white p-12 rounded-[3rem] shadow-2xl border border-white/5 animate-in zoom-in-95 duration-500 text-left">
                        <div className="space-y-10">
                          <div>
                            <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Target Monthly Labor Budget</span>
                            <div className="text-5xl font-black tracking-tighter">
                              {formatCurrency(quote.grandTotal)}
                              <span className="text-xl text-slate-500 ml-1">/mo</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {quote.breakdown.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-xs pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                <span className="text-slate-400 font-black uppercase tracking-widest">{item.label}</span>
                                <span className="font-black text-teal-400">{formatCurrency(item.value)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
                            <div className="flex items-center gap-2 text-teal-400"><FileText size={14}/><span className="text-[10px] font-black uppercase tracking-widest">Model Strategy</span></div>
                            <p className="text-[11px] text-slate-400 italic leading-relaxed font-medium">"{quote.justification}"</p>
                          </div>
                          <button onClick={() => setIsSchedulerOpen(true)} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 transition-all shadow-xl">Finalize Site Audit</button>
                        </div>
                      </div>
                    )}
                  </aside>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white py-24 border-t border-white/5 text-left">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <LogoIcon className="w-12 h-12" light={true} />
              <span className="font-black text-2xl tracking-tighter uppercase leading-tight">TOTAL FACILITY SERVICES LLC</span>
            </div>
            <p className="text-slate-400 text-lg font-medium max-w-sm leading-relaxed">Strategic maintenance for multi-site portfolios. Managed labor, predictable outcomes, and asset protection across the Tri-State and Florida.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white text-[10px] uppercase tracking-widest font-black">Support Hotlines</h4>
            <p className="text-brand-accent text-3xl font-black tracking-tighter leading-none">(844) 454-3101</p>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black">© 2024 Total Facility Services LLC. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <SchedulingModal isOpen={isSchedulerOpen} onClose={() => setIsSchedulerOpen(false)} />
      <IndustryExplainerModal industryId={activeIndustryExplainer} onClose={() => setActiveIndustryExplainer(null)} />
      <ResourceModal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} />
      <BlogReader post={activeBlogPost} onClose={() => setActiveBlogPost(null)} />
    </div>
  );
};

export default App;
