import React, { useState, useEffect } from 'react';
import { LeadData, QuoteCalculations, RoomType, IndustryType, ServiceType } from '../types';
import { Mail, Phone, Building2, User, CheckCircle2, ShieldCheck, Lock, ArrowRight, Upload, Info, Loader2 } from './ui/Icons';
import emailjs from '@emailjs/browser';

interface LeadFormProps {
  quote: QuoteCalculations;
  rooms: RoomType[];
  industry: IndustryType;
  serviceType: ServiceType;
  initialEmail?: string; 
  onSubmit: (data: LeadData) => void;
  onSchedule: () => void;
  onReset?: () => void;
}

const EMAILJS_SERVICE_ID = "service_srv6b3k"; 
const EMAILJS_TEMPLATE_ID_QUOTE = "template_ljs0669"; // Customer Facing
const EMAILJS_TEMPLATE_ID_INTERNAL = "template_12yvcvz"; // Owner Facing
const EMAILJS_PUBLIC_KEY = "4ye26ZtWxpi6Pkk5f";
const INTERNAL_RECIPIENT = "info@thetotalfacility.com";

const LeadForm: React.FC<LeadFormProps> = ({ quote, industry, serviceType, initialEmail, onSubmit, onSchedule, onReset }) => {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    bestTime: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      email: initialEmail || prev.email, 
      industry,
      serviceType
    }));
  }, [initialEmail, industry, serviceType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);

    const formattedTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const baseParams = {
      from_name: "TOTAL FACILITY SERVICES LLC",
      name: formData.name,              
      company: formData.company,        
      phone: formData.phone,            
      email: formData.email,
      quote_total: `$${quote.grandTotal.toFixed(2)} / mo`, 
      time: formattedTime,              
      reply_to: formData.email,
      notes: `Strategic Quote for ${industry} sector (${serviceType}). User Notes: ${formData.notes || 'None provided.'}`
    };

    try {
      // TRIPLE CAPTURE - STAGE 3: Full Quote Strategic Alert
      await Promise.all([
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_QUOTE, { ...baseParams, to_email: formData.email }, EMAILJS_PUBLIC_KEY),
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_INTERNAL, { ...baseParams, to_email: INTERNAL_RECIPIENT }, EMAILJS_PUBLIC_KEY)
      ]);
    } catch (err) {
      console.error("Transmission Error:", err);
    } finally {
      setIsSending(false);
      setSubmitted(true);
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof LeadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStartNew = () => {
    setSubmitted(false);
    setIsSending(false);
    setFormData({ name: '', company: '', email: '', phone: '', bestTime: '', notes: '' });
    if (onReset) onReset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 text-center shadow-2xl animate-in fade-in zoom-in duration-500 max-w-4xl mx-auto">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <CheckCircle2 size={24} />
          </div>
        </div>
        <h3 className="text-2xl md:text-4xl font-black text-[#0f172a] mb-6 tracking-tight leading-tight">Capabilities Dispatched!</h3>
        <p className="text-slate-500 text-sm md:text-lg mb-8 md:mb-12 max-w-xl mx-auto leading-relaxed font-medium">
          The preliminary strategy has been sent to <span className="text-slate-900 font-bold">{formData.email}</span>. An account director will reach out for a technical walkthrough.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
           <button onClick={onSchedule} className="bg-[#0d9488] text-white px-8 py-4 md:px-12 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] md:text-[13px] hover:bg-[#14b8a6] transition-all shadow-xl shadow-teal-500/20 active:scale-95">
             FINALIZE ASSESSMENT
           </button>
           <button onClick={handleStartNew} className="bg-[#f1f5f9] text-[#475569] px-8 py-4 md:px-12 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] md:text-[13px] hover:bg-[#e2e8f0] transition-all active:scale-95">
             START NEW
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl relative overflow-hidden group text-left">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-accent/10 transition-colors"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Finalize Strategy Request</h3>
        </div>
        <p className="text-slate-500 mb-8 md:mb-10 font-medium text-sm md:text-base leading-relaxed">Enterprise portfolios require specific labor allocation. Submit details to receive the full Capability Statement.</p>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Contact Name</label>
              <div className="relative"><User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input required type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all text-sm" placeholder="John Doe" /></div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Organization</label>
              <div className="relative"><Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input required type="text" value={formData.company} onChange={e => handleChange('company', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all text-sm" placeholder="Acme Inc." /></div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Corporate Email</label>
              <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input required type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all text-sm" placeholder="john@company.com" /></div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Direct Line</label>
              <div className="relative"><Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input required type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all text-sm" placeholder="(555) 000-0000" /></div>
            </div>
          </div>

          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 mx-auto shadow-sm"><Upload size={20}/></div>
             <div><h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Invite Us to Bid (RFP/RFQ)</h4><p className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-xs mx-auto">Mention specific specs or access protocols in the notes below.</p></div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Project Notes / RFP Link</label>
            <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all min-h-[100px] text-sm" placeholder="Location details, square footage updates..." />
          </div>

          <button type="submit" disabled={isSending} className="w-full group relative bg-brand-accent hover:bg-brand-accentLight text-white font-black py-5 rounded-2xl shadow-xl shadow-brand-accent/20 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-[10px] md:text-xs active:scale-[0.98]">
            <span className="flex items-center justify-center gap-3">
              {isSending ? <><Loader2 className="animate-spin" size={16}/> Sending Full Quote...</> : 'Request Enterprise Capability Statement'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform hidden md:block" />
            </span>
          </button>
          
          <div className="flex items-center justify-center gap-4 text-[9px] text-slate-400 font-black uppercase tracking-widest">
            <div className="flex items-center gap-1"><Lock size={10} /> Secure</div>
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <div className="flex items-center gap-1"><Info size={10} /> Privacy Guaranteed</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;