import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PricingSettings, 
  RoomType, 
  PorterService, 
  ClientInfo, 
  QuoteCalculations 
} from './types';
import { DEFAULT_PRICING_SETTINGS, DEFAULT_ROOMS, DEFAULT_PORTERS } from './constants';
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
  MapPin, 
  Sparkles, 
  ArrowRight, 
  LayoutDashboard, 
  Lock, 
  Mail, 
  CheckCircle2,
  Building2,
  Users,
  ShieldCheck,
  Zap,
  Globe,
  GraduationCap,
  Stethoscope,
  ChevronDown,
  Phone,
  X,
  Clock,
  DollarSign,
  Minus,
  AlertCircle,
  ChevronRight,
  Calculator,
  Calendar
} from './components/ui/Icons';

const EMAILJS_PUBLIC_KEY = "4ye26ZtWxpi6Pkk5f";
const EMAILJS_SERVICE_ID = "service_srv6b3k"; 
const EMAILJS_TEMPLATE_ID_VERIFY = "template_mtm1oef"; 

const LogoIcon = ({ className = "w-10 h-10", light = false }: { className?: string, light?: boolean }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="15" width="20" height="20" rx="4" fill={light ? "white" : "#0d9488"} />
    <rect x="20" y="55" width="20" height="20" rx="4" fill={light ? "white" : "#cbd5e1"} fillOpacity={light ? "0.3" : "1"} />
  </svg>
);

const App: React.FC = () => {
  const [settings, setSettings] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);
  const [rooms, setRooms] = useState<RoomType[]>(DEFAULT_ROOMS); 
  const [porters, setPorters] = useState<PorterService[]>(DEFAULT_PORTERS);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    address: '123 Sample Avenue, New York, NY', 
    email: '',
    phone: '',
    walkthroughDate: new Date().toISOString().split('T')[0]
  });

  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [activeIndustryExplainer, setActiveIndustryExplainer] = useState<string | null>(null);

  const [isQuoteUnlocked, setIsQuoteUnlocked] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'email' | 'code'>('email');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);

  const quoteSectionRef = useRef<HTMLDivElement>(null);
  const industriesSectionRef = useRef<HTMLDivElement>(null);
  const processSectionRef = useRef<HTMLDivElement>(null);

  const hasRooms = useMemo(() => rooms.some(r => r.quantity > 0), [rooms]);
  const hasAddress = useMemo(() => clientInfo.address.trim().length > 5, [clientInfo.address]);
  const isConfigComplete = hasRooms && hasAddress;

  const quote = useMemo(() => {
    return calculateQuote(rooms, porters, settings);
  }, [rooms, porters, settings]);

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

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationEmail || !isConfigComplete) return;
    setIsSendingCode(true);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_VERIFY, {
        to_email: verificationEmail,
        code: code,
        name: clientInfo.name || "Valued Client",
      }, EMAILJS_PUBLIC_KEY);
      setVerificationStep('code');
    } catch (error) {
      alert(`Access code for testing: ${code}`);
      setVerificationStep('code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === verificationCode) {
      setIsQuoteUnlocked(true);
      setClientInfo(prev => ({ ...prev, email: verificationEmail }));
    } else {
      alert("Invalid code.");
      setInputCode('');
    }
  };

  const resetApp = () => {
    setRooms(DEFAULT_ROOMS);
    setPorters(DEFAULT_PORTERS);
    setClientInfo({
      name: '',
      address: '123 Sample Avenue, New York, NY', 
      email: '',
      phone: '',
      walkthroughDate: new Date().toISOString().split('T')[0]
    });
    setIsQuoteUnlocked(false);
    setVerificationStep('email');
    setVerificationEmail('');
    setVerificationCode('');
    setInputCode('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden">
      
      {/* NAVIGATION BAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-2xl shadow-xl py-3 border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <LogoIcon className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110" light={false} />
            <div className="flex flex-col">
              <span className={`font-black text-sm sm:text-lg leading-none tracking-tight uppercase transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                TOTAL FACILITY SERVICES LLC
              </span>
              <span className={`text-[8px] tracking-[0.4em] font-black uppercase transition-opacity duration-300 ${isScrolled ? 'text-brand-accent opacity-100' : 'text-white opacity-60'}`}>Managed Precision</span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="tel:8444543101" className={`flex items-center gap-2 text-xs font-black transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              <Phone size={14} className="text-brand-accent" /> (844) 454-3101
            </a>
            <button onClick={(e) => scrollTo(industriesSectionRef, e)} className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border rounded-lg transition-all ${isScrolled ? 'text-slate-600 border-slate-200 hover:border-brand-accent hover:text-brand-accent' : 'text-white border-white/20 hover:border-white'}`}>Industries</button>
            <button onClick={(e) => scrollTo(processSectionRef, e)} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isScrolled ? 'text-slate-600 hover:text-brand-accent' : 'text-white/80 hover:text-white'}`}>Process</button>
            <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="bg-gradient-to-r from-brand-accent to-brand-accentLight hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] text-white px-6 py-3 rounded-xl text-[10px] font-black shadow-lg transition-all uppercase tracking-widest">
              Get a Monthly Estimate
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2">
            {isMobileMenuOpen ? <X className={isScrolled ? 'text-slate-900' : 'text-white'} /> : <div className="space-y-1.5"><div className={`w-6 h-0.5 ${isScrolled ? 'bg-slate-900' : 'bg-white'}`}></div><div className={`w-4 h-0.5 ${isScrolled ? 'bg-slate-900' : 'bg-white'}`}></div><div className={`w-6 h-0.5 ${isScrolled ? 'bg-slate-900' : 'bg-white'}`}></div></div>}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-2xl p-8 border-b border-slate-100 flex flex-col gap-6 lg:hidden animate-in slide-in-from-top-4 duration-300">
            <button onClick={(e) => scrollTo(industriesSectionRef, e)} className="text-left font-black uppercase tracking-widest text-slate-600">Industries</button>
            <button onClick={(e) => scrollTo(processSectionRef, e)} className="text-left font-black uppercase tracking-widest text-slate-600">Process</button>
            <a href="tel:8444543101" className="flex items-center gap-3 font-black text-brand-accent"><Phone size={20} /> (844) 454-3101</a>
            <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="bg-brand-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-accent/20">Get a Monthly Estimate</button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <header className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"></div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[160px] translate-x-1/3"></div>
          <div className="absolute inset-0 opacity-5 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 sm:space-y-10">
            <h1 className="text-5xl sm:text-7xl lg:text-[110px] font-black text-white leading-[0.85] tracking-tighter">
              Everything <br className="hidden sm:block" /> Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight via-teal-200 to-white">Building Needs.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
              Precision facility maintenance for NY, FL, NJ, & CT. Managed labor models delivered as a single, all-inclusive monthly budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="group px-8 sm:px-10 py-4 sm:py-5 bg-brand-accent hover:bg-brand-accentLight text-white font-black rounded-2xl shadow-xl shadow-brand-accent/20 transition-all flex items-center justify-center gap-4 text-base sm:text-lg">
                Build Monthly Budget <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setIsSchedulerOpen(true)} className="px-8 sm:px-10 py-4 sm:py-5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-black rounded-2xl transition-all text-base sm:text-lg">
                Request Assessment
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <CheckCircle2 size={14} className="text-brand-accent" /> Fully Insured
              </div>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <MapPin size={14} className="text-brand-accent" /> Tri-State Core
              </div>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-brand-accent" /> OSHA Certified
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative z-10 p-2 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" className="rounded-[2.8rem] w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-110" alt="Facility Management" />
              <div className="absolute bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl animate-float max-w-xs border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                    <GraduationCap size={28} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">35+ Years</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Precision</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SERVICE VERTICALS SECTION */}
      <section ref={industriesSectionRef} className="py-20 sm:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 sm:gap-24 items-center">
            <div>
              <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-6 block">Service Verticals</span>
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 mb-8 leading-[0.95] tracking-tight">
                Demanding <br />Spaces. <br />Expert Care.
              </h2>
              <p className="text-lg sm:text-xl text-slate-500 max-w-md leading-relaxed font-medium mb-12">
                We specialize in sectors with strict compliance requirements. Click a sector below to explore our all-inclusive maintenance strategies.
              </p>
              
              <div className="grid gap-8">
                {[
                  { id: 'education', icon: <GraduationCap size={20} />, title: "Education & Schools", desc: "Child-safe sanitation for tri-state campuses." },
                  { id: 'cre', icon: <Building2 size={20} />, title: "Commercial Office", desc: "Class-A high-polish lobby & suite maintenance." },
                  { id: 'healthcare', icon: <Stethoscope size={20} />, title: "Clinical & Healthcare", desc: "Sterile environment protocols and terminal cleaning." },
                  { id: 'hoa', icon: <Users size={20} />, title: "HOA & Residential", desc: "Multi-site management for housing groups." }
                ].map((item, i) => (
                  <div key={i} onClick={() => setActiveIndustryExplainer(item.id)} className="flex items-center gap-6 group cursor-pointer transition-all hover:translate-x-1">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-brand-accent transition-colors group-hover:bg-brand-accent group-hover:text-white shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-black text-slate-900 text-base sm:text-lg">{item.title}</h4>
                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">View Model <ChevronRight size={12} /></span>
                      </div>
                      <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              <div className="space-y-6 lg:pt-12">
                <div onClick={() => setActiveIndustryExplainer('education')} className="bg-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-50 relative group overflow-hidden h-64 sm:h-72 flex flex-col justify-between cursor-pointer hover:shadow-brand-accent/5 transition-all">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-2">Education and Schools</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-bold leading-relaxed mb-4">Daily child-safe sanitation with zero-incident tracking.</p>
                    <div className="text-[10px] font-black text-brand-accent uppercase tracking-widest flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      View Model <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
                <div className="bg-[#0f172a] p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl text-white h-64 sm:h-72 flex flex-col justify-between">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-teal-400">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-black mb-2">Regional Scale</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-bold leading-relaxed">Seamlessly managing portfolios across NY, FL, NJ, & CT.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-brand-accent p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-brand-accent/30 text-white h-64 sm:h-72 flex flex-col justify-between">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-black mb-2">Compliance</h4>
                    <p className="text-[11px] sm:text-xs text-white/70 font-bold leading-relaxed">Strict OSHA and EPA compliance reporting for every site visit.</p>
                  </div>
                </div>
                <div className="bg-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-50 h-64 sm:h-72 flex flex-col justify-between">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-2">Rapid Response</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-bold leading-relaxed">Dedicated account managers and 24/7 priority emergency support.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section ref={processSectionRef} className="py-20 sm:py-32 bg-[#f8fafc] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16 sm:mb-24">
          <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-6 block">Our Execution Model</span>
          <h2 className="text-4xl sm:text-7xl font-black text-slate-900 mb-8 tracking-tighter">Managed Excellence.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg sm:text-xl font-medium">How we deploy precision maintenance to your facility.</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {[
            { step: "01", icon: <Calculator size={28} />, title: "Precision Budgeting", desc: "Our algorithm creates a fixed-cost monthly labor plan tailored to your square footage." },
            { step: "02", icon: <Calendar size={28} />, title: "Deployment Phase", desc: "Background-checked, sector-specific crews are trained on your site's compliance rules." },
            { step: "03", icon: <ShieldCheck size={28} />, title: "Compliance Sync", desc: "Real-time auditing and reporting ensures strict OSHA/EPA sanitation standards." },
            { step: "04", icon: <Clock size={28} />, title: "Ongoing Precision", desc: "A single monthly invoice covers all daily labor and periodic specialty work." }
          ].map((item, i) => (
            <div key={i} className="relative group p-8 sm:p-10 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2">
              <div className="absolute top-6 right-8 sm:right-10 text-4xl sm:text-5xl font-black text-slate-50 transition-colors group-hover:text-brand-accent group-hover:opacity-10 group-hover:scale-125 duration-500">
                {item.step}
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-accent mb-8 transition-colors group-hover:bg-brand-accent group-hover:text-white shrink-0">
                {item.icon}
              </div>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-4">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE ENGINE SECTION */}
      <section id="quote-section" ref={quoteSectionRef} className="py-20 sm:py-32 bg-white relative scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-7xl font-black text-slate-900 mb-8 tracking-tighter">Your Precision Budget</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xl sm:text-2xl font-medium">Transparent. Fixed. All-inclusive.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-8 space-y-8 lg:space-y-12">
              <div className={`border rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-sm ${hasAddress ? 'border-brand-accent/30 bg-white' : 'border-slate-200 bg-white'}`}>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 lg:mb-10 flex items-center justify-between">
                  <span className="flex items-center gap-4">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">1</span>
                    Facility Details
                  </span>
                  {hasAddress ? <CheckCircle2 className="text-brand-accent shrink-0" size={24} /> : <AlertCircle className="text-amber-500 animate-pulse shrink-0" size={24} />}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 sm:gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Organization</label>
                    <input type="text" placeholder="Organization Name" value={clientInfo.name} onChange={e => setClientInfo({...clientInfo, name: e.target.value})} className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 sm:py-5 px-5 sm:px-7 font-bold outline-none focus:border-brand-accent transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Physical Address</label>
                    <input type="text" placeholder="Physical Address" value={clientInfo.address} onChange={e => setClientInfo({...clientInfo, address: e.target.value})} className={`w-full bg-slate-50/50 border-2 rounded-2xl py-4 sm:py-5 px-5 sm:px-7 font-bold outline-none transition-all ${hasAddress ? 'border-brand-accent/20' : 'border-slate-100 focus:border-brand-accent'}`} />
                  </div>
                </div>
              </div>

              <div className="border-2 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-2xl border-slate-100 bg-white overflow-hidden">
                <RoomList rooms={rooms} onChange={setRooms} />
              </div>

              <div className="bg-slate-50/30 border border-slate-200 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12">
                <PorterList porters={porters} onChange={setPorters} />
              </div>
            </div>

            {/* SIDEBAR - QUOTE OUTPUT */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
              {!isQuoteUnlocked ? (
                <div className="bg-[#0f172a] text-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10 flex flex-col items-center text-center space-y-8 sm:space-y-10">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center transition-all duration-700 ${isConfigComplete ? 'bg-brand-accent/20 border-brand-accent/40 text-brand-accentLight' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                        {isConfigComplete ? <Sparkles size={40} className="animate-pulse" /> : <Lock size={40} />}
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-black tracking-tighter">{isConfigComplete ? 'Unlock Analysis' : 'Configuration'}</h3>
                      
                      {verificationStep === 'email' ? (
                        <form onSubmit={handleSendVerification} className="w-full space-y-5">
                          <input type="email" required disabled={!isConfigComplete} placeholder="Work Email" value={verificationEmail} onChange={(e) => setVerificationEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 sm:py-5 px-6 sm:px-8 text-center font-bold text-white outline-none focus:border-brand-accent" />
                          <button type="submit" disabled={isSendingCode || !isConfigComplete} className={`w-full font-black py-4 sm:py-5 rounded-2xl transition-all uppercase tracking-widest text-xs sm:text-sm ${isConfigComplete ? 'bg-brand-accent text-white shadow-2xl shadow-brand-accent/40' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}>
                            {isSendingCode ? 'Sending...' : 'Request Access Code'}
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyCode} className="w-full space-y-5">
                          <input type="text" required placeholder="4-Digit Code" value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 sm:py-5 px-6 sm:px-8 text-lg text-center tracking-[1em] font-mono outline-none focus:border-brand-accent" />
                          <button type="submit" className="w-full bg-brand-secondary text-white font-black py-4 sm:py-5 rounded-2xl uppercase tracking-widest text-xs sm:text-sm">Verify & Unlock</button>
                        </form>
                      )}
                   </div>
                </div>
              ) : (
                <div className="bg-[#0f172a] text-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-700 border border-white/5 overflow-hidden">
                  <div className="space-y-8 sm:space-y-10">
                    <div>
                      <h3 className="text-brand-accent text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] mb-4">Total Monthly Budget</h3>
                      <div className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white break-words">
                        {formatCurrency(quote.grandTotal)}
                        <span className="text-sm sm:text-base text-slate-500 font-medium ml-2 uppercase tracking-[0.2em]">/mo</span>
                      </div>
                    </div>
                    <div className="h-px bg-white/10"></div>
                    <div className="space-y-6 sm:space-y-8">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-slate-400 font-black uppercase tracking-widest text-[9px] sm:text-[10px] shrink-0">Janitorial Base</span>
                        <span className="font-black text-lg sm:text-xl text-brand-accentLight text-right">{formatCurrency(quote.cleaningTotal + quote.specialtyTotal)}</span>
                      </div>
                      {quote.porterTotal > 0 && (
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-slate-400 font-black uppercase tracking-widest text-[9px] sm:text-[10px] shrink-0">On-Site Porter</span>
                          <span className="font-black text-lg sm:text-xl text-brand-accentLight text-right">{formatCurrency(quote.porterTotal)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-slate-600 text-center font-black uppercase tracking-[0.3em] pt-4 sm:pt-6 border-t border-white/5">Managed Precision • Fixed Budget</p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        <div className="mt-20 sm:mt-32 max-w-5xl mx-auto px-6">
          <LeadForm 
            quote={quote} 
            clientInfo={clientInfo} 
            rooms={rooms}
            initialEmail={isQuoteUnlocked ? verificationEmail : ''}
            onSubmit={() => {}} 
            onSchedule={() => setIsSchedulerOpen(true)}
            onReset={resetApp}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white pt-20 sm:pt-40 pb-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 sm:gap-24">
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <LogoIcon className="w-10 h-10 sm:w-14 sm:h-14" light={false} />
              <span className="font-black text-2xl sm:text-3xl tracking-tighter uppercase">TOTAL FACILITY SERVICES LLC</span>
            </div>
            <p className="text-slate-400 text-lg sm:text-xl font-medium">Everything Your Building Needs. <br /> All in One Place.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent transition-colors"><Globe size={20} /></a>
              <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent transition-colors"><Mail size={20} /></a>
              <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent transition-colors"><Phone size={20} /></a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-12 text-slate-400 font-bold">
            <div className="space-y-6">
              <h4 className="text-white text-xs uppercase tracking-widest">Regions</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><MapPin size={14} className="text-brand-accent" /> NY Metro</li>
                <li className="flex items-center gap-3"><MapPin size={14} className="text-brand-accent" /> Florida</li>
                <li className="flex items-center gap-3"><MapPin size={14} className="text-brand-accent" /> New Jersey</li>
                <li className="flex items-center gap-3"><MapPin size={14} className="text-brand-accent" /> Connecticut</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-white text-xs uppercase tracking-widest">Contact</h4>
              <p className="hover:text-white transition-colors text-sm sm:text-base">info@thetotalfacility.com</p>
              <p className="text-brand-accent text-xl sm:text-2xl font-black">(844) 454-3101</p>
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