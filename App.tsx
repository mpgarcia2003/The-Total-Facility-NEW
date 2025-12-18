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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-brand-accent rounded-xl flex items-center justify-center text-white shadow-xl shadow-brand-accent/30 transform rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <Building2 size={26} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl leading-none text-slate-900 tracking-tight uppercase">The Facility Services LLC</span>
              <span className="text-[10px] tracking-[0.3em] font-black text-brand-accent uppercase">Managed Precision</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <a href="tel:8444543101" className="flex items-center gap-2 text-sm font-black text-brand-accent hover:text-brand-accentLight transition-colors">
              <Phone size={16} /> (844) 454-3101
            </a>
            <button onClick={(e) => scrollTo(industriesRef, e)} className="text-sm font-bold text-slate-600 hover:text-brand-accent transition-colors">Industries</button>
            <button onClick={(e) => scrollTo(processRef, e)} className="text-sm font-bold text-slate-600 hover:text-brand-accent transition-colors">Process</button>
            <button 
              onClick={(e) => scrollTo(quoteSectionRef, e)}
              className="bg-brand-accent hover:bg-brand-accentLight text-white px-7 py-3 rounded-2xl text-sm font-black shadow-lg shadow-brand-accent/20 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wider"
            >
              Get a Monthly Estimate
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800"></div>
          <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-brand-accent/20 rounded-full blur-[160px] translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] -translate-x-1/3"></div>
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black text-brand-accentLight uppercase tracking-widest backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-brand-accent animate-pulse"></span>
              NY, FL, NJ, & CT Metro Regions
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter">
              Everything Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight via-teal-300 to-white">
                Building Needs.
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-xl leading-relaxed font-medium">
              A modern, systems-driven approach to facility maintenance. All pricing is calculated using a bottom-up labor model and delivered as an all-inclusive monthly facility budget.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={(e) => scrollTo(quoteSectionRef, e)}
                className="group px-10 py-5 bg-brand-accent hover:bg-brand-accentLight text-white font-black rounded-2xl shadow-2xl shadow-brand-accent/40 transition-all flex items-center justify-center gap-3 text-lg"
              >
                Build Your Monthly Budget <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => {
                  setIsSchedulerOpen(true);
                  trackEvent('request_assessment_click');
                }}
                className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/20 backdrop-blur-md transition-all text-lg"
              >
                Request Facility Assessment
              </button>
            </div>

            <div className="flex flex-wrap gap-8 pt-6">
              {[
                { label: 'Insured & Bonded', icon: ShieldCheck },
                { label: 'Multi-State Coverage', icon: MapPin },
                { label: 'OSHA Compliant', icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-slate-400">
                  <item.icon size={18} className="text-brand-accent" />
                  <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 bg-gradient-to-tr from-brand-accent/20 to-transparent p-1 rounded-[3rem] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" 
                alt="Corporate Lobby" 
                className="rounded-[2.8rem] w-full h-[600px] object-cover"
              />
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
                    <GraduationCap size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">Facility Specialists</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">35+ Industry Partners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/20 cursor-pointer" onClick={(e) => scrollTo(industriesRef, e)}>
          <ChevronDown size={32} />
        </div>
      </header>

      {/* STICKY PROGRESS RIBBON */}
      {!isQuoteUnlocked && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 pointer-events-none flex justify-center">
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 duration-700">
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isConfigComplete ? 'bg-brand-accent' : 'bg-brand-accent/20'}`}>
                   {isConfigComplete ? <Sparkles size={16} className="text-white" /> : <Lock size={16} className="text-brand-accent" />}
                </div>
                <div className="flex flex-col">
                   <span className="text-white text-xs font-black uppercase tracking-widest">
                     {isConfigComplete ? 'Configuration Ready' : 'Budget Progress'}
                   </span>
                   <span className="text-slate-400 text-[10px] font-bold">
                     {hasAddress ? 'Address Found' : 'Missing Address'} • {hasRooms ? 'Rooms Counted' : 'Missing Rooms'}
                   </span>
                </div>
             </div>
             
             <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
             
             <button 
                onClick={(e) => scrollTo(quoteSectionRef, e)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isConfigComplete ? 'bg-brand-accent text-white hover:bg-brand-accentLight animate-pulse' : 'bg-white/10 text-slate-300'}`}
             >
                {isConfigComplete ? 'Unlock Now' : 'Complete Steps'}
             </button>
          </div>
        </div>
      )}

      {/* CORE INDUSTRIES */}
      <section id="industries" ref={industriesRef} className="py-32 bg-white relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-brand-accent text-sm font-black uppercase tracking-[0.3em]">Specialized Industries</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Built for the Most <br /> Demanding Facilities.
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                We don't believe in "one size fits all." Our crews are specialized by sector, ensuring the specific compliance and cultural needs of your building are met. Click an industry below to learn how our monthly model works.
              </p>
              <div className="pt-4 space-y-4">
                {[
                  { id: 'education', title: 'Charter & Private Schools', desc: 'Child-safe, EPA-approved sanitation for campuses.', icon: GraduationCap },
                  { id: 'cre', title: 'Commercial Real Estate', desc: 'High-visibility maintenance for tri-state class-A offices.', icon: Building2 },
                  { id: 'healthcare', title: 'Healthcare & Clinical', desc: 'Sterile environment protocols and terminal cleaning.', icon: Stethoscope },
                  { id: 'hoa', title: 'HOA & Community', desc: 'Multi-site management for residential housing groups.', icon: Users }
                ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleOpenExplainer(item.id)}
                    className="w-full flex gap-4 text-left items-start group p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                  >
                    <div className="mt-1 w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div onClick={() => handleOpenExplainer('education')} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all cursor-pointer">
                  <GraduationCap className="text-brand-accent mb-6" size={40} />
                  <h4 className="text-xl font-black text-slate-900 mb-2">Education</h4>
                  <p className="text-sm text-slate-600">Specialized school cleaning with 100% background-checked staff.</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                  <Globe className="text-brand-accentLight mb-6" size={40} />
                  <h4 className="text-xl font-black mb-2">Multi-State</h4>
                  <p className="text-sm text-slate-400">Managing portfolios across NY, FL, NJ, & CT regions.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-brand-accent p-8 rounded-[2rem] text-white shadow-2xl shadow-brand-accent/20">
                  <ShieldCheck className="text-white/80 mb-6" size={40} />
                  <h4 className="text-xl font-black mb-2">Compliance</h4>
                  <p className="text-sm text-white/80">Strict OSHA and EPA compliance reporting for all facilities.</p>
                </div>
                <div onClick={() => handleOpenExplainer('healthcare')} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-shadow cursor-pointer">
                  <Zap className="text-brand-secondary mb-6" size={40} />
                  <h4 className="text-xl font-black text-slate-900 mb-2">Responsiveness</h4>
                  <p className="text-sm text-slate-600">Dedicated account managers and 24/7 emergency support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INCLUDED SERVICES HIGHLIGHT */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-brand-accentLight text-sm font-black uppercase tracking-[0.3em] mb-4">Unmatched Value</h2>
              <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight">All Monthly Service <br />Plans Include:</h3>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                We believe in preventative maintenance. Instead of charging for seasonal projects, we bake high-impact specialty care into your monthly budget so your building never falls behind.
              </p>
              <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
                {[
                  "Annual summer floor stripping & waxing",
                  "Winter wash & wax programs",
                  "Scheduled carpet and upholstery shampooing",
                  "Deep cleaning during school breaks",
                  "Ongoing preventative floor maintenance",
                  "24/7 Support Desk"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-sm font-bold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-12 rounded-[3rem] backdrop-blur-xl">
               <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent">
                      <DollarSign size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black">Predictable Budgeting</h4>
                      <p className="text-sm text-slate-400 font-medium">No surprise seasonal invoices. One number, all year.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                      <Clock size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black">Bottom-Up Precision</h4>
                      <p className="text-sm text-slate-400 font-medium">Pricing based on exact labor requirements for your layout.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black">All-Inclusive Care</h4>
                      <p className="text-sm text-slate-400 font-medium">Janitorial, Floor Care, and Maintenance in one package.</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section id="process" ref={processRef} className="py-32 bg-slate-50 relative overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-brand-accent text-sm font-black uppercase tracking-[0.3em] mb-4">Operational Precision</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900">Our Onboarding Process</h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Monthly Estimate', desc: 'Use our labor model engine to get an immediate all-inclusive budget estimate.' },
              { num: '02', title: 'Site Walkthrough', desc: 'We visit your facility to verify room dimensions and specific requirements.' },
              { num: '03', title: 'Custom Strategy', desc: 'Our operations team builds a tailored cleaning scope and staffing plan.' },
              { num: '04', title: 'Precision Launch', desc: 'Seamless transition to our crews with dedicated supervisor oversight.' }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 hover:border-brand-accent transition-all hover:shadow-2xl hover:-translate-y-2">
                  <span className="text-5xl font-black text-slate-100 group-hover:text-brand-accent/10 transition-colors block mb-6">{step.num}</span>
                  <h4 className="text-xl font-black text-slate-900 mb-3">{step.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 text-slate-200">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE ENGINE SECTION */}
      <section id="quote-section" ref={quoteSectionRef} className="py-32 bg-white border-y border-slate-200 relative scroll-mt-24">
        <div id="quote-content" className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-black uppercase tracking-[0.2em] mb-4">Budgeting Engine v5.5</div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Build Your Monthly Budget</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium">All pricing is calculated using a bottom-up labor model and delivered as an all-inclusive monthly facility budget.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-10">
              {/* Step 1: Client Context */}
              <div id="facility-context" className={`transition-all duration-500 border rounded-[2.5rem] p-10 shadow-sm ${hasAddress ? 'border-brand-accent/30 bg-white/50' : 'border-slate-200 bg-white animate-pulse-slow ring-4 ring-brand-accent/5'}`}>
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <MapPin className={hasAddress ? 'text-brand-accent' : 'text-slate-400'} size={24} /> 1. Facility Context
                  </span>
                  {hasAddress ? <CheckCircle2 className="text-brand-accent" size={24} /> : <AlertCircle className="text-amber-500 animate-pulse" size={24} />}
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Organization Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Company or School Name"
                        value={clientInfo.name}
                        onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Facility Address</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Street, City, State"
                        value={clientInfo.address}
                        onChange={e => setClientInfo({...clientInfo, address: e.target.value})}
                        className={`w-full bg-white border-2 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all ${hasAddress ? 'border-brand-accent/20' : 'border-amber-200 shadow-inner'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div id="room-breakdown" className={`transition-all duration-500 border-2 rounded-[2.5rem] p-10 shadow-xl ${hasRooms ? 'border-brand-accent/20 bg-white' : 'border-slate-100 bg-slate-50/50'}`}>
                <RoomList rooms={rooms} onChange={setRooms} />
              </div>

              <div className="bg-slate-50/50 border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                <PorterList porters={porters} onChange={setPorters} />
              </div>
            </div>

            {/* Price Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              {!isQuoteUnlocked ? (
                <div className={`transition-all duration-500 bg-[#0f172a] text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group border ${isConfigComplete ? 'border-brand-accent/50' : 'border-white/5 opacity-80 hover:opacity-100'}`}>
                   <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-accent/30 transition-all"></div>
                   <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-2 shadow-inner border transition-all duration-700 ${isConfigComplete ? 'bg-brand-accent/20 border-brand-accent/40 text-brand-accentLight' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                        {isConfigComplete ? <Sparkles size={36} className="animate-pulse" /> : <Lock size={36} />}
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-3xl font-black tracking-tight">
                          {isConfigComplete ? 'Ready to Unlock' : 'Locked Analysis'}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium px-4 leading-relaxed">
                          {isConfigComplete 
                            ? 'Your custom labor model is ready. Verify your email to see the results.' 
                            : 'Complete the steps below to generate your facility budget.'}
                        </p>
                      </div>

                      {/* PROGRESS CHECKLIST - Interactive */}
                      <div className="w-full space-y-3 bg-white/5 border border-white/10 p-5 rounded-2xl text-left">
                        <button 
                          onClick={() => document.getElementById('facility-context')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                          className="w-full flex items-center justify-between group/item"
                        >
                           <div className="flex items-center gap-3">
                             <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${hasAddress ? 'bg-brand-accent text-white' : 'border border-slate-600 text-slate-600'}`}>
                               {hasAddress ? <CheckCircle2 size={12} /> : <span className="text-[10px] font-black">1</span>}
                             </div>
                             <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${hasAddress ? 'text-white' : 'text-slate-500 group-hover/item:text-slate-300'}`}>Facility Address</span>
                           </div>
                           {!hasAddress && <span className="text-[10px] text-brand-accent font-black underline uppercase">Add</span>}
                        </button>
                        
                        <button 
                          onClick={() => document.getElementById('room-breakdown')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                          className="w-full flex items-center justify-between group/item"
                        >
                           <div className="flex items-center gap-3">
                             <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${hasRooms ? 'bg-brand-accent text-white' : 'border border-slate-600 text-slate-600'}`}>
                               {hasRooms ? <CheckCircle2 size={12} /> : <span className="text-[10px] font-black">2</span>}
                             </div>
                             <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${hasRooms ? 'text-white' : 'text-slate-500 group-hover/item:text-slate-300'}`}>Room Counts</span>
                           </div>
                           {!hasRooms && <span className="text-[10px] text-brand-accent font-black underline uppercase">Add</span>}
                        </button>
                      </div>
                      
                      {verificationStep === 'email' ? (
                        <form onSubmit={handleSendVerification} className="w-full space-y-4">
                          <input 
                            type="email" 
                            required
                            disabled={!isConfigComplete}
                            placeholder="Work Email"
                            value={verificationEmail}
                            onChange={(e) => setVerificationEmail(e.target.value)}
                            className={`w-full border rounded-2xl py-4 px-6 text-sm text-center font-bold outline-none transition-all ${isConfigComplete ? 'bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-brand-accent' : 'bg-white/5 border-white/5 text-slate-700 cursor-not-allowed'}`}
                          />
                          <button 
                            type="submit"
                            disabled={isSendingCode || !isConfigComplete}
                            className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs ${isConfigComplete ? 'bg-brand-accent hover:bg-brand-accentLight text-white shadow-xl shadow-brand-accent/20 active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
                          >
                            {!isConfigComplete ? 'Awaiting Details' : isSendingCode ? 'Processing...' : 'Request Access Code'}
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyCode} className="w-full space-y-4">
                          <input 
                            type="text" 
                            required
                            placeholder="Enter 4-Digit Code"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-center tracking-[1em] font-mono focus:ring-2 focus:ring-brand-accent outline-none"
                          />
                          <button type="submit" className="w-full bg-brand-secondary hover:bg-amber-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-brand-secondary/20 uppercase tracking-widest text-xs">Unlock Budget</button>
                        </form>
                      )}
                   </div>
                </div>
              ) : (
                <div className="bg-[#0f172a] text-white rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500 border border-white/5">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-brand-accent text-xs font-black uppercase tracking-[0.3em] mb-3">All-Inclusive Monthly Budget</h3>
                      <div className="text-6xl font-black tracking-tighter text-white">
                        {formatCurrency(quote.grandTotal)}
                        <span className="text-base text-slate-500 font-medium ml-2 uppercase tracking-widest">/mo</span>
                      </div>
                    </div>
                    
                    <div className="h-px bg-white/10"></div>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex flex-col">
                          <span className="text-slate-400 font-bold uppercase tracking-wider">Janitorial Services</span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">Recurring + specialty maintenance</span>
                        </div>
                        <span className="font-black text-brand-accentLight">{formatCurrency(quote.cleaningTotal + quote.specialtyTotal)}</span>
                      </div>
                      
                      {quote.porterTotal > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400 font-bold uppercase tracking-wider">Day Porter</span>
                          <span className="font-black text-brand-accentLight">{formatCurrency(quote.porterTotal)}</span>
                        </div>
                      )}

                      <div className="mt-6 p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                         <div className="flex items-center gap-2 text-brand-accent">
                           <ShieldCheck size={16} />
                           <span className="text-xs font-black uppercase tracking-widest">Included Preventative Floor Care</span>
                         </div>
                         <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-3">
                           Annual stripping, waxing, winter washing, and scheduled shampooing are included as part of our monthly service plans.
                         </p>
                         <ul className="text-[11px] text-slate-400 font-bold space-y-2 leading-relaxed">
                            <li className="flex items-start gap-2">• Annual Summer Floor Stripping & Waxing</li>
                            <li className="flex items-start gap-2">• Annual Floor Washing & Waxing (Winter)</li>
                            <li className="flex items-start gap-2">• Winter Washing & Salt Neutralization</li>
                            <li className="flex items-start gap-2">• Scheduled Carpet & Upholstery Shampooing</li>
                         </ul>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-[0.2em] pt-4">Data-driven estimate • Fixed budget locking</p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        <div className="mt-32 max-w-4xl mx-auto px-6">
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
      <footer className="bg-[#0f172a] text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-20 relative z-10">
          <div className="col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase">The Facility Services LLC</span>
            </div>
            <div className="text-slate-400 max-w-sm leading-relaxed text-lg font-medium space-y-4">
              <p>Everything Your Building Needs. All in One Place.</p>
              <div className="text-sm space-y-1 border-l-2 border-brand-accent pl-4">
                <p>211 East 43rd Street, FL 7</p>
                <p>New York, NY 10017</p>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="mailto:info@thetotalfacility.com" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all cursor-pointer"><Mail size={20} /></a>
              <a href="tel:8444543101" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all cursor-pointer"><Phone size={20} /></a>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all cursor-pointer"><Globe size={20} /></div>
            </div>
          </div>
          
          <div className="space-y-8">
             <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-500">Service Regions</h4>
             <ul className="space-y-5 text-slate-400 font-bold">
               <li className="flex items-center gap-3 hover:text-brand-accent transition-colors"><MapPin size={18} className="text-brand-accent" /> New York (All Boroughs & Counties)</li>
               <li className="flex items-center gap-3 hover:text-brand-accent transition-colors"><MapPin size={18} className="text-brand-accent" /> Florida</li>
               <li className="flex items-center gap-3 hover:text-brand-accent transition-colors"><MapPin size={18} className="text-brand-accent" /> New Jersey</li>
               <li className="flex items-center gap-3 hover:text-brand-accent transition-colors"><MapPin size={18} className="text-brand-accent" /> Connecticut</li>
             </ul>
          </div>
          
          <div className="space-y-8">
             <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-500">Direct Contact</h4>
             <ul className="space-y-5 text-slate-400 font-bold">
               <li>
                 <a href="mailto:info@thetotalfacility.com" className="flex items-center gap-3 hover:text-brand-accent transition-colors">
                   <Mail size={18} className="text-brand-accent" /> info@thetotalfacility.com
                 </a>
               </li>
               <li>
                 <a href="tel:8444543101" className="flex items-center gap-3 hover:text-brand-accent transition-colors">
                   <Phone size={18} className="text-brand-accent" /> (844) 454-3101
                 </a>
               </li>
               <li className="flex items-center gap-3"><Zap size={18} className="text-brand-accent" /> 24/7 Priority Support</li>
             </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-slate-500 text-sm font-bold">&copy; {new Date().getFullYear()} The Facility Services LLC. All Rights Reserved.</p>
           <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-slate-600">
             <a href="#" className="hover:text-brand-accent">Terms</a>
             <a href="#" className="hover:text-brand-accent">Privacy</a>
             <a href="#" className="hover:text-brand-accent">Compliance</a>
           </div>
        </div>
      </footer>

      <SchedulingModal isOpen={isSchedulerOpen} onClose={() => setIsSchedulerOpen(false)} />
      <IndustryExplainerModal industryId={activeIndustryExplainer} onClose={() => setActiveIndustryExplainer(null)} />
    </div>
  );
};

export default App;
