import React from 'react';
import { X, CheckCircle2, Building2, ShieldCheck, GraduationCap, Zap, Clock, Users, Stethoscope } from 'lucide-react';

interface IndustryExplainerModalProps {
  industryId: string | null;
  onClose: () => void;
}

interface ExplainerContent {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  intro: string;
  coreItems: string[];
  preventativeItems: string[];
  industryFocus: string[];
}

const INDUSTRY_CONTENT: Record<string, ExplainerContent> = {
  education: {
    title: "How Our Monthly Facility Service Model Works",
    subtitle: "A Predictable Approach for Schools & Educational Facilities",
    icon: <GraduationCap size={20} />,
    intro: "At The Facility Services LLC, we understand that schools need clean, safe, and fully operational buildings — without surprise invoices or fragmented vendors. Our all-inclusive model is designed specifically for educational environments.",
    coreItems: [
      "Daily or nightly cleaning (classrooms, offices, common areas)",
      "Restroom sanitation & restocking",
      "Trash removal & surface disinfection",
      "EPA-approved products safe for school environments"
    ],
    preventativeItems: [
      "Summer floor stripping & waxing",
      "Winter wash & wax programs",
      "Scheduled burnishing & maintenance",
      "Carpet & upholstery shampooing (as required)",
      "Deep cleaning during school breaks"
    ],
    industryFocus: [
      "K–12 schools & charter networks",
      "Private & religious schools",
      "Multi-campus educational facilities"
    ]
  },
  healthcare: {
    title: "Sterile Facility Management Model",
    subtitle: "Medical Grade Sanitation for Healthcare & Clinical Spaces",
    icon: <Stethoscope size={20} />,
    intro: "Healthcare facilities require zero margin for error. Our specialized medical cleaning protocols ensure patient safety and regulatory compliance through a consistent, all-inclusive monthly labor model.",
    coreItems: [
      "Terminal cleaning for operating & exam rooms",
      "High-level disinfection of patient touchpoints",
      "Strict bloodborne pathogen compliance",
      "Infection control & cross-contamination prevention"
    ],
    preventativeItems: [
      "HEPA-filter vacuuming & air quality support",
      "Medical-grade floor sterilization",
      "Quarterly deep sanitation of waiting areas",
      "Bio-waste disposal coordination",
      "Scheduled sterile-zone audits"
    ],
    industryFocus: [
      "Urgent care & surgical centers",
      "Specialized clinical offices",
      "Long-term care facilities"
    ]
  },
  cre: {
    title: "Class-A Portfolio Maintenance Strategy",
    subtitle: "High-Visibility Maintenance for Commercial Real Estate",
    icon: <Building2 size={20} />,
    intro: "For property managers of premium commercial space, tenant retention starts in the lobby. We deliver high-polish environments through an amortized budget that covers both daily upkeep and prestigious periodic care.",
    coreItems: [
      "Lobby & common area high-polish maintenance",
      "High-visibility daytime porter presence",
      "Tenant space customized cleaning schedules",
      "Detailed window & glass surfacing"
    ],
    preventativeItems: [
      "Periodic high-speed floor burnishing",
      "Upholstery care for designer common areas",
      "Amortized annual deep stone/marble care",
      "Winter floor salt neutralization",
      "HVAC filter & light repair support"
    ],
    industryFocus: [
      "Class-A Corporate Office Towers",
      "Multi-Tenant Business Parks",
      "Regional Commercial Portfolios"
    ]
  },
  hoa: {
    title: "Community-First Maintenance Model",
    subtitle: "Consistent Care for HOA & Multi-Family Residential Groups",
    icon: <Users size={20} />,
    intro: "Managing resident expectations requires consistent, visible maintenance. Our community model ensures that clubhouses, pool houses, and shared corridors are always pristine through a single, flat monthly HOA budget.",
    coreItems: [
      "Clubhouse & gym daily sanitation",
      "Shared corridor & elevator cleaning",
      "Pool house & outdoor restroom upkeep",
      "Trash valet & compactor area management"
    ],
    preventativeItems: [
      "Periodic tile & grout power-washing",
      "Annual common area floor refinishing",
      "Pressure washing of high-traffic walkways",
      "Amortized carpet care for residential halls",
      "Quarterly light fixture & signage cleaning"
    ],
    industryFocus: [
      "Gated Community Clubhouses",
      "Luxury High-Rise Condominiums",
      "Managed Townhome Associations"
    ]
  }
};

const IndustryExplainerModal: React.FC<IndustryExplainerModalProps> = ({ industryId, onClose }) => {
  if (!industryId) return null;

  const content = INDUSTRY_CONTENT[industryId] || INDUSTRY_CONTENT.education;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl h-[92vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-accent/20">
              {content.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1.5">{content.title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{content.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-14 space-y-14">
          
          {/* Intro Section */}
          <section className="max-w-4xl">
            <h4 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">Simple. Predictable. All-Inclusive.</h4>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              {content.intro}
            </p>
          </section>

          {/* Core Daily vs Preventative Care */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8">
              <h5 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-brand-accent">
                  <CheckCircle2 size={18} />
                </div>
                Core Daily Maintenance
              </h5>
              <ul className="space-y-4 text-slate-500 font-bold text-sm leading-relaxed">
                {content.coreItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">• {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8">
              <h5 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-brand-accent">
                  <ShieldCheck size={18} />
                </div>
                Included Preventative Care
              </h5>
              <div className="inline-block px-3 py-1 bg-white border border-teal-100 rounded-lg text-[10px] font-black text-brand-accent uppercase tracking-widest">
                Included — Not Extra
              </div>
              <ul className="space-y-4 text-slate-500 font-bold text-sm leading-relaxed">
                {content.preventativeItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Why We Amortize - Premium Teal Box */}
          <section className="bg-brand-accent text-white p-12 rounded-[3rem] shadow-2xl shadow-brand-accent/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7 space-y-8">
                <h5 className="text-3xl font-black tracking-tight">Why We Amortize Annual Services</h5>
                <p className="text-white/80 leading-relaxed font-bold text-lg">
                  Instead of large one-time invoices during peak seasonal maintenance windows, we spread annual deep cleaning and specialty services evenly across the year. This ensures your facility receives full care with no price shock.
                </p>
                <div className="flex flex-wrap gap-4">
                  {['No price shock', 'Predictable Budgeting', 'Reliable Care'].map((badge) => (
                    <div key={badge} className="px-5 py-2.5 bg-white/10 rounded-full text-[10px] font-black border border-white/20 flex items-center gap-2 uppercase tracking-widest">
                      <CheckCircle2 size={12} /> {badge}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="bg-white/10 p-10 rounded-[2rem] border border-white/20 backdrop-blur-xl">
                  <h6 className="text-[10px] uppercase tracking-[0.3em] font-black mb-8 text-white/60">The Monthly Budget Includes:</h6>
                  <ul className="space-y-6 text-sm font-black">
                    {['Recurring Janitorial', 'Amortized Floor/Carpet Care', '24/7 Priority Support'].map((label) => (
                      <li key={label} className="flex justify-between items-center pb-5 border-b border-white/10 last:border-0 last:pb-0">
                        <span>{label}</span>
                        <CheckCircle2 size={18} className="text-teal-200" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Proudly Serve Tags */}
          <div className="py-12 border-t border-slate-100">
             <h5 className="text-xl font-black text-slate-900 mb-8">We Proudly Serve:</h5>
             <div className="flex flex-wrap gap-4">
                {content.industryFocus.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-8 py-5 bg-white border-2 border-slate-50 shadow-sm rounded-2xl hover:border-brand-accent/30 transition-all cursor-default">
                    <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-brand-accent">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="font-black text-slate-800 text-sm">{item}</span>
                  </div>
                ))}
             </div>
          </div>

          <footer className="text-center pt-8 pb-12">
            <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-[10px] mb-10">Everything Your Building Needs. All in One Place.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default IndustryExplainerModal;