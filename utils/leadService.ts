
/**
 * LEAD SERVICE - Google Apps Script Only (No EmailJS)
 * Sends leads to Google Sheets + Gmail notifications
 */

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzljnmMdTKtWLo9G99B_AXcyCzwJapBHqBfTz3G4-WQELpwOr0DztGIz4rBcoqeir6f4A/exec";

export interface LeadPayload {
  name?: string;
  email: string;
  company?: string;
  phone?: string;
  quote_total?: string;
  notes?: string;
  funnel_stage: 'UNLOCK' | 'RESOURCE' | 'QUOTE';
  industry?: string;
}

export const leadService = {
  async submitLead(payload: LeadPayload): Promise<boolean> {
    console.log(`[LeadService] Capturing ${payload.funnel_stage} lead for ${payload.email}...`);

    try {
      const timestamp = new Date().toLocaleString();
      
      const formData = new URLSearchParams();
      formData.append('timestamp', timestamp);
      formData.append('funnel_stage', payload.funnel_stage);
      formData.append('name', payload.name || 'Instant Lead');
      formData.append('email', payload.email || '');
      formData.append('company', payload.company || 'Website Inquiry');
      formData.append('phone', payload.phone || '');
      formData.append('quote_total', payload.quote_total || '');
      formData.append('notes', payload.notes || '');
      formData.append('industry', payload.industry || '');

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });
      
      console.log('[LeadService] Lead captured successfully.');
      return true;
      
    } catch (err) {
      console.error('[LeadService] Submission failed:', err);
      return false;
    }
  }
};
