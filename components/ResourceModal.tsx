
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, FileText, Mail, User, Building2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { leadService } from '../utils/leadService';
import emailjs from '@emailjs/browser';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMAILJS_SERVICE_ID = "service_srv6b3k"; 
const EMAILJS_TEMPLATE_ID_QUOTE = "template_ljs0669"; 
const EMAILJS_PUBLIC_KEY = "4ye26ZtWxpi6Pkk5f";

const ResourceModal: React.FC<ResourceModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', email: '' });

  useEffect(() => {
    if (isOpen) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);

    try {
      // 1. CAPTURE LEAD DATA via LeadService (Sheets + Internal Alert)
      await leadService.submitLead({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        funnel_stage: 'RESOURCE',
        notes: `User requested Capability Statement and Technical Packages.`
      });

      // 2. Send Automated Confirmation (EmailJS)
      await emailjs.send(
        EMAILJS_SERVICE_ID, 
        EMAILJS_TEMPLATE_ID_QUOTE, 
        { 
          to_email: formData.email,
          name: formData.name,
          company: formData.company,
          quote_total: "Technical Package Request",
          industry: "All Sectors"
        }, 
        EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
    } catch (err) {
      console.error("Transmission Error:", err);
      setSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 md:p-14">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-transform hover:scale-110"><X size={24} /></button>
          
          {submitted ? (
            <div className="text-center py-8 md:py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-brand-accent shadow-inner">
                <CheckCircle2 size={40} className="md:w-[48px]" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">Packages Dispatched</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto text-sm md:text-base">Our technical capability packages and NY/FL/NJ/CT case studies are being routed to <span className="text-slate-900 font-bold">{formData.email}</span>.</p>
              </div>
              <button onClick={onClose} className="px-10 py-4 md:px-12 md:py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-[11px] hover:bg-slate-800 transition-all shadow-lg active:scale-95">Return to Site</button>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-10 text-left">
              <div>
                <div className="flex items-center gap-3 mb-4 text-brand-accent">
                   <ShieldCheck size={20} />
                   <span className="text-[9px] font-black uppercase tracking-[0.3em]">Documentation Access</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">Request Sector <br />Capabilities Statement.</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">Complete the request to receive our full enterprise bidding packages, technical pathogen logs, and insurance COI examples.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="grid gap-4">
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-accent transition-colors" size={18} />
                    <input required type="text" placeholder="Full Name" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 focus:border-brand-accent focus:bg-white outline-none transition-all text-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="relative group">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-accent transition-colors" size={18} />
                    <input required type="text" placeholder="Organization" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 focus:border-brand-accent focus:bg-white outline-none transition-all text-sm" onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-accent transition-colors" size={18} />
                    <input required type="email" placeholder="Corporate Email" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 focus:border-brand-accent focus:bg-white outline-none transition-all text-sm" onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                
                <div className="bg-teal-50 border border-teal-100 p-5 rounded-2xl space-y-2">
                   <div className="flex items-center gap-2 text-brand-accent font-black text-[9px] uppercase tracking-widest">
                     <FileText size={12} /> What's Included:
                   </div>
                   <p className="text-[10px] md:text-[11px] text-teal-800/70 font-bold leading-relaxed">
                     Technical Bid Package • Pathogen Compliance Logs • Insurance COI Limits • Case Studies for NY/FL/NJ/CT Portfolios.
                   </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSending}
                  className="w-full bg-brand-accent hover:bg-brand-accentLight text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-[11px] shadow-xl shadow-brand-accent/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98]"
                >
                  {isSending ? (
                    <><Loader2 className="animate-spin" size={18} /> CAPTURING...</>
                  ) : (
                    <>Download Technical Packages <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
              <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-widest">Instant Delivery via Secure Managed Portal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;
