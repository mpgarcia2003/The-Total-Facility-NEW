
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
import { BLOG_POSTS } from './data/blogPosts';
import { PRESET_ROOMS } from './constants';
import emailjs from '@emailjs/browser';

// Components
import RoomList from './components/RoomList';
import PorterList from './components/PorterList';
import SchedulingModal from './components/SchedulingModal';
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
  Dumbbell,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
  Calculator,
  PieChart,
  MapPin,
  ShieldAlert,
  BarChart3
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
  const [ownerClickCount, setOwnerClickCount] = useState(0);
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  
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

  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [porters, setPorters] = useState<PorterService[]>([
    { id: 'p1', name: 'Day Porter', quantity: 0, hoursPerDay: 8 }
  ]);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockEmail, setUnlockEmail] = useState('');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);

  const quoteSectionRef = useRef<HTMLDivElement>(null);
  const insightsSectionRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  const quote = useMemo(() => calculateQuote(settings, rooms, porters), [settings, rooms, porters]);

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    const newCount = ownerClickCount + 1;
    setOwnerClickCount(newCount);
    if (newCount === 5) {
      setIsOwnerMode(!isOwnerMode);
      setOwnerClickCount(0);
    }
  };

  const scrollTo = (ref: React.RefObject<HTMLElement | null>, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
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
    const industryPresets = PRESET_ROOMS[industry] || [];
    const initialRooms: RoomType[] = industryPresets.map((p, idx) => ({ 
      id: `init-${idx}`, 
      name: p.name, 
      quantity: 0, 
      minutesPerRoom: p.minutesPerRoom 
    }));
    setRooms(initialRooms);
    setWizardStep('objective');
  };

  const selectObjective = (serviceType: ServiceType) => {
    setSettings(prev => ({ ...prev, serviceType }));
    setWizardStep('calculator');
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnlocking) return;
    setIsUnlocking(true);
    try {
      await leadService.submitLead({
        name: "Quick Unlock",
        email: unlockEmail,
        company: "Website Inquiry",
        funnel_stage: 'UNLOCK',
        industry: settings.industry,
        quote_total: formatCurrency(quote.grandTotal)
      });
      setIsUnlocked(true);
    } catch (err) {
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
    <div className={`min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-accent selection:text-white transition-all duration-300 ${isOwnerMode ? 'border-[6px] border-amber-400' : ''}`}>
      
      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white shadow-xl py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogoClick}>
            <LogoIcon className="w-10 h-10" light={!isScrolled} />
            <div className="flex flex-col">
              <span className={`font-black text-lg uppercase leading-none ${isScrolled ? 'text-slate-900' : 'text-white'}`}>TFS MANAGED</span>
              <span className={`text-[8px] tracking-[0.4em] font-black uppercase ${isScrolled ? 'text-brand-accent' : 'text-white/60'}`}>Precision Labor</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={(e) => scrollTo(aboutSectionRef, e)} className={`text-xs font-black uppercase tracking-widest transition-colors ${isScrolled ? 'text-slate-600 hover:text-brand-accent' : 'text-white/80 hover:text-white'}`}>About</button>
            <button onClick={(e) => scrollTo(insightsSectionRef, e)} className={`text-xs font-black uppercase tracking-widest transition-colors ${isScrolled ? 'text-slate-600 hover:text-brand-accent' : 'text-white/80 hover:text-white'}`}>Insights</button>
            <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="bg-brand-accent text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Instant Quote</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative min-h-[95vh] flex items-center pt-20 bg-[#0f172a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-accent/5 rounded-full blur-[150px]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-left w-full">
           <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full animate-in fade-in slide-in-from-top-4 duration-700">
             <span className="w-2 h-2 bg-brand-accentLight rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Footprint: NY • FL • NJ • CT</span>
           </div>
           <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black text-white leading-[0.85] tracking-tighter mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Precision <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight to-teal-200">Facility Labor.</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl max-w-2xl font-medium mb-14 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            We provide strategic labor allocations and managed maintenance models for high-density academic campuses and commercial portfolios.
          </p>
          <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="px-10 py-5 bg-brand-accent text-white font-black rounded-2xl shadow-2xl shadow-brand-accent/30 transition-all flex items-center gap-4 text-lg hover:bg-brand-accentLight active:scale-[0.98]">
              Initialize Quote Engine <ArrowRight size={20} />
            </button>
            <button onClick={(e) => scrollTo(aboutSectionRef, e)} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-lg backdrop-blur-md">
              Learn Methodology
            </button>
          </div>
        </div>
      </header>

      {/* WHY TFS SECTION */}
      <section ref={aboutSectionRef} className="py-32 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-left">
              <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-4 block">The Methodology</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-10">Managed <br />Labor.</h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed mb-10">
                Large facilities fail when labor is unpredictable. Total Facility Services LLC bridges the gap between simple "janitorial" and true infrastructure management.
              </p>
              <div className="space-y-6">
                {[
                  { icon: <ShieldCheck size={24} />, title: "Risk Mitigation", text: "Background checked, GPS-verified staffing protocols." },
                  { icon: <Zap size={24} />, title: "Asset Preservation", text: "Amortized floor and surface care built into daily models." },
                  { icon: <BarChart3 size={24} />, title: "Fiscal Predictability", text: "Transparent monthly budgets with no hidden service bloat." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-accent shrink-0 border border-slate-100">{item.icon}</div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 font-medium">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-accent/5 rounded-[4rem] -rotate-3 translate-x-4 translate-y-4"></div>
              <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Facility Management" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-[#0f172a] text-white p-10 rounded-[3rem] shadow-2xl max-w-xs animate-float">
                <p className="text-4xl font-black text-brand-accent mb-2">100%</p>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">EPA N-List Compliance Verification</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTPRINT STATS */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <p className="text-6xl font-black text-brand-accent mb-2 tracking-tighter">4</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Northeast States</p>
              </div>
              <div>
                <p className="text-6xl font-black text-brand-accent mb-2 tracking-tighter">1.5M+</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Sq Ft Managed</p>
              </div>
              <div>
                <p className="text-6xl font-black text-brand-accent mb-2 tracking-tighter">ISO</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Pathogen Standards</p>
              </div>
              <div>
                <p className="text-6xl font-black text-brand-accent mb-2 tracking-tighter">24/7</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Managed Support</p>
              </div>
           </div>
        </div>
      </section>

      {/* WIZARD SECTION (QUOTE ENGINE) */}
      <section id="quote-section" ref={quoteSectionRef} className="py-32 bg-slate-50 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          {wizardStep === 'industry' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-center">
               <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-4 block">Selection Stage</span>
               <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-16">Sector Expertise.</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
                 {[
                   { id: 'education', icon: <GraduationCap size={40} />, title: 'Education', desc: 'K-12 & University' },
                   { id: 'medical', icon: <Stethoscope size={40} />, title: 'Medical', desc: 'Clinical Portfolios' },
                   { id: 'office', icon: <Building2 size={40} />, title: 'Commercial', desc: 'Class-A Assets' },
                   { id: 'church', icon: <LayoutDashboard size={40} />, title: 'Religious', desc: 'Places of Worship' },
                   { id: 'fitness', icon: <Dumbbell size={40} />, title: 'Wellness', desc: 'Clubs & Studios' },
                   { id: 'daycare', icon: <Users size={40} />, title: 'Daycare', desc: 'Early Childhood' },
                 ].map((item) => (
                   <button key={item.id} onClick={() => selectIndustry(item.id as IndustryType)} className="group p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-brand-accent hover:shadow-2xl transition-all flex flex-col">
                     <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-accent/10 group-hover:text-brand-accent mb-6 transition-all">{item.icon}</div>
                     <h4 className="text-2xl font-black text-slate-900 mb-1">{item.title}</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.desc}</p>
                   </button>
                 ))}
               </div>
            </div>
          )}

          {wizardStep === 'objective' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 text-center">
               <button onClick={() => setWizardStep('industry')} className="text-brand-accent text-[10px] font-black uppercase tracking-widest mb-6 inline-flex items-center gap-2 hover:translate-x-[-4px] transition-transform"><ChevronLeft size={14} /> Back</button>
               <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-16">Objective.</h2>
               <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 <button onClick={() => selectObjective('recurring')} className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] text-left hover:border-brand-accent hover:shadow-2xl transition-all">
                   <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-brand-accent mb-8"><Calendar size={32} /></div>
                   <h4 className="text-3xl font-black mb-4">Recurring Model</h4>
                   <p className="text-slate-500 font-medium">Daily managed labor at a fixed monthly budget.</p>
                 </button>
                 <button onClick={() => selectObjective('onetime')} className="p-10 bg-[#0f172a] text-white border-2 border-slate-800 rounded-[3rem] text-left hover:border-brand-accent hover:shadow-2xl transition-all">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-accent mb-8"><Sparkles size={32} /></div>
                   <h4 className="text-3xl font-black mb-4">Project / RFP</h4>
                   <p className="text-slate-400 font-medium">One-time specific deep clean or site bid.</p>
                 </button>
               </div>
            </div>
          )}

          {wizardStep === 'calculator' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="flex justify-between items-center mb-12 pb-6 border-b border-slate-200">
                 <button onClick={() => setWizardStep('objective')} className="text-slate-400 hover:text-slate-900 flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"><ChevronLeft size={16}/> Back</button>
                 <div className="px-4 py-2 bg-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">{settings.industry} • {settings.serviceType}</div>
               </div>
               
               <div className="grid lg:grid-cols-12 gap-12 text-left">
                  <div className="lg:col-span-8 space-y-12">
                    
                    {/* OWNER DASHBOARD (HIDDEN) */}
                    {isOwnerMode && quote.internal && (
                      <div className="bg-amber-50 border-2 border-amber-200 rounded-[3rem] p-10 md:p-14 space-y-10 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between items-center border-b border-amber-200 pb-6">
                           <h3 className="text-2xl font-black text-amber-900 flex items-center gap-3">
                              <Calculator size={28} /> Logistics Engine (Internal)
                           </h3>
                           <div className="text-right">
                              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Monthly Load</p>
                              <p className="text-2xl font-black text-amber-900">{quote.internal.totalMonthlyHours.toFixed(1)} Hours</p>
                           </div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
                           <div className="bg-white p-6 rounded-3xl border border-amber-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Internal Labor Cost</p>
                              <p className="text-xl font-black text-slate-900">{formatCurrency(quote.internal.laborCost)}</p>
                           </div>
                           <div className="bg-white p-6 rounded-3xl border border-amber-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Supplies (3%)</p>
                              <p className="text-xl font-black text-slate-900">{formatCurrency(quote.internal.suppliesCost)}</p>
                           </div>
                           <div className="bg-white p-6 rounded-3xl border border-amber-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overhead (5%)</p>
                              <p className="text-xl font-black text-slate-900">{formatCurrency(quote.internal.overheadCost)}</p>
                           </div>
                           <div className="bg-amber-900 p-6 rounded-3xl text-white shadow-xl shadow-amber-900/20">
                              <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest mb-1">Net Profit (20%)</p>
                              <p className="text-xl font-black">{formatCurrency(quote.internal.netProfit)}</p>
                              <div className="mt-2 text-[10px] font-bold text-amber-200 bg-white/10 rounded px-2 py-0.5 inline-block">
                                {quote.internal.profitMargin.toFixed(1)}% Margin
                              </div>
                           </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-14">
                      <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                        <span className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-brand-accent font-bold">1</span>
                        Model Parameters
                      </h3>
                      
                      <div className="space-y-12">
                        {settings.industry === 'education' && (
                           <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-10">
                              <div className="flex justify-between items-end">
                                <h4 className="text-xl font-black">Campus Footprint</h4>
                                <span className="text-3xl font-black text-brand-accent">{settings.squareFootage.toLocaleString()} <span className="text-sm text-slate-400">Sq Ft</span></span>
                              </div>
                              <input type="range" min="5000" max="250000" step="5000" value={settings.squareFootage} onChange={e => setSettings({...settings, squareFootage: parseInt(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                           </div>
                        )}
                        
                        {settings.industry === 'church' && (
                           <div className="space-y-8 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                              <div className="flex justify-between items-end">
                                <h4 className="text-xl font-black">Sanctuary Capacity</h4>
                                <span className="text-3xl font-black text-brand-accent">{settings.churchCapacity} Seats</span>
                              </div>
                              <input type="range" min="50" max="2500" step="50" value={settings.churchCapacity} onChange={e => setSettings({...settings, churchCapacity: parseInt(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                           </div>
                        )}

                        {settings.industry === 'fitness' && (
                           <div className="space-y-8 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                              <div className="flex justify-between items-end">
                                <h4 className="text-xl font-black">Shower Heads</h4>
                                <span className="text-3xl font-black text-brand-accent">{settings.showerCount} Units</span>
                              </div>
                              <input type="range" min="0" max="60" step="1" value={settings.showerCount} onChange={e => setSettings({...settings, showerCount: parseInt(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                           </div>
                        )}

                        {!['education', 'church', 'fitness'].includes(settings.industry) && (
                          <div className="space-y-8">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Approximate Square Footage</label>
                            <div className="text-4xl font-black text-brand-accent">{settings.squareFootage.toLocaleString()} SQ FT</div>
                            <input type="range" min="1000" max="100000" step="1000" value={settings.squareFootage} onChange={e => setSettings({...settings, squareFootage: parseInt(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                          </div>
                        )}

                        <RoomList rooms={rooms} onChange={setRooms} industry={settings.industry} />
                        <PorterList porters={porters} onChange={setPorters} />
                      </div>
                    </div>
                  </div>

                  <aside className="lg:col-span-4 lg:sticky lg:top-32">
                    {!isUnlocked ? (
                      <div className="bg-[#0f172a] text-white p-12 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent animate-pulse"></div>
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-brand-accent"><Lock size={32}/></div>
                        <div className="text-center">
                          <h4 className="text-3xl font-black mb-4">Labor Model Ready</h4>
                          <p className="text-slate-400 text-sm font-medium">Enter email to reveal the target monthly budget for this {settings.industry} facility.</p>
                        </div>
                        <form onSubmit={handleUnlock} className="space-y-4">
                           <input required type="email" placeholder="Corporate Email" value={unlockEmail} onChange={(e) => setUnlockEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-white outline-none focus:border-brand-accent" />
                           <button type="submit" disabled={isUnlocking} className="w-full bg-brand-accent hover:bg-brand-accentLight py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all">
                             {isUnlocking ? <Loader2 className="animate-spin mx-auto" size={16}/> : 'Reveal Quote'}
                           </button>
                        </form>
                      </div>
                    ) : (
                      <div className="bg-[#0f172a] text-white p-12 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500">
                        <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Calculated Target Budget</span>
                        <div className="text-6xl font-black tracking-tighter mb-10">{formatCurrency(quote.grandTotal)}</div>
                        <div className="space-y-4 mb-10">
                          {quote.breakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-3">
                              <span className="text-slate-400 uppercase font-bold">{item.label}</span>
                              <span className="font-black text-teal-400">{formatCurrency(item.value)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                          <p className="text-[11px] text-slate-400 italic font-medium">"{quote.justification}"</p>
                        </div>
                        <div className="space-y-4">
                           <button onClick={() => setIsSchedulerOpen(true)} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 shadow-xl transition-all">Schedule site audit</button>
                           <button onClick={resetApp} className="w-full py-4 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Start New Quote</button>
                        </div>
                      </div>
                    )}
                  </aside>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTPRINT / MAPS CONCEPTUAL SECTION */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="order-2 lg:order-1 relative">
                <div className="bg-slate-50 aspect-[4/3] rounded-[3rem] overflow-hidden border border-slate-100 shadow-inner flex items-center justify-center group">
                   <div className="text-center p-12">
                     <MapPin size={48} className="text-brand-accent mx-auto mb-6 group-hover:scale-110 transition-transform"/>
                     <h4 className="text-2xl font-black mb-4">Regional Portfolios</h4>
                     <p className="text-slate-500 font-medium">We maintain a strategic workforce across the NY Metro, Florida, New Jersey, and Connecticut corridors.</p>
                   </div>
                </div>
             </div>
             <div className="order-1 lg:order-2 text-left">
                <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-4 block">Deployment</span>
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-10">Tri-State <br />Coverage.</h2>
                <p className="text-slate-500 text-xl font-medium leading-relaxed mb-8">
                  Our managed model is designed for multi-site facility directors who need uniform performance across their entire regional footprint.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   {['New York', 'Florida', 'New Jersey', 'Connecticut'].map(state => (
                     <div key={state} className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-800 flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-brand-accent"/> {state}
                     </div>
                   ))}
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section id="insights" ref={insightsSectionRef} className="py-32 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="text-left max-w-2xl">
              <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-4 block">Intelligence</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">Sector <br />Analysis.</h2>
            </div>
            <p className="text-slate-500 font-medium text-lg max-w-sm text-left">How managed labor models protect facility assets in multi-site portfolios.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {BLOG_POSTS.map((post) => (
              <div key={post.id} className="group relative bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:border-brand-accent/30 transition-all shadow-sm hover:shadow-xl">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-10 text-left">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 bg-brand-accent/10 text-brand-accent rounded-full text-[10px] font-black uppercase tracking-widest">{post.category}</span>
                    <span className="text-slate-400 text-[10px] font-bold flex items-center gap-2"><Clock size={12}/> {post.readTime}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-brand-accent transition-colors">{post.title}</h3>
                  <p className="text-slate-500 font-medium mb-8 line-clamp-2">{post.excerpt}</p>
                  <button onClick={() => setActiveBlogPost(post)} className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-[11px] group-hover:gap-5 transition-all">
                    Read Analysis <ChevronRight size={16} className="text-brand-accent"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 text-left">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <LogoIcon className="w-12 h-12" light={true} />
              <span className="font-black text-2xl tracking-tighter uppercase">TFS MANAGED</span>
            </div>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">We provide strategic labor allocations for prestigious campuses and portfolios across the Tri-State.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-white text-[10px] uppercase tracking-widest font-black">Support Hotlines</h4>
            <p className="text-brand-accent text-3xl font-black tracking-tighter">(844) 454-3101</p>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black leading-loose">
              NY • FL • NJ • CT <br />
              © 2024 Total Facility Services LLC.
            </p>
          </div>
        </div>
      </footer>

      <SchedulingModal isOpen={isSchedulerOpen} onClose={() => setIsSchedulerOpen(false)} />
      <BlogReader post={activeBlogPost} onClose={() => setActiveBlogPost(null)} />
    </div>
  );
};

export default App;
