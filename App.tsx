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
import { BLOG_POSTS } from './data/blogPosts';
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
  FileCheck,
  Mail,
  User,
  Loader2,
  Clock
} from './components/ui/Icons';

// EmailJS Configuration (Shared)
// Note: Ensure these IDs match your EmailJS Dashboard exactly
const EMAILJS_SERVICE_ID = "service_srv6b3k"; 
const EMAILJS_TEMPLATE_ID_INTERNAL = "template_12yvcvz"; 
const EMAILJS_PUBLIC_KEY = "4ye26ZtWxpi6Pkk5f";
const INTERNAL_RECIPIENT = "info@thetotalfacility.com";

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

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockEmail, setUnlockEmail] = useState('');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [activeIndustryExplainer, setActiveIndustryExplainer] = useState<string | null>(null);
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);

  const quoteSectionRef = useRef<HTMLDivElement>(null);
  const industriesSectionRef = useRef<HTMLDivElement>(null);
  const processSectionRef = useRef<HTMLDivElement>(null);
  const insightsSectionRef = useRef<HTMLDivElement>(null);

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

    const formattedTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    try {
      // TRIPLE CAPTURE - STAGE 1: Instant Unlock Alert
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_INTERNAL,
        { 
          from_name: "TOTAL FACILITY SERVICES LLC",
          name: "Quick Lead (Pricing Unlock)",
          company: "Not Specified Yet",
          email: unlockEmail,
          phone: "Not Provided Yet",
          quote_total: formatCurrency(quote.grandTotal),
          time: formattedTime,
          reply_to: unlockEmail,
          notes: `User unlocked the pricing calculator for ${settings.industry} / ${settings.serviceType}. This is an early-funnel lead.`
        },
        EMAILJS_PUBLIC_KEY
      );
      setIsUnlocked(true);
    } catch (err) {
      console.error("Unlock lead capture error:", err);
      // Still unlock even if email fails to not break user experience
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
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-2xl shadow-xl py-3 border-b border-slate-100' : 'bg-transparent py-6'}`} aria-label="Main Navigation">
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
            <a href="tel:8444543101" className={`flex items-center gap-2 text-xs font-black transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`} aria-label="Call Support">
              <Phone size={14} className="text-brand-accent" /> (844) 454-3101
            </a>
            <button onClick={(e) => scrollTo(industriesSectionRef, e)} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isScrolled ? 'text-slate-600' : 'text-white'}`}>Industries</button>
            <button onClick={(e) => scrollTo(insightsSectionRef, e)} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isScrolled ? 'text-slate-600' : 'text-white'}`}>Insights</button>
            <button onClick={(e) => scrollTo(processSectionRef, e)} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isScrolled ? 'text-slate-600' : 'text-white'}`}>Risk & Safety</button>
            <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="bg-gradient-to-r from-brand-accent to-brand-accentLight text-white px-6 py-3 rounded-xl text-[10px] font-black shadow-lg uppercase tracking-widest">
              Get Your Quote
            </button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2" aria-label="Toggle Menu">
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
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-full">
               <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
               <span className="text-brand-accent text-[10px] font-black uppercase tracking-widest">Now Bidding: NY, FL, NJ, & CT Portfolio Contracts</span>
             </div>
             <h1 className="text-5xl sm:text-8xl lg:text-[105px] font-black text-white leading-[0.85] tracking-tighter text-left">
              Enterprise <br />Facility <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight via-teal-200 to-white">Managed Labor.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-lg leading-relaxed font-medium text-left">
              Moving beyond basic cleaning. We provide managed labor models for Class-A real estate, healthcare clinics, and educational campuses.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={(e) => scrollTo(quoteSectionRef, e)} className="group px-10 py-5 bg-brand-accent text-white font-black rounded-2xl shadow-xl shadow-brand-accent/20 transition-all flex items-center justify-center gap-4 text-lg">
                Get Your Quote <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setIsResourceModalOpen(true)} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-lg flex items-center gap-3">
                <FileText size={20}/> Capabilities Statement
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative">
             <div className="p-3 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-sm relative">
               <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" className="rounded-[2.8rem] w-full h-[600px] object-cover opacity-60" alt="Managed Class-A Portfolio Lobby" />
               <div className="absolute top-10 -right-10 bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-4 max-w-xs border border-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-brand-accent"><ShieldCheck size={20}/></div>
                    <span className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Risk Mitigation</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-black text-slate-400"><span>Liability Coverage</span><span className="text-brand-accent">$10,000,000</span></div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="w-full h-full bg-brand-accent"></div></div>
                    <div className="flex justify-between text-[11px] font-black text-slate-400"><span>Workers Comp</span><span className="text-brand-accent">Statutory</span></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold italic border-t border-slate-100 pt-3 text-left">Procurement Ready. High-limit bonding for enterprise sites.</p>
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* COMPLIANCE MARQUEE */}
      <div className="bg-slate-50 py-10 border-b border-slate-100 relative overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-start gap-12 whitespace-nowrap min-w-max">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Standard of Excellence</div>
          <div className="flex items-center gap-12 opacity-30 grayscale hover:opacity-60 transition-opacity">
            <div className="flex items-center gap-2 font-black text-xl"><ShieldCheck size={24}/> OSHA COMPLIANT</div>
            <div className="flex items-center gap-2 font-black text-xl"><HardHat size={24}/> EPA SAFE</div>
            <div className="flex items-center gap-2 font-black text-xl"><Globe size={24}/> LEED STANDARDS</div>
            <div className="flex items-center gap-2 font-black text-xl"><ClipboardCheck size={24}/> HIPAA READY</div>
          </div>
        </div>
      </div>

      {/* CORE CAPABILITIES GRID */}
      <section ref={industriesSectionRef} className="py-24 md:py-32 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5 space-y-6 lg:pr-12 text-left">
               <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Our Expertise</span>
               <h2 className="text-5xl lg:text-[68px] font-black text-slate-900 leading-[1.1] tracking-tight">Sector <br />Specialization.</h2>
               <p className="text-slate-500 font-medium leading-relaxed max-w-sm">Multi-million dollar contracts require specialized knowledge. Click a competency to view our technical capability statement for that sector.</p>
               <div className="pt-6">
                 <button onClick={() => setIsResourceModalOpen(true)} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-brand-accent hover:gap-5 transition-all">Download All Sector Packages <ArrowRight size={14}/></button>
               </div>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6 lg:gap-8">
               {[
                 { id: 'healthcare', t: 'Terminal Cleaning', d: 'Terminal cleaning for medical clinics and surgical centers with pathogen logs.', i: <Stethoscope size={24}/> },
                 { id: 'education', t: 'Campus Logistics', d: 'Integrated day-porter staffing for K-12 networks and high-traffic higher-ed.', i: <GraduationCap size={24}/> },
                 { id: 'cre', t: 'Class-A Portfolios', d: 'Premium maintenance models for high-rise commercial real estate and lobbies.', i: <Building2 size={24}/> },
                 { id: 'industrial', t: 'Logistics Centers', d: 'High-bay cleaning and large-area floor scrubbing for logistics and warehouses.', i: <Warehouse size={24}/> },
               ].map((cap, i) => (
                 <button 
                  key={i} 
                  onClick={() => setActiveIndustryExplainer(cap.id)}
                  className="p-8 md:p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-brand-accent/20 transition-all group hover:bg-white hover:shadow-2xl text-left"
                 >
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-accent/10 group-hover:text-brand-accent transition-colors mb-8 shadow-sm">{cap.i}</div>
                   <h4 className="text-2xl font-black text-slate-900 mb-3">{cap.t}</h4>
                   <p className="text-sm text-slate-400 font-bold leading-relaxed mb-6">{cap.d}</p>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-accent group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100">
                     View Capabilities <ArrowRight size={12}/>
                   </div>
                 </button>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* MANAGED INTELLIGENCE (BLOG) SECTION */}
      <section ref={insightsSectionRef} className="py-24 md:py-32 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
             <div className="text-left space-y-4">
                <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.4em]">Managed Intelligence</span>
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">Sector Insights.</h2>
                <p className="text-slate-500 font-medium max-w-lg">Advanced methodology for facility procurement, safety compliance, and labor optimization.</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i}`} alt="Advisor" /></div>)}
                </div>
                <div className="text-left">
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Peer Reviewed</p>
                   <p className="text-[11px] font-bold text-slate-400">By TFS Technical Board</p>
                </div>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
             {BLOG_POSTS.map((post) => (
               <button 
                key={post.id} 
                onClick={() => setActiveBlogPost(post)}
                className="group flex flex-col md:flex-row bg-white rounded-[2.5rem] border border-slate-100 hover:border-brand-accent/20 transition-all overflow-hidden hover:shadow-2xl text-left"
               >
                 <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                    <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                 </div>
                 <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{post.category}</span>
                        <span className="flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase tracking-widest"><Clock size={10} /> {post.readTime}</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-brand-accent transition-colors leading-tight">{post.title}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:gap-5 transition-all">
                       Read Strategy <ArrowRight size={14} className="text-brand-accent" />
                    </div>
                 </div>
               </button>
             ))}
          </div>
        </div>
      </section>

      {/* RISK MITIGATION */}
      <section ref={processSectionRef} className="py-24 md:py-32 bg-[#0f172a] text-white relative overflow-hidden scroll-mt-24">
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-10 text-left">
              <div>
                <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Liability & Verification</span>
                <h2 className="text-5xl lg:text-7xl font-black leading-none mb-8 tracking-tighter">Asset Protection <br />Through Coverage.</h2>
                <p className="text-lg text-slate-400 font-medium">Enterprise vendors must protect the client’s bottom line. We maintain industry-leading insurance limits to ensure your asset is covered against every eventuality.</p>
              </div>
              <div className="grid gap-8">
                 {[
                   { t: 'Direct COI Verification', d: 'Instant insurance verification for your procurement department.', i: <FileCheck className="text-brand-accent"/> },
                   { t: 'GPS Staff Tracking', d: 'Geo-fenced verification of all managed labor presence on your site.', i: <Zap className="text-brand-accent"/> },
                   { t: 'Compliance Audits', d: 'Digital QC reports delivered monthly with your budget invoice.', i: <ClipboardCheck className="text-brand-accent"/> },
                 ].map((risk, i) => (
                   <div key={i} className="flex gap-6 group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-accent/20 transition-colors flex-shrink-0 mt-1">{risk.i}</div>
                      <div><h4 className="font-bold text-white text-xl mb-1">{risk.t}</h4><p className="text-sm text-slate-500 font-medium leading-relaxed">{risk.d}</p></div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-sm relative z-10">
              <div className="space-y-10 text-left">
                 <div className="flex justify-between items-center border-b border-white/5 pb-8">
                    <div>
                      <h4 className="text-2xl md:text-3xl font-black tracking-tight">Insurance Depth</h4>
                      <p className="text-xs text-brand-accent font-black uppercase tracking-widest mt-1">Enterprise Ready</p>
                    </div>
                    <ShieldCheck size={48} className="text-brand-accent"/>
                 </div>
                 <div className="grid gap-6">
                    {[
                      { l: 'General Liability', v: '$10,000,000' },
                      { l: 'Excess / Umbrella', v: '$5,000,000' },
                      { l: 'Professional Errors', v: '$2,000,000' },
                      { l: 'Workers Compensation', v: 'Statutory Limits' },
                      { l: 'Employee Fidelity', v: '$1,000,000 Bonded' },
                    ].map((ins, i) => (
                      <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 last:pb-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ins.l}</span>
                        <span className="font-black text-white text-base md:text-lg tracking-tight">{ins.v}</span>
                      </div>
                    ))}
                 </div>
                 <button onClick={() => setIsSchedulerOpen(true)} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 transition-all shadow-xl shadow-white/5">Request Full COI Package</button>
              </div>
           </div>
        </div>
      </section>

      {/* STRATEGIC BUDGETING / CALCULATOR */}
      <section id="quote-section" ref={quoteSectionRef} className="py-24 md:py-32 bg-slate-50 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {wizardStep === 'industry' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-center">
               <div className="mb-12 md:mb-16">
                 <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-4 block">Step 1 of 3</span>
                 <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight">Get Your Quote.</h2>
                 <p className="text-slate-500 mt-4 font-medium text-base md:text-lg max-w-2xl mx-auto">Select your sector to initialize the custom labor allocation calculation for your portfolio.</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                 {[
                   { id: 'education', icon: <GraduationCap size={40} />, title: 'Education', desc: 'K-12 & University' },
                   { id: 'office', icon: <Building2 size={40} />, title: 'Class-B Office', desc: 'Managed Portfolios' },
                   { id: 'medical', icon: <Stethoscope size={40} />, title: 'Medical/Clinical', desc: 'Sterile Facilities' },
                   { id: 'retail', icon: <Store size={40} />, title: 'Retail Stores', desc: 'Big Box/Anchor' },
                   { id: 'hoa', icon: <Users size={40} />, title: 'HOA/Apartments', desc: 'Common Area Care' },
                   { id: 'hotel', icon: <Hotel size={40} />, title: 'Hotels', desc: 'Public & BOH' },
                   { id: 'warehouse', icon: <Warehouse size={40} />, title: 'Warehouse', desc: 'Logistics/Ind.' },
                   { id: 'government', icon: <GanttChartSquare size={40} />, title: 'Government', desc: 'Municipal/Public' },
                 ].map((item) => (
                   <button key={item.id} onClick={() => selectIndustry(item.id as IndustryType)} className="group flex flex-col items-center text-center p-8 md:p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-brand-accent hover:shadow-2xl hover:shadow-brand-accent/10 transition-all">
                     <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-brand-accent/10 group-hover:text-brand-accent mb-6 transition-all">{item.icon}</div>
                     <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                   </button>
                 ))}
               </div>
            </div>
          )}

          {wizardStep === 'objective' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
               <div className="text-center mb-12 md:mb-16">
                 <button onClick={() => setWizardStep('industry')} className="text-brand-accent text-[10px] font-black uppercase tracking-widest mb-6 inline-flex items-center gap-2 hover:translate-x-[-4px] transition-transform"><ChevronLeft size={14} /> Back to Sector</button>
                 <span className="text-brand-accent text-xs font-black uppercase tracking-[0.4em] mb-4 block">Step 2 of 3</span>
                 <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">Budgetary <br className="md:hidden"/> Objective.</h2>
               </div>
               <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto px-2">
                 <button onClick={() => selectObjective('recurring')} className="group p-8 md:p-12 bg-white border-2 border-slate-100 rounded-[3rem] text-left hover:border-brand-accent hover:shadow-2xl transition-all">
                   <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-brand-accent mb-8"><Calendar size={32} /></div>
                   <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Recurring Maintenance</h4>
                   <p className="text-slate-500 font-medium leading-relaxed mb-8 text-base md:text-lg">Daily managed precision maintenance delivered as a fixed, all-inclusive monthly budget for long-term care.</p>
                   <div className="text-brand-accent text-xs font-black uppercase tracking-widest flex items-center gap-2">Initialize Quote <ArrowRight size={14} /></div>
                 </button>
                 <button onClick={() => selectObjective('onetime')} className="group p-8 md:p-12 bg-[#0f172a] text-white border-2 border-slate-800 rounded-[3rem] text-left hover:border-brand-accent hover:shadow-2xl transition-all">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-accent mb-8"><Sparkles size={32} /></div>
                   <h4 className="text-2xl md:text-3xl font-black mb-4">RFP / Specific Project</h4>
                   <p className="text-slate-400 font-medium leading-relaxed mb-8 text-base md:text-lg">One-time deep sanitation, project scope estimation, or specific RFP invitation for portfolio restoration.</p>
                   <div className="text-brand-accent text-xs font-black uppercase tracking-widest flex items-center gap-2">Get Project Estimate <ArrowRight size={14} /></div>
                 </button>
               </div>
            </div>
          )}

          {wizardStep === 'calculator' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-200">
                 <div className="flex items-center gap-4">
                    <button onClick={() => setWizardStep('objective')} className="text-slate-400 hover:text-slate-900"><ChevronLeft size={24}/></button>
                    <div className="px-4 py-2 bg-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">{settings.industry} • {settings.serviceType}</div>
                 </div>
                 <button onClick={resetApp} className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest">Start New Assessment</button>
               </div>
               
               <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
                  <div className="lg:col-span-8 space-y-8 md:space-y-12 text-left">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-14 shadow-sm">
                      <h3 className="text-2xl font-black mb-8 md:mb-10 flex items-center gap-4">
                        <span className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-bold">1</span>
                        Facility Parameters
                      </h3>
                      <div className="space-y-10 md:space-y-12">
                        {settings.industry === 'education' && (
                          <div className="space-y-12 md:space-y-16">
                            <RoomList rooms={rooms} onChange={setRooms} industry="education" />
                            <div className="pt-8 border-t border-slate-100">
                               <PorterList porters={porters} onChange={setPorters} />
                            </div>
                          </div>
                        )}
                        {settings.industry === 'hotel' && (
                           <div className="space-y-8 md:space-y-12">
                              <div className="p-6 md:p-8 bg-teal-50/50 border border-teal-100 rounded-[2rem] space-y-6 md:space-y-8">
                                <h4 className="text-xl font-black text-slate-900 flex items-center gap-3"><Hotel className="text-brand-accent" size={24} /> BOH Operational Support</h4>
                                <div className="space-y-6">
                                  <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Managed Keys</label>
                                    <span className="text-2xl md:text-3xl font-black text-brand-accent">{settings.hotelRooms} <span className="text-sm text-slate-400">Rooms</span></span>
                                  </div>
                                  <input type="range" min="10" max="1000" step="10" value={settings.hotelRooms} onChange={e => setSettings({...settings, hotelRooms: parseInt(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                                </div>
                              </div>
                              <div className="p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-6 md:space-y-8">
                                <h4 className="text-xl font-black text-slate-900 flex items-center gap-3"><Layers className="text-brand-accent" size={24} /> Public Area Logistics</h4>
                                <div className="space-y-6">
                                  <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Common Sq Ft</label>
                                    <span className="text-2xl md:text-3xl font-black text-brand-accent">{settings.squareFootage.toLocaleString()} <span className="text-sm text-slate-400">SQ FT</span></span>
                                  </div>
                                  <input type="range" min="1000" max="150000" step="5000" value={settings.squareFootage} onChange={e => setSettings({...settings, squareFootage: parseInt(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                                </div>
                              </div>
                           </div>
                        )}
                        {['office', 'medical', 'warehouse', 'retail', 'hoa', 'government'].includes(settings.industry) && settings.industry !== 'hotel' && (
                          <div className="space-y-10 md:space-y-12">
                               <div className="space-y-6">
                                  <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portfolio Square Footage</label>
                                    <span className="text-2xl md:text-3xl font-black text-brand-accent">{settings.squareFootage.toLocaleString()} <span className="text-sm text-slate-400">SQ FT</span></span>
                                  </div>
                                  <input type="range" min="1000" max="100000" step="1000" value={settings.squareFootage} onChange={e => setSettings({...settings, squareFootage: parseInt(e.target.value)})} className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
                                </div>
                            {settings.industry === 'retail' && (
                               <div className="grid md:grid-cols-2 gap-8 md:gap-12 pt-8 border-t border-slate-100">
                                  <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store Scale</label>
                                    <div className="grid gap-3">
                                      {[{id:'small',l:'Boutique',d:'1-3k'},{id:'medium',l:'Mid-Market',d:'3-7k'},{id:'large',l:'Big Box',d:'7k+'}].map(t => (
                                        <button key={t.id} onClick={() => setSettings({...settings, retailSize: t.id as any})} className={`p-5 md:p-6 rounded-2xl text-left border-2 transition-all ${settings.retailSize === t.id ? 'border-brand-accent bg-teal-50 text-teal-800' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                                          <div className="font-black text-sm md:text-base">{t.l}</div><div className="text-[10px] font-bold opacity-60 uppercase">{t.d}</div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                               </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-8 md:mt-12">
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
                  </div>

                  <aside className="lg:col-span-4 lg:sticky lg:top-32 w-full">
                    {!isUnlocked ? (
                      <div className="bg-[#0f172a] text-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl text-center space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent animate-pulse"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-brand-accent border border-white/10"><Lock size={32}/></div>
                        <div>
                          <h4 className="text-2xl md:text-3xl font-black tracking-tighter mb-4 text-left">Strategic Model Ready</h4>
                          <p className="text-slate-400 font-medium text-left text-sm md:text-base leading-relaxed">Enter your professional email to reveal the calculated monthly labor budget for this sector.</p>
                        </div>
                        <form onSubmit={handleUnlock} className="space-y-4">
                           <div className="relative">
                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                             <input 
                              required
                              type="email" 
                              placeholder="Corporate Email" 
                              value={unlockEmail}
                              onChange={(e) => setUnlockEmail(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 font-bold text-white focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all"
                             />
                           </div>
                           <button type="submit" disabled={isUnlocking} className="w-full bg-brand-accent hover:bg-brand-accentLight py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-accent/20 transition-all flex items-center justify-center gap-3">
                             {isUnlocking ? <><Loader2 className="animate-spin" size={16}/> CAPTURING...</> : 'Unlock Target Quote'}
                           </button>
                        </form>
                      </div>
                    ) : (
                      <div className="bg-[#0f172a] text-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-white/5 animate-in zoom-in-95 duration-500 text-left">
                        <div className="space-y-8 md:space-y-10">
                          <div>
                            <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Target Monthly Labor Budget</span>
                            <div className="text-4xl md:text-5xl font-black tracking-tighter">
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
                            <div className="flex items-center gap-2 text-teal-400"><FileText size={14}/><span className="text-[10px] font-black uppercase tracking-widest">Pricing Strategy</span></div>
                            <p className="text-[11px] text-slate-400 italic leading-relaxed font-medium">"{quote.justification}"</p>
                          </div>
                          <button onClick={() => setIsSchedulerOpen(true)} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all shadow-xl shadow-white/5">Schedule Site Audit</button>
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
      <footer className="bg-[#0f172a] text-white py-16 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-24 text-left">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <LogoIcon className="w-10 h-10 md:w-12 md:h-12" light={true} />
              <span className="font-black text-xl md:text-2xl tracking-tighter uppercase leading-tight">TOTAL FACILITY SERVICES LLC</span>
            </div>
            <p className="text-slate-400 text-base md:text-lg font-medium max-w-sm leading-relaxed">Strategic maintenance for multi-site portfolios across NY, FL, NJ, & CT. Managed labor, predictable outcomes, asset protection.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-12 text-slate-400 font-bold">
            <div className="space-y-4">
              <h4 className="text-white text-[10px] uppercase tracking-widest font-black">Enterprise Support</h4>
              <p className="text-brand-accent text-2xl md:text-3xl font-black tracking-tighter leading-none">(844) 454-3101</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black">© 2024 Total Facility Services LLC.</p>
            </div>
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