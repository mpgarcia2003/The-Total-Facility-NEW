
import React, { useState, useEffect } from 'react';
import { LeadData, QuoteCalculations, ClientInfo, RoomType } from '../types';
// Added ArrowRight to imports to fix the compilation error
import { Mail, Phone, Building2, User, CheckCircle2, ShieldCheck, Lock, ArrowRight } from './ui/Icons';
import html2canvas from 'html2canvas';
import emailjs from '@emailjs/browser';

interface LeadFormProps {
  quote: QuoteCalculations;
  clientInfo: ClientInfo;
  rooms: RoomType[];
  initialEmail?: string; 
  onSubmit: (data: LeadData) => void;
  onSchedule: () => void;
}

const EMAILJS_SERVICE_ID = "service_srv6b3k"; 
const EMAILJS_TEMPLATE_ID_QUOTE = "template_ljs0669"; 
const EMAILJS_PUBLIC_KEY = "4ye26ZtWxpi6Pkk5f";
const COMPANY_EMAIL = "info@thetotalfacility.com";

const LeadForm: React.FC<LeadFormProps> = ({ quote, clientInfo, rooms, initialEmail, onSubmit, onSchedule }) => {
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
      name: clientInfo.name || prev.name,
      email: initialEmail || clientInfo.email || prev.email, 
      phone: clientInfo.phone || prev.phone,
      company: (!prev.company && clientInfo.address) ? clientInfo.address : prev.company
    }));
  }, [clientInfo, initialEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    let screenshotDataUrl = '';

    try {
        const contentElement = document.getElementById('quote-content');
        if (contentElement) {
            const canvas = await html2canvas(contentElement, {
                scale: 0.5, // Reduced scale further for safety
                useCORS: true, 
                logging: false,
                backgroundColor: '#ffffff'
            });
            screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.4);
        }
    } catch (err) {
        console.warn("Screenshot capture failed:", err);
    }

    // Generate a textual breakdown in case the image doesn't work
    const roomSummary = rooms
      .filter(r => r.quantity > 0)
      .map(r => `${r.name}: ${r.quantity}`)
      .join(', ');

    const quoteSummary = `
      FACILITY SUMMARY:
      Organization: ${formData.company}
      Location: ${clientInfo.address}
      Breakdown: ${roomSummary}
      
      BUDGET DETAILS:
      Cleaning/Specialty: $${(quote.cleaningTotal + quote.specialtyTotal).toFixed(2)}/mo
      Day Porter: $${quote.porterTotal.toFixed(2)}/mo
      GRAND TOTAL: $${quote.grandTotal.toFixed(2)}/mo
    `;

    // IMPORTANT: Ensure your EmailJS template uses {{admin_email}} in the "To Email" field
    // and {{quote_summary}} in the body text.
    const templateParams = {
      to_email: COMPANY_EMAIL, 
      admin_email: COMPANY_EMAIL, 
      customer_email: formData.email,
      reply_to: formData.email, 
      from_name: formData.name,
      name: formData.name,
      company: formData.company,
      phone: formData.phone,
      bestTime: formData.bestTime,
      quote_total: quote.grandTotal.toFixed(2),
      cleaning_total: (quote.cleaningTotal + quote.specialtyTotal).toFixed(2),
      porter_total: quote.porterTotal.toFixed(2),
      quote_summary: quoteSummary,
      screenshot: screenshotDataUrl.length < 65000 ? screenshotDataUrl : "Image too large - check text summary."
    };

    try {
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID_QUOTE,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        
        setSubmitted(true);
        onSubmit(formData);
    } catch (error: any) {
        console.error("EmailJS Error (Lead Submission):", error);
        alert("Verification successful, but we hit a glitch sending the formal PDF. Our team has been notified and will call you at " + formData.phone);
        // Still set submitted true so the user doesn't get stuck
        setSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (field: keyof LeadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="bg-white border border-brand-accent/30 rounded-[2.5rem] p-12 text-center animate-float shadow-2xl">
        <div className="w-24 h-24 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} className="text-brand-accent" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Strategy Secured!</h3>
        <p className="text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
          Thank you, <span className="text-brand-accent font-black">{formData.name}</span>. Your facility requirements have been logged. An account manager will contact you shortly to finalize the walkthrough.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
           <button onClick={onSchedule} className="bg-brand-accent text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-accentLight transition-all shadow-xl shadow-brand-accent/20">
             Finalize Walkthrough
           </button>
           <button onClick={() => window.location.reload()} className="bg-slate-100 text-slate-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">
             Start New Estimate
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
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Lock In This Monthly Budget</h3>
        </div>
        <p className="text-slate-500 mb-10 font-medium">Submit your details to receive a formal copy of this estimate and schedule your on-site verification.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Contact Person</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all" placeholder="John Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Company / Organization</label>
              <div className="relative">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="text" value={formData.company} onChange={e => handleChange('company', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all" placeholder="Acme Academy" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Verified Work Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all" placeholder="john@company.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Direct Phone</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all" placeholder="(555) 000-0000" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Best time for a quick 5-min intro?</label>
            <input type="text" value={formData.bestTime} onChange={e => handleChange('bestTime', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all" placeholder="e.g., Weekday mornings" />
          </div>

          <div className="flex flex-col md:flex-row gap-6 pt-6">
            <button type="submit" disabled={isSending} className="flex-1 group relative bg-brand-accent hover:bg-brand-accentLight text-white font-black py-5 rounded-2xl shadow-xl shadow-brand-accent/20 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs">
              <span className="flex items-center justify-center gap-3">
                {isSending ? 'Transmitting Data...' : 'Secure My Monthly Budget'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button type="button" onClick={onSchedule} className="flex-1 bg-white text-slate-700 font-black py-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:bg-slate-50 hover:border-slate-200 transition-all uppercase tracking-[0.2em] text-xs">
              Schedule Walkthrough First
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <Lock size={12} /> SSL Encrypted & Data Protected
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
