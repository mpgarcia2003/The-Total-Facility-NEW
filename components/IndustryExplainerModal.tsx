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
    icon: <GraduationCap size={24} />,
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
    icon: <Stethoscope size={24} />,
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
    icon: <Building2 size={24} />,
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
    icon: <Users size={24} />,
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
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl h-[90vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-float">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-white">
              {content.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{content.title}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{content.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
          
          {/* Intro */}
          <section className="max-w-3xl">
            <h4 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Simple. Predictable. All-Inclusive.</h4>
            <p className="text-lg text-slate-600 leading-relaxed">
              {content.intro}
            </p>
          </section>

          {/* Scope Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
              <h5 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <CheckCircle2 className="text-brand-accent" size={24} /> 
                Core Daily Maintenance
              </h5>
              <ul className="space-y-4 text-slate-600 font-medium text-sm">
                {content.coreItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">• {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
              <h5 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <ShieldCheck className="text-brand-accent" size={24} /> 
                Included Preventative Care
              </h5>
              <p className="text-xs font-bold text-brand-accent uppercase tracking-widest">Included — Not Extra</p>
              <ul className="space-y-4 text-slate-600 font-medium text-sm">
                {content.preventativeItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Amortization Explanation */}
          <section className="bg-brand-accent text-white p-10 rounded-[2.5rem] shadow-2xl shadow-brand-accent/20">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <h5 className="text-2xl font-black tracking-tight">Why We Amortize Annual Services</h5>
                <p className="text-white/80 leading-relaxed font-medium">
                  Instead of large one-time invoices during peak seasonal maintenance windows, we spread annual deep cleaning and specialty services evenly across the year. This ensures your facility receives full care with no price shock.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold border border-white/20">✔ No price shock</div>
                  <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold border border-white/20">✔ Predictable Budgeting</div>
                  <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold border border-white/20">✔ Reliable Care</div>
                </div>
              </div>
              <div className="bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-md">
                <h6 className="text-xs uppercase tracking-widest font-black mb-6 opacity-70">The Monthly Budget Includes:</h6>
                <ul className="space-y-4 text-sm font-bold">
                  <li className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span>Recurring Janitorial</span>
                    <CheckCircle2 size={16} />
                  </li>
                  <li className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span>Amortized Floor/Carpet Care</span>
                    <CheckCircle2 size={16} />
                  </li>
                  <li className="flex justify-between items-center">
                    <span>24/7 Priority Support</span>
                    <CheckCircle2 size={16} />
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Industry Focus List */}
          <div className="py-12 border-t border-slate-100">
             <h5 className="text-xl font-black text-slate-900 mb-8">We Proudly Serve:</h5>
             <div className="flex flex-wrap gap-4">
                {content.industryFocus.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <CheckCircle2 className="text-brand-accent" size={18} />
                    <span className="font-bold text-slate-800">{item}</span>
                  </div>
                ))}
             </div>
          </div>

          <footer className="text-center py-10 border-t border-slate-100">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">Everything Your Building Needs. All in One Place.</p>
            <button 
              onClick={onClose}
              className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm"
            >
              Close Explainer
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default IndustryExplainerModal;