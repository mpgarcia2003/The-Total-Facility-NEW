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
  AlertCircle
} from './components/ui/Icons';

const EMAILJS_PUBLIC_KEY = "4ye26ZtWxpi6Pkk5f";
const EMAILJS_SERVICE_ID = "service_srv6b3k"; 
const EMAILJS_TEMPLATE_ID_VERIFY = "template_mtm1oef"; 

// Custom Logo Component based on User's Graphic
const LogoIcon = ({ className = "w-10 h-10", light = false }: { className?: string, light?: boolean }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="15" width="35" height="35" rx="4" fill={light ? "white" : "#cbd5e1"} fillOpacity={light ? "0.3" : "1"} />
    <rect x="20" y="55" width="35" height="35" rx="4" fill={light ? "white" : "#94a3b8"} />
  </svg>
);

// Simple analytics helper
const trackEvent = (eventName: string, params?: object) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
  console.log(`[Analytics] ${eventName}`, params);
};

declare global {
  interface Window {
    gtag: any;
  }
}

const App: React.FC = () => {
  const [settings, setSettings] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);
  const [rooms, setRooms] = useState<RoomType[]>([]); 
  const [porters, setPorters] = useState<PorterService[]>(DEFAULT_PORTERS);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    address: '',
    email: '',
    phone: '',
    walkthroughDate: new Date().toISOString().split('T')[0]
  });

  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [activeIndustryExplainer, setActiveIndustryExplainer] = useState<string | null>(null);

  // --- PRICE LOCK STATE ---
  const [isQuoteUnlocked, setIsQuoteUnlocked] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'email' | 'code'>('email');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);

  const industriesRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const quoteSectionRef = useRef<HTMLDivElement>(null);

  // Validation Logic
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
    const element = ref.current;
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      trackEvent('scroll_to_section', { section: element.id });
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
      trackEvent('auth_code_requested', { email_domain: verificationEmail.split('@')[1] });
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
      trackEvent('quote_unlocked', { total: quote.grandTotal });
    } else {
      alert("Invalid code.");
      setInputCode('');
      trackEvent('auth_failed');
    }
  };

  const handleOpenExplainer = (id: string) => {
    setActiveIndustryExplainer(id);
    trackEvent('view_industry_explainer', { industry: id });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden">
      
      {/* GLOBAL HEADER */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-xl py-3 border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <LogoIcon className="w-12 h-12 transition-transform group-hover:scale-110" light={!isScrolled} />
            <div className="flex flex-col">
              <span className={`font-black text-xl leading-none tracking-tight uppercase transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                TOTAL FACILITY SERVICES LLC
              </span>
              <span className={`text-[9px] tracking-[0.4em] font-black uppercase transition-opacity duration-300 ${isScrolled ? 'text-brand-accent opacity-100' : 'text-white opacity-60'}`}>Managed Precision</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <a href="tel:8444543101" className={`flex items-center gap-2 text-sm font-black transition-colors ${isScrolled ? 'text-brand-accent' : 'text-white/90 hover:text-brand-accentLight'}`}>
              <Phone size={16} /> (844) 454-3101
            </a>
            <button onClick={(e) => scrollTo(industriesRef, e)} className={`text-sm font-bold transition-colors ${isScrolled ? 'text-slate-600' : 'text-white/70'} hover:text-brand-accent`}>Industries</button>
            <button onClick={(e) => scrollTo(processRef, e)} className={`text-sm font-bold transition-colors ${isScrolled ? 'text-slate-600' : 'text-white/70'} hover:text-brand-accent`}>Process</button>
            <button 
              onClick={(e) => scrollTo(quoteSectionRef, e)}
              className="bg-brand-accent hover:bg-brand-accentLight text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-brand-accent/20 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-[0.15em]"
            >
              Get a Monthly Estimate
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - ABOVE THE FOLD */}
      <header className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800"></div>
          <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-brand-accent/20 rounded-full blur-[160px] translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] -translate-x-1/3"></div>
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-[100px] font-black text-white leading-[0.9] tracking-tighter">
                Everything Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight via-teal-200 to-white">
                  Building Needs.
                </span>
              </h1>
            </div>
            
            <p className="text-2xl text-slate-300 max-w-xl leading-relaxed font-medium">
              Precision facility maintenance for NY, FL, NJ, & CT. Managed labor models delivered as a single, all-inclusive monthly budget.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={(e) => scrollTo(quoteSectionRef, e)}
                className="group px-12 py-6 bg-brand-accent hover:bg-brand-accentLight text-white font-black rounded-3xl shadow-2xl shadow-brand-accent/40 transition-all flex items-center justify-center gap-4 text-xl tracking-tight"
              >
                Build Monthly Budget <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => {
                  setIsSchedulerOpen(true);
                  trackEvent('request_assessment_click');
                }}
                className="px-12 py-6 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl border border-white/20 backdrop-blur-md transition-all text-xl"
              >
                Request Assessment
              </button>
            </div>

            <div className="flex flex-wrap gap-10 pt-10 border-t border-white/5">
              {[
                { label: 'Fully Insured', icon: ShieldCheck },
                { label: 'Tri-State Core', icon: MapPin },
                { label: 'OSHA Certified', icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-400">
                  <item.icon size={20} className="text-brand-accent" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block group">
            <div className="relative z-10 bg-gradient-to-tr from-brand-accent/30 to-transparent p-1.5 rounded-[4rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                alt="Corporate Facility" 
                className="rounded-[3.8rem] w-full h-[650px] object-cover"
              />
              <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-float">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
                    <GraduationCap size={40} />
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-slate-900 tracking-tight">35+ Years</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Precision</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl group-hover:bg-brand-accent/40 transition-colors"></div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/20 cursor-pointer transition-colors hover:text-white/40" onClick={(e) => scrollTo(industriesRef, e)}>
          <ChevronDown size={40} />
        </div>
      </header>

      {/* CORE INDUSTRIES */}
      <section id="industries" ref={industriesRef} className="py-32 bg-white relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-brand-accent text-sm font-black uppercase tracking-[0.4em]">Service Verticals</h2>
              <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                Demanding Spaces. <br />Expert Care.
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                We specialize in sectors with strict compliance requirements. Every crew is background-checked and sector-specific.
              </p>
              <div className="pt-6 space-y-5">
                {[
                  { id: 'education', title: 'Education & Schools', desc: 'Child-safe sanitation for tri-state campuses.', icon: GraduationCap },
                  { id: 'cre', title: 'Commercial Office', desc: 'Class-A high-polish lobby & suite maintenance.', icon: Building2 },
                  { id: 'healthcare', title: 'Clinical & Healthcare', desc: 'Sterile environment protocols and terminal cleaning.', icon: Stethoscope },
                  { id: 'hoa', title: 'HOA & Residential', desc: 'Multi-site management for housing groups.', icon: Users }
                ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleOpenExplainer(item.id)}
                    className="w-full flex gap-5 text-left items-center group p-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-brand-accent/5 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-slate-900 tracking-tight">{item.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 gap-8">
              <div className="space-y-8 pt-16">
                <div onClick={() => handleOpenExplainer('education')} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group">
                  <GraduationCap className="text-brand-accent mb-8 transition-transform group-hover:scale-110" size={50} />
                  <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Charter Schools</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">Daily child-safe sanitation with zero-incident tracking.</p>
                </div>
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl group-hover:bg-brand-accent/40 transition-colors"></div>
                  <Globe className="text-brand-accentLight mb-8 relative z-10" size={50} />
                  <h4 className="text-2xl font-black mb-3 tracking-tight relative z-10">Regional Scale</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">Seamlessly managing portfolios across NY, FL, NJ, & CT.</p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-brand-accent p-10 rounded-[3rem] text-white shadow-2xl shadow-brand-accent/30 group">
                  <ShieldCheck className="text-white/80 mb-8 transition-transform group-hover:rotate-12" size={50} />
                  <h4 className="text-2xl font-black mb-3 tracking-tight">Compliance</h4>
                  <p className="text-sm text-white/80 leading-relaxed font-medium">Strict OSHA and EPA compliance reporting for every site visit.</p>
                </div>
                <div onClick={() => handleOpenExplainer('healthcare')} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group">
                  <Zap className="text-brand-secondary mb-8 group-hover:animate-pulse" size={50} />
                  <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Rapid Response</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">Dedicated account managers and 24/7 priority emergency support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE ENGINE SECTION */}
      <section id="quote-section" ref={quoteSectionRef} className="py-32 bg-white border-y border-slate-200 relative scroll-mt-24">
        <div id="quote-content" className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24">
            <div className="inline-block px-5 py-2 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-black uppercase tracking-[0.3em] mb-6">Budgeting Engine v5.8</div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">Your Precision Budget</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-2xl font-medium leading-relaxed">Everything is calculated using our bottom-up labor model. Transparent. Fixed. All-inclusive.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-8 space-y-12">
              {/* Step 1: Client Context */}
              <div id="facility-context" className={`transition-all duration-700 border rounded-[3rem] p-12 shadow-sm ${hasAddress ? 'border-brand-accent/30 bg-white' : 'border-slate-200 bg-white ring-4 ring-brand-accent/5'}`}>
                <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center justify-between tracking-tight">
                  <span className="flex items-center gap-4">
                    <MapPin className={hasAddress ? 'text-brand-accent' : 'text-slate-400'} size={32} /> 1. Facility Details
                  </span>
                  {hasAddress ? <CheckCircle2 className="text-brand-accent" size={32} /> : <AlertCircle className="text-amber-500 animate-pulse" size={32} />}
                </h2>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase font-black text-slate-400 tracking-[0.2em] ml-1">Organization Name</label>
                    <input 
                      type="text" 
                      placeholder="TOTAL FACILITY SERVICES LLC"
                      value={clientInfo.name}
                      onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-5 px-7 text-base font-bold focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase font-black text-slate-400 tracking-[0.2em] ml-1">Physical Address</label>
                    <input 
                      type="text" 
                      placeholder="Street, City, State"
                      value={clientInfo.address}
                      onChange={e => setClientInfo({...clientInfo, address: e.target.value})}
                      className={`w-full bg-slate-50/50 border-2 rounded-2xl py-5 px-7 text-base font-bold focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all ${hasAddress ? 'border-brand-accent/20' : 'border-slate-100'}`}
                    />
                  </div>
                </div>
              </div>

              <div id="room-breakdown" className={`transition-all duration-700 border-2 rounded-[3rem] p-12 shadow-2xl ${hasRooms ? 'border-brand-accent/20 bg-white' : 'border-slate-100 bg-slate-50/50'}`}>
                <RoomList rooms={rooms} onChange={setRooms} />
              </div>

              <div className="bg-slate-50/30 border border-slate-200 rounded-[3rem] p-12">
                <PorterList porters={porters} onChange={setPorters} />
              </div>
            </div>

            {/* Price Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
              {!isQuoteUnlocked ? (
                <div className={`transition-all duration-700 bg-[#0f172a] text-white rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group border ${isConfigComplete ? 'border-brand-accent/50' : 'border-white/5 opacity-90'}`}>
                   <div className="absolute top-0 right-0 w-60 h-60 bg-brand-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                   <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                      <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-2 shadow-inner border transition-all duration-700 ${isConfigComplete ? 'bg-brand-accent/20 border-brand-accent/40 text-brand-accentLight' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                        {isConfigComplete ? <Sparkles size={48} className="animate-pulse" /> : <Lock size={48} />}
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-4xl font-black tracking-tighter">
                          {isConfigComplete ? 'Unlock Analysis' : 'Configuration'}
                        </h3>
                        <p className="text-base text-slate-400 font-medium px-4 leading-relaxed">
                          {isConfigComplete 
                            ? 'Your precision labor model is ready for review.' 
                            : 'Provide facility details and room counts to unlock your budget.'}
                        </p>
                      </div>

                      <div className="w-full space-y-4 bg-white/5 border border-white/10 p-6 rounded-3xl text-left">
                        <button 
                          onClick={() => document.getElementById('facility-context')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                          className="w-full flex items-center justify-between group/item"
                        >
                           <div className="flex items-center gap-4">
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${hasAddress ? 'bg-brand-accent text-white' : 'border border-slate-600 text-slate-600'}`}>
                               {hasAddress ? <CheckCircle2 size={14} /> : <span className="text-[11px] font-black">1</span>}
                             </div>
                             <span className={`text-xs font-black uppercase tracking-widest transition-colors ${hasAddress ? 'text-white' : 'text-slate-500 group-hover/item:text-slate-300'}`}>Facility Address</span>
                           </div>
                           {!hasAddress && <span className="text-[10px] text-brand-accent font-black underline uppercase tracking-tighter">Add</span>}
                        </button>
                        
                        <button 
                          onClick={() => document.getElementById('room-breakdown')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                          className="w-full flex items-center justify-between group/item"
                        >
                           <div className="flex items-center gap-4">
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${hasRooms ? 'bg-brand-accent text-white' : 'border border-slate-600 text-slate-600'}`}>
                               {hasRooms ? <CheckCircle2 size={14} /> : <span className="text-[11px] font-black">2</span>}
                             </div>
                             <span className={`text-xs font-black uppercase tracking-widest transition-colors ${hasRooms ? 'text-white' : 'text-slate-500 group-hover/item:text-slate-300'}`}>Room Breakdown</span>
                           </div>
                           {!hasRooms && <span className="text-[10px] text-brand-accent font-black underline uppercase tracking-tighter">Add</span>}
                        </button>
                      </div>
                      
                      {verificationStep === 'email' ? (
                        <form onSubmit={handleSendVerification} className="w-full space-y-5">
                          <input 
                            type="email" 
                            required
                            disabled={!isConfigComplete}
                            placeholder="Work Email"
                            value={verificationEmail}
                            onChange={(e) => setVerificationEmail(e.target.value)}
                            className={`w-full border rounded-2xl py-5 px-8 text-base text-center font-bold outline-none transition-all ${isConfigComplete ? 'bg-white/5 border-white/10 text-white focus:ring-4 focus:ring-brand-accent/30' : 'bg-white/5 border-white/5 text-slate-800 cursor-not-allowed'}`}
                          />
                          <button 
                            type="submit"
                            disabled={isSendingCode || !isConfigComplete}
                            className={`w-full font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm ${isConfigComplete ? 'bg-brand-accent hover:bg-brand-accentLight text-white shadow-2xl shadow-brand-accent/40 active:scale-95' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}
                          >
                            {!isConfigComplete ? 'Awaiting Details' : isSendingCode ? 'Processing...' : 'Request Access Code'}
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyCode} className="w-full space-y-5">
                          <input 
                            type="text" 
                            required
                            placeholder="4-Digit Code"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-lg text-center tracking-[1em] font-mono focus:ring-4 focus:ring-brand-accent/30 outline-none"
                          />
                          <button type="submit" className="w-full bg-brand-secondary hover:bg-amber-600 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-brand-secondary/40 uppercase tracking-widest text-sm">Verify & Unlock</button>
                        </form>
                      )}
                   </div>
                </div>
              ) : (
                <div className="bg-[#0f172a] text-white rounded-[3.5rem] p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-700 border border-white/5">
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-4">Total Monthly Budget</h3>
                      <div className="text-6xl font-black tracking-tighter text-white">
                        {formatCurrency(quote.grandTotal)}
                        <span className="text-base text-slate-500 font-medium ml-2 uppercase tracking-[0.2em]">/mo</span>
                      </div>
                    </div>
                    
                    <div className="h-px bg-white/10"></div>
                    
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Janitorial Base</span>
                          <span className="text-xs text-slate-500 font-bold mt-1">Daily cleaning & sanitation</span>
                        </div>
                        <span className="font-black text-xl text-brand-accentLight">{formatCurrency(quote.cleaningTotal + quote.specialtyTotal)}</span>
                      </div>
                      
                      {quote.porterTotal > 0 && (
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">On-Site Porter</span>
                            <span className="text-xs text-slate-500 font-bold mt-1">Daily facility presence</span>
                          </div>
                          <span className="font-black text-xl text-brand-accentLight">{formatCurrency(quote.porterTotal)}</span>
                        </div>
                      )}

                      <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                         <div className="flex items-center gap-3 text-brand-accent">
                           <ShieldCheck size={20} />
                           <span className="text-[11px] font-black uppercase tracking-widest">Included Preventative Care</span>
                         </div>
                         <ul className="text-xs text-slate-400 font-bold space-y-3 leading-relaxed">
                            <li className="flex items-start gap-2">• Summer Stripping & Waxing</li>
                            <li className="flex items-start gap-2">• Winter Floor Neutralization</li>
                            <li className="flex items-start gap-2">• Scheduled Carpet Shampooing</li>
                         </ul>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-600 text-center font-black uppercase tracking-[0.3em] pt-6">Managed Precision • Fixed Budget</p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        <div className="mt-32 max-w-5xl mx-auto px-6">
          <LeadForm 
            quote={quote} 
            clientInfo={clientInfo} 
            rooms={rooms}
            initialEmail={isQuoteUnlocked ? verificationEmail : ''}
            onSubmit={(data) => trackEvent('lead_form_submitted', { company: data.company })} 
            onSchedule={() => {
              setIsSchedulerOpen(true);
              trackEvent('schedule_walkthrough_click');
            }}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-24 relative z-10">
          <div className="col-span-2 space-y-10">
            <div className="flex items-center gap-4 group cursor-pointer">
              <LogoIcon className="w-14 h-14" light={true} />
              <span className="font-black text-3xl tracking-tighter uppercase">TOTAL FACILITY SERVICES LLC</span>
            </div>
            <div className="text-slate-400 max-w-sm leading-relaxed text-xl font-medium space-y-6">
              <p>Everything Your Building Needs. <br /> All in One Place.</p>
              <div className="text-sm space-y-2 border-l-2 border-brand-accent pl-6">
                <p className="font-black text-white">NYC Headquarters</p>
                <p>211 East 43rd Street, FL 7</p>
                <p>New York, NY 10017</p>
              </div>
            </div>
            <div className="flex gap-5">
              <a href="mailto:info@thetotalfacility.com" className="w-14 h-14 rounded-[1.2rem] bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all"><Mail size={24} /></a>
              <a href="tel:8444543101" className="w-14 h-14 rounded-[1.2rem] bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all"><Phone size={24} /></a>
              <div className="w-14 h-14 rounded-[1.2rem] bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all"><Globe size={24} /></div>
            </div>
          </div>
          
          <div className="space-y-10">
             <h4 className="font-black text-xs uppercase tracking-[0.4em] text-slate-500">Service Regions</h4>
             <ul className="space-y-6 text-slate-400 font-bold">
               <li className="flex items-center gap-4 hover:text-brand-accent transition-colors"><MapPin size={20} className="text-brand-accent" /> New York Metro</li>
               <li className="flex items-center gap-4 hover:text-brand-accent transition-colors"><MapPin size={20} className="text-brand-accent" /> Florida Region</li>
               <li className="flex items-center gap-4 hover:text-brand-accent transition-colors"><MapPin size={20} className="text-brand-accent" /> New Jersey</li>
               <li className="flex items-center gap-4 hover:text-brand-accent transition-colors"><MapPin size={20} className="text-brand-accent" /> Connecticut</li>
             </ul>
          </div>
          
          <div className="space-y-10">
             <h4 className="font-black text-xs uppercase tracking-[0.4em] text-slate-500">Direct Contact</h4>
             <ul className="space-y-6 text-slate-400 font-bold">
               <li>
                 <a href="mailto:info@thetotalfacility.com" className="flex items-center gap-4 hover:text-brand-accent transition-colors">
                   <Mail size={20} className="text-brand-accent" /> info@thetotalfacility.com
                 </a>
               </li>
               <li>
                 <a href="tel:8444543101" className="flex items-center gap-4 hover:text-brand-accent transition-colors">
                   <Phone size={20} className="text-brand-accent" /> (844) 454-3101
                 </a>
               </li>
               <li className="flex items-center gap-4"><Zap size={20} className="text-brand-accent" /> 24/7 Priority Support</li>
             </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-24 mt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-slate-600 text-sm font-bold tracking-tight">&copy; {new Date().getFullYear()} TOTAL FACILITY SERVICES LLC. All Rights Reserved.</p>
           <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
             <a href="#" className="hover:text-brand-accent transition-colors">Terms</a>
             <a href="#" className="hover:text-brand-accent transition-colors">Privacy</a>
             <a href="#" className="hover:text-brand-accent transition-colors">Compliance</a>
           </div>
        </div>
      </footer>

      <SchedulingModal isOpen={isSchedulerOpen} onClose={() => setIsSchedulerOpen(false)} />
      <IndustryExplainerModal industryId={activeIndustryExplainer} onClose={() => setActiveIndustryExplainer(null)} />
    </div>
  );
};

export default App;