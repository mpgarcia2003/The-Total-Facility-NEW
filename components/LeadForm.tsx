import React, { useState, useEffect } from 'react';
import { LeadData, QuoteCalculations, ClientInfo } from '../types';
import { Mail, Phone, Building2, User, CheckCircle2 } from './ui/Icons';
import html2canvas from 'html2canvas';
import emailjs from '@emailjs/browser';

interface LeadFormProps {
  quote: QuoteCalculations;
  clientInfo: ClientInfo;
  initialEmail?: string; 
  onSubmit: (data: LeadData) => void;
  onSchedule: () => void;
}

const EMAILJS_SERVICE_ID = "service_srv6b3k"; 
const EMAILJS_TEMPLATE_ID_QUOTE = "template_ljs0669"; 
const EMAILJS_PUBLIC_KEY = "4ye26ZtWxpi6Pkk5f";

const LeadForm: React.FC<LeadFormProps> = ({ quote, clientInfo, initialEmail, onSubmit, onSchedule }) => {
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

    // 1. Capture the screenshot (Optimized for size)
    try {
        const contentElement = document.getElementById('quote-content');
        if (contentElement) {
            const canvas = await html2canvas(contentElement, {
                scale: 0.6,
                useCORS: true, 
                logging: false,
                backgroundColor: '#ffffff'
            });
            const rawDataUrl = canvas.toDataURL('image/jpeg', 0.5);
            
            // EmailJS 50KB limit check
            if (rawDataUrl.length < 48000) {
                screenshotDataUrl = rawDataUrl;
            } else {
                console.warn("Screenshot too large, skipping.");
            }
        }
    } catch (err) {
        console.warn("Screenshot capture failed:", err);
    }

    // 2. Prepare Template Params with REDUNDANT variables to prevent routing failure
    const templateParams = {
      to_email: formData.email,        // Preferred variable
      email: formData.email,           // Alternative 1
      recipient_email: formData.email,  // Alternative 2
      user_email: formData.email,       // Alternative 3
      reply_to: 'info@thetotalfacility.com', 
      name: formData.name,
      company: formData.company,
      phone: formData.phone,
      bestTime: formData.bestTime,
      quote_total: quote.grandTotal.toFixed(2),
      screenshot: screenshotDataUrl || "Image unavailable or too large. See quote details in text summary."
    };

    // 3. Send Email
    try {
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID_QUOTE,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        
        console.log("Analytics: lead_submitted_success");
        setSubmitted(true);
        onSubmit(formData);

    } catch (error: any) {
        const errorMsg = typeof error === 'object' ? JSON.stringify(error) : String(error);
        console.error("EmailJS Error (Lead):", errorMsg);
        alert("We received your request, but the email confirmation failed to send. We will contact you shortly.");
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
      <div className="bg-white border border-brand-accent/30 rounded-2xl p-10 text-center animate-float shadow-xl">
        <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-brand-accent" />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-2">Quote Request Received!</h3>
        <p className="text-slate-600 mb-6">
          Thank you, <span className="text-brand-accent font-bold">{formData.name}</span>. We have captured your facility requirements and will review your quote inputs shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Save This Quote & Schedule</h3>
        <p className="text-slate-500 mb-8">Finalize your request to lock in this estimated pricing.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input required type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-1 focus:ring-brand-accent" placeholder="John Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Company / Facility</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                <input required type="text" value={formData.company} onChange={e => handleChange('company', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-1 focus:ring-brand-accent" placeholder="Acme Academy" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input required type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-1 focus:ring-brand-accent" placeholder="john@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                <input required type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-1 focus:ring-brand-accent" placeholder="(555) 123-4567" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Best time to reach you?</label>
            <input type="text" value={formData.bestTime} onChange={e => handleChange('bestTime', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 outline-none focus:ring-1 focus:ring-brand-accent" placeholder="e.g., Weekday mornings" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button type="submit" disabled={isSending} className="flex-1 bg-gradient-to-r from-brand-accentLight to-brand-accent text-white font-bold py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50">
              {isSending ? 'Sending...' : 'Send Formal Proposal'}
            </button>
            <button type="button" onClick={onSchedule} className="flex-1 bg-white text-slate-700 font-bold py-4 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
              Schedule Walkthrough
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;