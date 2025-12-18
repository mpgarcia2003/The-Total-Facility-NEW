import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PricingSettings, 
  RoomType, 
  PorterService, 
  ClientInfo, 
  QuoteCalculations 
} from './types';
import { DEFAULT_PRICING_SETTINGS, DEFAULT_ROOMS, DEFAULT_PORTERS } from './constants';
import { calculateQuote } from './utils/pricing';
import { formatCurrency, formatTime, formatDate } from './utils/format';
import emailjs from '@emailjs/browser';

// Components
import RoomList from './components/RoomList';
import PorterList from './components/PorterList';
import LeadForm from './components/LeadForm';
import SchedulingModal from './components/SchedulingModal';
import { 
  MapPin, 
  Calendar, 
  User, 
  Sparkles, 
  ArrowRight, 
  LayoutDashboard, 
  Clock, 
  DollarSign, 
  Lock, 
  Key, 
  Mail, 
  CheckCircle2 
} from './components/ui/Icons';

// --- EMAILJS CONFIGURATION ---
const EMAILJS_PUBLIC_KEY = "4ye26ZtWxpi6Pkk5f";
const EMAILJS_SERVICE_ID = "service_srv6b3k"; 
const EMAILJS_TEMPLATE_ID_VERIFY = "template_mtm1oef"; 

const App: React.FC = () => {
  // --- STATE ---
  const [settings, setSettings] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);
  const [rooms, setRooms] = useState<RoomType[]>(DEFAULT_ROOMS);
  const [porters, setPorters] = useState<PorterService[]>(DEFAULT_PORTERS);
  
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    address: '',
    email: '',
    phone: '',
    walkthroughDate: new Date().toISOString().split('T')[0],
    repName: 'Yasmin Peralta'
  });

  const [includeSummer, setIncludeSummer] = useState(false);
  const [includeWinter, setIncludeWinter] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  // --- PRICE LOCK STATE ---
  const [isQuoteUnlocked, setIsQuoteUnlocked] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'email' | 'code'>('email');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); // The real code
  const [inputCode, setInputCode] = useState(''); // The user's input
  const [isSendingCode, setIsSendingCode] = useState(false);

  // --- REFS ---
  const calculatorRef = useRef<HTMLDivElement>(null);
  const lockSectionRef = useRef<HTMLDivElement>(null);

  // --- DERIVED STATE ---
  const quote = useMemo(() => {
    return calculateQuote(rooms, porters, settings, includeSummer, includeWinter);
  }, [rooms, porters, settings, includeSummer, includeWinter]);

  // --- EFFECTS ---
  useEffect(() => {
    console.log("Analytics: quote_started");
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenScheduler = () => {
    setIsSchedulerOpen(true);
  };

  // --- VERIFICATION HANDLERS ---
  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationEmail) return;
    
    setIsSendingCode(true);
    console.log("Sending verification to:", verificationEmail);

    // 1. Generate Code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);

    try {
      // 2. Send Email via EmailJS with Redundant Variables
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_VERIFY,
        {
          to_email: verificationEmail,       // Primary mapping
          email: verificationEmail,          // Fallback 1
          recipient_email: verificationEmail, // Fallback 2
          user_email: verificationEmail,      // Fallback 3
          reply_to: 'info@thetotalfacility.com',
          code: code,
          name: clientInfo.name || "Valued Client",
          title: "Verification Code",
          time: new Date().toLocaleTimeString(),
        },
        EMAILJS_PUBLIC_KEY
      );
      
      console.log("Verification email sent successfully.");
      setVerificationStep('code');
    } catch (error: any) {
      const errorMsg = typeof error === 'object' ? JSON.stringify(error) : String(error);
      console.error("EmailJS Error (Verification):", errorMsg);
      alert(`System Note: We encountered an error sending the email. For testing purposes, your access code is: ${code}`);
      setVerificationStep('code'); // Allow them to continue anyway for better UX
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === verificationCode) {
      setIsQuoteUnlocked(true);
      setClientInfo(prev => ({ ...prev, email: verificationEmail }));
    } else {
      alert("Invalid code. Please try again.");
      setInputCode('');
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker text-slate-900 selection:bg-brand-accent selection:text-white">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-white to-transparent opacity-100" />
        <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-[20%] -left-[100px] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl" />
        <div className="w-full h-full opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div id="quote-content" className="relative max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* HERO SECTION */}
        <header className="mb-16 md:mb-24 text-center space-y-6 pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-xs font-medium text-brand-accent mb-4">
            <Sparkles size={12} />
            <span>AI-Powered Pricing Engine</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Instant Janitorial Quote <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-600">
              In Under 2 Minutes
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transparent, data-driven facility service pricing for NYC schools and offices. 
            No hidden fees, just precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={scrollToCalculator}
              className="px-8 py-4 bg-brand-accentLight hover:bg-brand-accent text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Start Instant Quote <ArrowRight size={18} />
            </button>
            <button 
              onClick={handleOpenScheduler}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all"
            >
              Schedule Walkthrough
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start" ref={calculatorRef}>
          
          {/* LEFT COLUMN: CALCULATOR */}
          <div className="lg:col-span-8 space-y-8">
            
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <LayoutDashboard className="text-brand-accent" size={20} /> Project Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold">Client Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Enter Name"
                      value={clientInfo.name}
                      onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 text-sm text-slate-900 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold">Location Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="123 Broadway, NYC"
                      value={clientInfo.address}
                      onChange={e => setClientInfo({...clientInfo, address: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 text-sm text-slate-900 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold">Walkthrough Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input 
                      type="date" 
                      value={clientInfo.walkthroughDate}
                      onChange={e => setClientInfo({...clientInfo, walkthroughDate: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 text-sm text-slate-900 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold">Sales Rep</label>
                  <input 
                    type="text" 
                    value={clientInfo.repName}
                    onChange={e => setClientInfo({...clientInfo, repName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none text-brand-accent font-semibold"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <RoomList rooms={rooms} onChange={setRooms} />
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <PorterList porters={porters} onChange={setPorters} />
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">3</span>
                <h3 className="text-xl font-semibold text-slate-900">Pricing Parameters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-bold">Days / Month</label>
                  <input 
                    type="number" 
                    value={settings.daysInMonth}
                    onChange={e => setSettings({...settings, daysInMonth: parseFloat(e.target.value)})}
                    className="w-full md:w-1/2 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 focus:border-brand-accent focus:outline-none"
                  />
                  <p className="text-xs text-slate-500">Standard commercial month is 22 days.</p>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6" ref={lockSectionRef}>
            {!isQuoteUnlocked ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] z-0"></div>
                 <div className="relative z-10 flex flex-col items-center text-center space-y-6 py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                      <Lock size={32} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-900">Unlock Your Quote</h3>
                      <p className="text-sm text-slate-500 max-w-[250px] mx-auto">To view your custom facility pricing, please verify your email address.</p>
                    </div>
                    {verificationStep === 'email' ? (
                      <form onSubmit={handleSendVerification} className="w-full space-y-4">
                        <div className="relative text-left">
                          <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Work Email</label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input 
                              type="email" 
                              required
                              placeholder="name@company.com"
                              value={verificationEmail}
                              onChange={(e) => setVerificationEmail(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 text-sm focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <button 
                          type="submit"
                          disabled={isSendingCode}
                          className="w-full bg-brand-accentLight hover:bg-brand-accent text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-accent/20 flex items-center justify-center gap-2"
                        >
                          {isSendingCode ? 'Sending...' : 'Send Access Code'}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyCode} className="w-full space-y-4">
                        <div className="relative text-left">
                          <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Enter Code</label>
                          <div className="relative mt-1">
                            <Key className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input 
                              type="text" 
                              required
                              placeholder="1234"
                              value={inputCode}
                              onChange={(e) => setInputCode(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 text-sm tracking-widest font-mono focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-brand-secondary hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">Unlock Price</button>
                        <button type="button" onClick={() => setVerificationStep('email')} className="text-xs text-slate-400 hover:text-slate-600 underline">Change Email</button>
                      </form>
                    )}
                 </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-slate-500 text-sm uppercase tracking-wider mb-1 font-semibold">Estimated Monthly Total</h3>
                      <div className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        {formatCurrency(quote.grandTotal)}
                        <span className="text-lg text-slate-400 font-normal">/mo</span>
                      </div>
                    </div>
                    <div className="text-brand-accent"><CheckCircle2 size={24} /></div>
                  </div>
                  <div className="h-px bg-slate-100"></div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-slate-600">Cleaning Services</span><span className="text-slate-900 font-bold">{formatCurrency(quote.cleaningTotal)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-600">Day Porter</span><span className="text-slate-900 font-bold">{formatCurrency(quote.porterTotal)}</span></div>
                    <div className="pt-2 space-y-2">
                      <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${includeSummer ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-2"><input type="checkbox" checked={includeSummer} onChange={e => setIncludeSummer(e.target.checked)} /><span className="text-xs font-semibold uppercase">Summer Strip & Wax</span></div>
                        <span className="text-sm font-medium">{formatCurrency(quote.summerStripCost)}</span>
                      </label>
                      <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${includeWinter ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-2"><input type="checkbox" checked={includeWinter} onChange={e => setIncludeWinter(e.target.checked)} /><span className="text-xs font-semibold uppercase">Winter Wash & Wax</span></div>
                        <span className="text-sm font-medium">{formatCurrency(quote.winterWashCost)}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 lg:mt-24 max-w-3xl mx-auto">
          <LeadForm 
            quote={quote} 
            clientInfo={clientInfo} 
            initialEmail={isQuoteUnlocked ? verificationEmail : ''}
            onSubmit={() => {}} 
            onSchedule={handleOpenScheduler}
          />
        </div>

        <footer className="mt-20 text-center text-slate-400 text-sm pb-24 md:pb-8">
          <p>&copy; {new Date().getFullYear()} The Total Facility Services Group. All rights reserved.</p>
        </footer>
      </div>

      <SchedulingModal isOpen={isSchedulerOpen} onClose={() => setIsSchedulerOpen(false)} />
    </div>
  );
};

export default App;