
import React, { useState, useEffect } from 'react';
import { LeadData, QuoteCalculations, RoomType, IndustryType, ServiceType } from '../types';
import { Mail, Phone, Building2, User, CheckCircle2, ShieldCheck, Lock, ArrowRight, Upload, Info } from './ui/Icons';
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
const EMAILJS_TEMPLATE_ID_QUOTE = "template_ljs0669"; 
const EMAILJS_TEMPLATE_ID_INTERNAL = "template_12yvcvz"; 
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
      quote_total: `$${quote.grandTotal.toFixed(2)}`, 
      time: formattedTime,              
      reply_to: formData.email,
      notes: formData.notes
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_QUOTE,
        { ...baseParams, to_email: formData.email },
        EMAILJS_PUBLIC_KEY
      );
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_INTERNAL,
        { ...baseParams, to_email: INTERNAL_RECIPIENT },
        EMAILJS_PUBLIC_KEY
      );
    } catch (err) {
      console.error("Transmission Error:", err);
    }

    setIsSending(false);
    setSubmitted(true);
    onSubmit(formData);
  };

  const handleChange = (field: keyof LeadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStartNew = () => {
    setSubmitted(false);
    setIsSending(false);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      bestTime: '',
      notes: ''
    });
    if (onReset) onReset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="bg-white border border-slate-100 rounded-[3rem] p-12 md:p-16 text-center shadow-2xl animate-in fade-in zoom-in duration-500 max-w-4xl mx-auto">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-10">
          <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <CheckCircle2 size={24} />
          </div>
        </div>
        <h3 className="text-4xl font-black text-[#0f172a] mb-6 tracking-tight">Capabilities Dispatched!</h3>
        <p className="text-slate-500 text-lg mb-12 max-w-xl mx-auto leading-relaxed font-medium">
          The preliminary strategy has been sent to <span className="text-slate-900 font-bold">{formData.email}</span>. An account director will review your facility parameters and reach out for a technical walkthrough.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
           <button onClick={onSchedule} className="bg-[#0d9488] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[13px] hover:bg-[#14b8a6] transition-all shadow-xl shadow-teal-500/20 active:scale-95">
             FINALIZE TECHNICAL ASSESSMENT
           </button>
           <button onClick={handleStartNew} className="bg-[#f1f5f9] text-[#475569] px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[13px] hover:bg-[#e2e8f0] transition-all active:scale-95">
             START NEW ASSESSMENT
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-accent/10 transition-colors"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Finalize Strategy Request</h3>
        </div>
        <p className="text-slate-500 mb-10 font-medium">Enterprise portfolios require specific labor allocation. Submit your details to receive the full Capability Statement.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Account Director/Contact</label>
              <div className="relative"><User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input required type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all" placeholder="John Doe" /></div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Entity/Organization</label>
              <div className="relative"><Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input required type="text" value={formData.company} onChange={e => handleChange('company', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all" placeholder="Acme Logistics" /></div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Corporate Email</label>
              <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input required type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all" placeholder="john@company.com" /></div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Direct Line</label>
              <div className="relative"><Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input required type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all" placeholder="(555) 000-0000" /></div>
            </div>
          </div>

          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center space-y-4">
             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 mx-auto shadow-sm"><Upload size={24}/></div>
             <div><h4 className="text-sm font-black text-slate-900">Invite Us to Bid (RFP/RFQ)</h4><p className="text-xs text-slate-400 font-bold leading-relaxed">Have a 50+ page specification? Mention it in the notes below or let us know where to send our RFP response.</p></div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Project Notes / RFP Link</label>
            <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all min-h-[120px]" placeholder="Specific compliance requirements, site access protocols, or multi-location details..." />
          </div>

          <div className="flex flex-col md:flex-row gap-6 pt-6">
            <button type="submit" disabled={isSending} className="flex-1 group relative bg-brand-accent hover:bg-brand-accentLight text-white font-black py-5 rounded-2xl shadow-xl shadow-brand-accent/20 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs">
              <span className="flex items-center justify-center gap-3">
                {isSending ? 'Sending Assessment...' : 'Request Enterprise Capability Statement'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest"><Lock size={12} /> Secure Portal</div>
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest"><Info size={12} /> Privacy Guaranteed</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
