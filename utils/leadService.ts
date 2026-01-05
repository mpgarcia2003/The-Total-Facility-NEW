
import emailjs from '@emailjs/browser';

/**
 * GOOGLE APPS SCRIPT SETUP:
 * 1. Create a Google Sheet
 * 2. Extensions > App Script > Paste code from LEAD_SCRIPT_SOURCE.js
 * 3. Deploy > New Deployment > Web App 
 * 4. IMPORTANT: Execute as 'Me' | Access: 'Anyone'
 * 5. Paste your Web App URL below:
 */
const WEBHOOK_URL = ""; 

const EMAILJS_SERVICE_ID = "service_srv6b3k";
const EMAILJS_PUBLIC_KEY = "4ye26ZtWxpi6Pkk5f";
const INTERNAL_TEMPLATE_ID = "template_12yvcvz";

export interface LeadPayload {
  name: string;
  email: string;
  company: string;
  phone?: string;
  quote_total?: string;
  notes?: string;
  funnel_stage: 'UNLOCK' | 'RESOURCE' | 'QUOTE';
  industry?: string;
}

export const leadService = {
  async submitLead(payload: LeadPayload) {
    console.log(`[LeadService] Capturing ${payload.funnel_stage} for ${payload.email}...`);

    const timestamp = new Date().toLocaleString();
    
    // 1. Submit to Google Apps Script (Standard Form Encoding)
    if (WEBHOOK_URL) {
      try {
        // We use URLSearchParams to simulate a standard HTML Form submission
        // This bypasses many CORS "not loading" issues
        const formData = new URLSearchParams();
        formData.append('timestamp', timestamp);
        formData.append('funnel_stage', payload.funnel_stage);
        formData.append('name', payload.name || '');
        formData.append('email', payload.email || '');
        formData.append('company', payload.company || '');
        formData.append('phone', payload.phone || '');
        formData.append('quote_total', payload.quote_total || '');
        formData.append('notes', payload.notes || '');
        formData.append('industry', payload.industry || '');

        await fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors', // Standard for GAS
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString()
        });
        console.log('[LeadService] Google Sheets capture initialized.');
      } catch (err) {
        console.error('[LeadService] Webhook Delivery Failed:', err);
      }
    }

    // 2. Submit to EmailJS (Reliable Secondary Alert)
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        INTERNAL_TEMPLATE_ID,
        {
          from_name: "TFS LEAD BOT",
          name: payload.name || "Instant Lead",
          company: payload.company || "Pending",
          email: payload.email,
          phone: payload.phone || "Pending",
          quote_total: payload.quote_total || "N/A",
          time: timestamp,
          notes: `Stage: ${payload.funnel_stage} | Sector: ${payload.industry} | Notes: ${payload.notes || 'None'}`,
          reply_to: payload.email
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log('[LeadService] Email notification dispatched.');
      return true;
    } catch (err) {
      console.error('[LeadService] EmailJS System Error:', err);
      return false;
    }
  }
};
