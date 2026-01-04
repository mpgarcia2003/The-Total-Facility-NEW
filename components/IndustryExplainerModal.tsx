
import React from 'react';
import { X, CheckCircle2, Building2, ShieldCheck, GraduationCap, Zap, Clock, Users, Stethoscope, Warehouse, ShieldAlert, FileText } from 'lucide-react';

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
    title: "Campus Logistics Model",
    subtitle: "K-12 & Higher Education Portfolio Support",
    icon: <GraduationCap size={20} />,
    intro: "Education maintenance is about more than cleaning; it's about student safety and faculty continuity. We deploy managed labor models that handle the heavy daily traffic of a campus while ensuring 100% compliance with school board safety protocols.",
    coreItems: [
      "Integrated Day Porter staffing for restroom rotations",
      "Child-safe, EPA-approved disinfection (N-List)",
      "Multi-site campus logistics coordination",
      "Event cleanup & graduation support"
    ],
    preventativeItems: [
      "Amortized Summer floor stripping/waxing",
      "Winter salt-mitigation floor care",
      "Classroom high-surface disinfection logs",
      "Break-period deep sanitation cycles"
    ],
    industryFocus: [
      "K-12 Charter School Networks",
      "Higher Education Campuses",
      "Private Academic Institutions"
    ]
  },
  healthcare: {
    title: "Terminal Cleaning Capability",
    subtitle: "Medical Grade Sanitation for Sterile Environments",
    icon: <Stethoscope size={20} />,
    intro: "Zero margin for error. Our healthcare model follows terminal cleaning standards designed for surgical centers and clinics. We bridge the gap between janitorial service and regulated infection control.",
    coreItems: [
      "Terminal cleaning for OR and Exam rooms",
      "Pathogen control logs & verification",
      "HIPAA-compliant, background-checked crews",
      "Strict bio-hazard surface protocols"
    ],
    preventativeItems: [
      "Medical-grade sterile floor finishing",
      "HEPA-filter filtration maintenance",
      "Quarterly sterile-zone deep-audits",
      "Amortized HVAC vent sanitation"
    ],
    industryFocus: [
      "Multi-Site Clinical Portfolios",
      "Surgical Centers & Specialized Med",
      "Urgent Care Networks"
    ]
  },
  cre: {
    title: "Class-A Portfolio Maintenance",
    subtitle: "High-Visibility Support for Prestigious Office Assets",
    icon: <Building2 size={20} />,
    intro: "In Class-A real estate, tenant retention is driven by the 'First Impression.' Our CRE model focuses on high-polish lobbies, pristine common areas, and a visible, professional labor presence that reflects your asset's value.",
    coreItems: [
      "Elite lobby and high-traffic stone maintenance",
      "Day Porter high-touch sanitization cycles",
      "Tenant space custom maintenance programs",
      "After-hours floor burnishing logs"
    ],
    preventativeItems: [
      "Amortized carpet care for common areas",
      "Marble & Granite stone refinishing cycles",
      "Winter salt-wash floor programs",
      "Quarterly glass & high-bay dusting"
    ],
    industryFocus: [
      "High-Rise Commercial Towers",
      "Multi-Tenant Class-A Plazas",
      "Corporate Headquarters"
    ]
  },
  industrial: {
    title: "Logistics Center Support",
    subtitle: "Managed Maintenance for Large-Scale Industrial Assets",
    icon: <Warehouse size={20} />,
    intro: "Logistics and warehousing environments are brutal on infrastructure. Our industrial model deploys heavy-duty floor scrubbing logistics and high-bay maintenance designed for facilities operating 24/7.",
    coreItems: [
      "Large-scale ride-on scrubber logistics",
      "High-bay and structural dusting",
      "Dock area and breakroom sanitation",
      "Multi-shift labor coordination"
    ],
    preventativeItems: [
      "Amortized concrete floor sealing",
      "Heavy-duty grease & oil mitigation",
      "Semi-annual high-surface structural cleaning",
      "Safety line painting & maintenance"
    ],
    industryFocus: [
      "Regional Fulfillment Centers",
      "Cold Storage & Logistics Hubs",
      "Large-Scale Manufacturing Sites"
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
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">{content.title}</h3>
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
            <h4 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">Strategic. Scalable. Compliant.</h4>
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
                Core Managed Operations
              </h5>
              <ul className="space-y-4 text-slate-500 font-bold text-sm leading-relaxed">
                {content.coreItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-brand-accent mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8">
              <h5 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-brand-accent">
                  <ShieldCheck size={18} />
                </div>
                Amortized Technical Care
              </h5>
              <div className="inline-block px-3 py-1 bg-white border border-teal-100 rounded-lg text-[10px] font-black text-brand-accent uppercase tracking-widest">
                Included in Monthly Budget
              </div>
              <ul className="space-y-4 text-slate-500 font-bold text-sm leading-relaxed">
                {content.preventativeItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-brand-accent mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enterprise Justification */}
          <section className="bg-brand-accent text-white p-12 rounded-[3rem] shadow-2xl shadow-brand-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7 space-y-8">
                <h5 className="text-3xl font-black tracking-tight">Enterprise Portfolio Continuity</h5>
                <p className="text-white/80 leading-relaxed font-bold text-lg">
                  Large assets fail when labor is inconsistent. We leverage GPS-verified presence and digital compliance logs to ensure every square foot of your portfolio is maintained to ISO-level standards.
                </p>
                <div className="flex flex-wrap gap-4">
                  {['Background Checked', 'Liability Shielded', 'Audit Ready'].map((badge) => (
                    <div key={badge} className="px-5 py-2.5 bg-white/10 rounded-full text-[10px] font-black border border-white/20 flex items-center gap-2 uppercase tracking-widest">
                      <ShieldCheck size={12} /> {badge}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="bg-white/10 p-10 rounded-[2rem] border border-white/20 backdrop-blur-xl">
                  <h6 className="text-[10px] uppercase tracking-[0.3em] font-black mb-8 text-white/60">Risk Management Package:</h6>
                  <ul className="space-y-6 text-sm font-black">
                    {[
                      'Direct Insurance Feed', 
                      'Site-Specific Safety Plans', 
                      'Managed Compliance Portals'
                    ].map((label) => (
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

          {/* Who We Serve */}
          <div className="py-12 border-t border-slate-100">
             <h5 className="text-xl font-black text-slate-900 mb-8">Asset Class Experience:</h5>
             <div className="flex flex-wrap gap-4">
                {content.industryFocus.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-8 py-5 bg-white border-2 border-slate-50 shadow-sm rounded-2xl hover:border-brand-accent/30 transition-all cursor-default">
                    <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-brand-accent">
                      <ShieldCheck size={14} />
                    </div>
                    <span className="font-black text-slate-800 text-sm">{item}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-slate-100">
             <button 
              onClick={onClose}
              className="px-10 py-5 bg-brand-accent text-white font-black rounded-2xl shadow-xl shadow-brand-accent/20 transition-all text-sm uppercase tracking-widest"
             >
               Request Capability PDF
             </button>
             <button 
              onClick={() => { onClose(); /* Handle trigger scheduler */ }}
              className="px-10 py-5 bg-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-all text-sm uppercase tracking-widest"
             >
               Speak With Account Director
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryExplainerModal;
