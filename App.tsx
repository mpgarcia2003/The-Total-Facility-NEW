
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PricingSettings, 
  RoomType, 
  PorterService,
  ClientInfo, 
  QuoteCalculations,
  IndustryType,
  ServiceType
} from './types';
import { calculateQuote } from './utils/pricing';
import { formatCurrency } from './utils/format';
import emailjs from '@emailjs/browser';

// Components
import RoomList from './components/RoomList';
import PorterList from './components/PorterList';
import LeadForm from './components/LeadForm';
import SchedulingModal from './components/SchedulingModal';
import IndustryExplainerModal from './components/IndustryExplainerModal';
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
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
  Phone,
  X,
  Clock,
  AlertCircle
} from './components/ui/Icons';

const LogoIcon = ({ className = "w-10 h-10", light = false }: { className?: string, light?: boolean }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
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
    buildingSize: 'medium',
    retailSize: 'medium',
    laborHoursPerDay: 8,
    warehouseScrubbingSqFt: 5000
  });

  const [rooms, setRooms] = useState<RoomType[]>([
    { id: '1', name: 'Classroom', quantity: 15, minutesPerRoom: 15 },
    { id: '2', name: 'Hallway/Corridor', quantity: 4, minutesPerRoom: 30 },
    { id: '3', name: 'Restroom', quantity: 6, minutesPerRoom: 20 }
  ]);

  const [porters, setPorters] = useState<PorterService[]>([
    { id: 'p1', name: 'Day Porter', quantity: 1, hoursPerDay: 8 }
  ]);

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    address: '123 Sample Avenue, New York, NY', 
    email: '',
    phone: ''
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [activeIndustryExplainer, setActiveIndustryExplainer] = useState<string | null>(null);

  const quoteSectionRef = useRef<HTMLDivElement>(null);
  const industriesSectionRef = useRef<HTMLDivElement>(null);
  const processSectionRef = useRef<HTMLDivElement>(null);

  const quote = useMemo(() => calculateQuote(settings, rooms, porters), [settings, rooms, porters]);

  useEffect(() => {
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
    setWizardStep('objective');
  };

  const selectObjective = (serviceType: ServiceType) => {
    setSettings(prev => ({ ...prev, serviceType }));
    setWizardStep('calculator');
  };

  const resetApp = () => {
    setWizardStep('industry');
    setIsUnlocked(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden">
      
      {/* NAVIGATION BAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-2xl shadow-xl py-3 border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <LogoIcon className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110" light={!isScrolled} />
            <div className="flex flex-col">
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
            <button onClick={(e) => scrollTo(industriesSectionRef, e)} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isScrolled ? 'text-slate-600' : 'text-white'}`}>Industries</button>
            <button onClick={(e) => scrollTo(processSectionRef, e)} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isScrolled ? 'text-slate-600' : 'text-white'}`}>Process</button>
            <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="bg-gradient-to-r from-brand-accent to-brand-accentLight text-white px-6 py-3 rounded-xl text-[10px] font-black shadow-lg uppercase tracking-widest">
              Get A Monthly Estimate
            </button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2">
            {isMobileMenuOpen ? <X className={isScrolled ? 'text-slate-900' : 'text-white'} /> : <div className="space-y-1.5"><div className={`w-6 h-0.5 ${isScrolled ? 'bg-slate-900' : 'bg-white'}`}></div><div className={`w-4 h-0.5 ${isScrolled ? 'bg-slate-900' : 'bg-white'}`}></div><div className={`w-6 h-0.5 ${isScrolled ? 'bg-slate-900' : 'bg-white'}`}></div></div>}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"></div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[160px] translate-x-1/3"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
             <h1 className="text-6xl sm:text-8xl lg:text-[110px] font-black text-white leading-[0.85] tracking-tighter">
              Everything <br />Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight via-teal-200 to-white">Building Needs.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
              Precision facility maintenance for NY, FL, NJ, & CT. Managed labor models delivered as a single, all-inclusive monthly budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="group px-10 py-5 bg-brand-accent text-white font-black rounded-2xl shadow-xl shadow-brand-accent/20 transition-all flex items-center justify-center gap-4 text-lg">
                Build Monthly Budget <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setIsSchedulerOpen(true)} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-lg">
                Request Assessment
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative">
             <div className="p-3 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-sm relative">
               <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" className="rounded-[2.8rem] w-full h-[600px] object-cover" alt="Modern Office" />
               <div className="absolute bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl flex items-center gap-4 animate-float">
                 <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-brand-accent"><GraduationCap size={24}/></div>
                 <div><div className="text-2xl font-black text-slate-900">35+ Years</div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Precision</div></div>
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* SERVICE VERTICALS */}
      <section ref={industriesSectionRef} className="py-32 bg-[#f8fafc] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-24 items-start">
             <div>
               <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Service Verticals</span>
               <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">Demanding Spaces. <br />Expert Care.</h2>
               <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">We specialize in sectors with strict compliance requirements. Our models are built to pass property manager and procurement audits.</p>
               
               <div className="space-y-4">
                 {[
                   { id: 'education', label: 'Education & Schools', desc: 'Child-safe sanitation for Tri-State campuses.', icon: <GraduationCap size={18}/> },
                   { id: 'office', label: 'Commercial Office', desc: 'Class-A high-polish lobby & suite maintenance.', icon: <Building2 size={18}/> },
                   { id: 'medical', label: 'Clinical & Healthcare', desc: 'Sterile environment protocols and terminal cleaning.', icon: <Stethoscope size={18}/> },
                   { id: 'hoa', label: 'HOA & Residential', desc: 'Multi-site management for housing groups.', icon: <Users size={18}/> },
                 ].map(item => (
                   <button key={item.id} onClick={() => { selectIndustry(item.id as IndustryType); scrollTo(quoteSectionRef); }} className="w-full text-left group flex items-center gap-6 p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                     <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-brand-accent transition-all">
                       {item.icon}
                     </div>
                     <div>
                       <h4 className="font-black text-slate-900 text-lg">{item.label}</h4>
                       <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
                     </div>
                   </button>
                 ))}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-6 pt-12">
                <div className="space-y-6">
                  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 mt-12">
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-brand-accent mb-8"><GraduationCap size={24}/></div>
                    <h4 className="text-xl font-black text-slate-900 mb-4">Education and Schools</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">Daily child-safe sanitation with zero-incident tracking.</p>
                  </div>
                  <div className="bg-[#0f172a] p-10 rounded-[3rem] shadow-xl">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-accent mb-8"><Zap size={24}/></div>
                    <h4 className="text-xl font-black text-white mb-4">Regional Scale</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">Seamlessly managing portfolios across NY, FL, NJ, & CT.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-brand-accent p-10 rounded-[3rem] shadow-xl text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8"><ShieldCheck size={24}/></div>
                    <h4 className="text-xl font-black mb-4">Compliance</h4>
                    <p className="text-sm text-white/80 leading-relaxed font-medium">Strict OSHA and EPA compliance reporting for every site visit.</p>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8"><ArrowRight size={24}/></div>
                    <h4 className="text-xl font-black text-slate-900 mb-4">Rapid Response</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">Dedicated account managers and 24/7 priority emergency support.</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* EXECUTION MODEL */}
      <section ref={processSectionRef} className="py-32 bg-white border-y border-slate-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-24">
             <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Our Execution Model</span>
             <h2 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter">Managed Excellence.</h2>
             <p className="text-lg text-slate-500 mt-6 font-medium">How we deploy precision maintenance to your facility.</p>
           </div>
           
           <div className="grid md:grid-cols-4 gap-8">
             {[
               { n: '01', t: 'Precision Budgeting', d: 'Our algorithm creates a fixed-cost monthly labor plan tailored to your square footage.', i: <Layers size={32}/> },
               { n: '02', t: 'Deployment Phase', d: 'Background-checked, sector-specific crews are trained on your site\'s compliance rules.', i: <Calendar size={32}/> },
               { n: '03', t: 'Compliance Sync', d: 'Real-time auditing and reporting ensures strict OSHA/EPA sanitation standards.', i: <ShieldCheck size={32}/> },
               { n: '04', t: 'Ongoing Precision', d: 'A single monthly invoice covers all daily labor and periodic specialty work.', i: <Clock size={32}/> },
             ].map((step, idx) => (
               <div key={idx} className="group p-10 rounded-[2.5rem] bg-white border border-slate-50 shadow-sm hover:shadow-2xl hover:border-brand-accent/20 transition-all relative overflow-hidden">
                 <div className="text-7xl font-black text-slate-50 absolute -top-4 -right-4 group-hover:text-teal-50 transition-colors">{step.n}</div>
                 <div className="relative z-10">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-teal-50 group-hover:text-brand-accent transition-all mb-10">
                     {step.i}
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 mb-4">{step.t}</h4>
                   <p className="text-sm text-slate-400 leading-relaxed font-bold">{step.d}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* QUOTE SECTION */}
      <section id="quote-section" ref={quoteSectionRef} className="py-32 bg-slate-50 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* STEP 1: INDUSTRY */}
          {wizardStep === 'industry' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="text-center mb-16">
                 <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-4 block">Step 1 of 3</span>
                 <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">Tell us about your space.</h2>
                 <p className="text-slate-500 mt-4 font-medium text-lg">What type of facility are we managing?</p>
               </div>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                 {[
                   { id: 'education', icon: <GraduationCap size={40} />, title: 'Education', desc: 'K-12 & University' },
                   { id: 'office', icon: <Building2 size={40} />, title: 'Class-B Office', desc: 'Mixed-Use Portfolios' },
                   { id: 'medical', icon: <Stethoscope size={40} />, title: 'Medical/Clinical', desc: 'Clinics & Specialized' },
                   { id: 'retail', icon: <Store size={40} />, title: 'Retail Stores', desc: 'Stores & Big Box' },
                   { id: 'hoa', icon: <Users size={40} />, title: 'HOA/Apartments', desc: 'Common Area Care' },
                   { id: 'hotel', icon: <Hotel size={40} />, title: 'Hotels', desc: 'BOH & Public Area' },
                   { id: 'warehouse', icon: <Warehouse size={40} />, title: 'Warehouse', desc: 'Logistics/Ind.' },
                   { id: 'government', icon: <GanttChartSquare size={40} />, title: 'Government', desc: 'Municipal/Public' },
                 ].map((item) => (
                   <button 
                    key={item.id} 
                    onClick={() => selectIndustry(item.id as IndustryType)}
                    className="group flex flex-col items-center text-center p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-brand-accent hover:shadow-2xl hover:shadow-brand-accent/10 transition-all"
                   >
                     <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-brand-accent/10 group-hover:text-brand-accent mb-6 transition-all">
                       {item.icon}
                     </div>
                     <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                   </button>
                 ))}
               </div>
            </div>
          )}

          {/* STEP 2: OBJECTIVE */}
          {wizardStep === 'objective' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
               <div className="text-center mb-16">
                 <button onClick={() => setWizardStep('industry')} className="text-brand-accent text-[10px] font-black uppercase tracking-widest mb-6 inline-flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                   <ChevronLeft size={14} /> Back to Industry
                 </button>
                 <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-4 block">Step 2 of 3</span>
                 <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">What is your objective?</h2>
               </div>
               <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 <button onClick={() => selectObjective('recurring')} className="group p-12 bg-white border-2 border-slate-100 rounded-[3rem] text-left hover:border-brand-accent hover:shadow-2xl transition-all">
                   <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-brand-accent mb-8"><Calendar size={32} /></div>
                   <h4 className="text-3xl font-black text-slate-900 mb-4">Recurring Maintenance</h4>
                   <p className="text-slate-500 font-medium leading-relaxed mb-8 text-lg">Daily precision maintenance delivered as a fixed monthly budget.</p>
                   <div className="text-brand-accent text-xs font-black uppercase tracking-widest flex items-center gap-2">Build Monthly Plan <ArrowRight size={14} /></div>
                 </button>
                 <button onClick={() => selectObjective('onetime')} className="group p-12 bg-[#0f172a] text-white border-2 border-slate-800 rounded-[3rem] text-left hover:border-brand-accent hover:shadow-2xl transition-all">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-accent mb-8"><Sparkles size={32} /></div>
                   <h4 className="text-3xl font-black mb-4">One-Time Project</h4>
                   <p className="text-slate-400 font-medium leading-relaxed mb-8 text-lg">Deep cleans or restoration. Single project flat-fee estimates.</p>
                   <div className="text-brand-accent text-xs font-black uppercase tracking-widest flex items-center gap-2">Get Project Quote <ArrowRight size={14} /></div>
                 </button>
               </div>
            </div>
          )}

          {/* STEP 3: CALCULATOR */}
          {wizardStep === 'calculator' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-200">
                 <div className="flex items-center gap-4">
                    <button onClick={() => setWizardStep('objective')} className="text-slate-400 hover:text-slate-900"><ChevronLeft size={24}/></button>
                    <div className="px-4 py-2 bg-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">{settings.industry} • {settings.serviceType}</div>
                 </div>
                 <button onClick={resetApp} className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest">Start New</button>
               </div>

               <div className="grid lg:grid-cols-12 gap-12 items-start">
                  <div className="lg:col-span-8 space-y-12">
                    
                    {/* SPECIALIZED FORM AREA */}
                    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-14 shadow-sm">
                      <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                        <span className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-bold">1</span>
                        Facility Parameters
                      </h3>

                      <div className="space-y-12">
                        {settings.industry === 'education' && (
                          <div className="space-y-16">
                            <RoomList rooms={rooms} onChange={setRooms} industry="education" />
                            <div className="pt-8 border-t border-slate-100">
                               <PorterList porters={porters} onChange={setPorters} />
                            </div>
                          </div>
                        )}

                        {settings.industry === 'hotel' && (
                           <div className="space-y-12">
                              <div className="p-8 bg-teal-50/50 border border-teal-100 rounded-[2rem] space-y-8">
                                <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                  <Hotel className="text-brand-accent" size={24} />
                                  Back-of-House (BOH) Strategy
                                </h4>
                                <div className="space-y-6">
                                  <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Managed Guest Rooms</label>
                                    <span className="text-3xl font-black text-brand-accent">{settings.hotelRooms} <span className="text-sm text-slate-400">Rooms</span></span>
                                  </div>
                                  <input 
                                    type="range" min="10" max="1000" step="10"
                                    value={settings.hotelRooms} 
                                    onChange={e => setSettings({...settings, hotelRooms: parseInt(e.target.value)})}
                                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                                  />
                                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Pricing: $15.00/room managed monthly labor budget.</p>
                                </div>
                              </div>

                              <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-8">
                                <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                  {/* Changed undefined 'Layout' to 'Layers' */}
                                  <Layers className="text-brand-accent" size={24} />
                                  Front-of-House (FOH) Public Space
                                </h4>
                                <div className="space-y-6">
                                  <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Public Square Footage (Lobbies/Gym/Pool)</label>
                                    <span className="text-3xl font-black text-brand-accent">{settings.squareFootage.toLocaleString()} <span className="text-sm text-slate-400">SQ FT</span></span>
                                  </div>
                                  <input 
                                    type="range" min="1000" max="150000" step="5000"
                                    value={settings.squareFootage} 
                                    onChange={e => setSettings({...settings, squareFootage: parseInt(e.target.value)})}
                                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                                  />
                                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Pricing: $0.17/sqft for high-visibility hospitality maintenance.</p>
                                </div>
                              </div>
                           </div>
                        )}

                        {settings.industry !== 'education' && settings.industry !== 'hotel' && (
                          <div className="space-y-12">
                            {/* OFFICE / MEDICAL / WAREHOUSE: SqFt Model */}
                            {(['office', 'medical', 'warehouse'].includes(settings.industry)) && (
                              <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Square Footage</label>
                                  <span className="text-3xl font-black text-brand-accent">{settings.squareFootage.toLocaleString()} <span className="text-sm text-slate-400">SQ FT</span></span>
                                </div>
                                <input 
                                  type="range" min="1000" max="100000" step="1000"
                                  value={settings.squareFootage} 
                                  onChange={e => setSettings({...settings, squareFootage: parseInt(e.target.value)})}
                                  className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                                />
                              </div>
                            )}

                            {/* RETAIL: Visit Model */}
                            {settings.industry === 'retail' && (
                              <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store Scale</label>
                                  <div className="grid gap-3">
                                    {[
                                      { id: 'small', label: 'Small Retail', d: '1-3k sqft' },
                                      { id: 'medium', label: 'Mid-Market', d: '3-7k sqft' },
                                      { id: 'large', label: 'Big Box', d: '7k+ sqft' },
                                    ].map(tier => (
                                      <button key={tier.id} onClick={() => setSettings({...settings, retailSize: tier.id as any})} className={`p-6 rounded-2xl text-left border-2 transition-all ${settings.retailSize === tier.id ? 'border-brand-accent bg-teal-50 text-teal-800' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                                        <div className="font-black">{tier.label}</div>
                                        <div className="text-[10px] font-bold opacity-60 uppercase">{tier.d}</div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-6">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cleaning Frequency</label>
                                  <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 5, 7].map(num => (
                                      <button key={num} onClick={() => setSettings({...settings, frequencyPerWeek: num})} className={`py-6 rounded-2xl font-black transition-all ${settings.frequencyPerWeek === num ? 'bg-brand-accent text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                                        {num}x
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* HOA: Building Tier */}
                            {settings.industry === 'hoa' && (
                              <div className="space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Building Classification</label>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {[
                                    { id: 'small', label: 'Small Bldgs (2-4 Fl)', d: '$750-1,500/mo' },
                                    { id: 'medium', label: 'Mid-Rise (5-12 Fl)', d: '$1,800-3,500/mo' },
                                    { id: 'large', label: 'High-Rise (13+ Fl)', d: '$3,500-5,000/mo' },
                                    { id: 'luxury', label: 'Luxury Portfolio', d: '$4,000-7,000/mo' },
                                  ].map(tier => (
                                    <button key={tier.id} onClick={() => setSettings({...settings, buildingSize: tier.id as any})} className={`p-8 rounded-[2rem] text-left border-2 flex justify-between items-center transition-all ${settings.buildingSize === tier.id ? 'border-brand-accent bg-teal-50 text-teal-800' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                                      <div><div className="font-black text-lg mb-1">{tier.label}</div><div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{tier.d}</div></div>
                                      {settings.buildingSize === tier.id && <CheckCircle2 size={24}/>}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* WAREHOUSE / GOVT: Labor Hours */}
                            {(settings.industry === 'warehouse' || settings.industry === 'government') && (
                              <div className="space-y-10">
                                <div className="space-y-6">
                                  <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Required Daily Labor</label>
                                    <span className="text-3xl font-black text-brand-accent">{settings.laborHoursPerDay} <span className="text-sm text-slate-400">HRS / DAY</span></span>
                                  </div>
                                  <input 
                                    type="range" min="4" max="40" step="2"
                                    value={settings.laborHoursPerDay} 
                                    onChange={e => setSettings({...settings, laborHoursPerDay: parseInt(e.target.value)})}
                                    className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                                  />
                                </div>
                                {settings.industry === 'warehouse' && (
                                  <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Periodic Floor Scrubbing</label>
                                      <span className="text-3xl font-black text-brand-accent">{settings.warehouseScrubbingSqFt.toLocaleString()} <span className="text-sm text-slate-400">SQ FT</span></span>
                                    </div>
                                    <input 
                                      type="range" min="0" max="100000" step="5000"
                                      value={settings.warehouseScrubbingSqFt} 
                                      onChange={e => setSettings({...settings, warehouseScrubbingSqFt: parseInt(e.target.value)})}
                                      className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-12">
                      <LeadForm 
                        quote={quote as any} 
                        clientInfo={clientInfo} 
                        industry={settings.industry} 
                        serviceType={settings.serviceType} 
                        rooms={rooms} 
                        onSubmit={() => {}} 
                        onSchedule={() => setIsSchedulerOpen(true)} 
                        onReset={resetApp}
                      />
                    </div>
                  </div>

                  {/* QUOTE SIDEBAR */}
                  <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
                    {!isUnlocked ? (
                      <div className="bg-[#0f172a] text-white p-12 rounded-[3rem] shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-brand-accent border border-white/10"><Lock size={40}/></div>
                        <div>
                          <h4 className="text-3xl font-black tracking-tighter mb-4">Estimate Ready</h4>
                          <p className="text-slate-400 font-medium">We've calculated a middle-market NYC/Tri-State budget for your facility.</p>
                        </div>
                        <button onClick={() => setIsUnlocked(true)} className="w-full bg-brand-accent hover:bg-brand-accentLight py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-accent/20 transition-all">Unlock Detailed Quote</button>
                      </div>
                    ) : (
                      <div className="bg-[#0f172a] text-white p-12 rounded-[3rem] shadow-2xl border border-white/5 animate-in zoom-in-95 duration-500">
                        <div className="space-y-10">
                          <div>
                            <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Monthly Managed Budget</span>
                            <div className="text-5xl font-black tracking-tighter break-words">
                              {formatCurrency(quote.grandTotal)}
                              {settings.serviceType === 'recurring' && <span className="text-xl text-slate-500 ml-1">/mo</span>}
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
                            <div className="flex items-center gap-2 text-teal-400"><Info size={14}/><span className="text-[10px] font-black uppercase tracking-widest">{quote.method}</span></div>
                            <p className="text-[11px] text-slate-400 italic leading-relaxed font-medium">"{quote.justification}"</p>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-[8px] text-slate-600 font-black uppercase tracking-[0.3em] pt-6 border-t border-white/5">
                            <ShieldCheck size={12}/> Managed Precision • Fixed Pricing
                          </div>
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
      <footer className="bg-[#0f172a] text-white py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <LogoIcon className="w-12 h-12" light={true} />
              <span className="font-black text-2xl tracking-tighter uppercase">TOTAL FACILITY SERVICES LLC</span>
            </div>
            <p className="text-slate-400 text-lg font-medium max-w-sm">Enterprise maintenance for Tri-State portfolios. Predictable budgets, elite execution.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-12 text-slate-400 font-bold">
            <div className="space-y-4">
              <h4 className="text-white text-xs uppercase tracking-widest">Contact</h4>
              <p className="text-brand-accent text-3xl font-black tracking-tighter">(844) 454-3101</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest">© 2024 Total Facility Services LLC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <SchedulingModal isOpen={isSchedulerOpen} onClose={() => setIsSchedulerOpen(false)} />
      <IndustryExplainerModal industryId={activeIndustryExplainer} onClose={() => setActiveIndustryExplainer(null)} />
    </div>
  );
};

export default App;
