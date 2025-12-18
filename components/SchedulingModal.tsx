import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulingModal: React.FC<SchedulingModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    // Load the Acuity script dynamically to ensure it runs when modal opens
    if (isOpen) {
      const script = document.createElement('script');
      script.src = "https://embed.acuityscheduling.com/js/embed.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl h-[85vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-float">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Schedule Your Walkthrough
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 overflow-y-auto bg-white">
          <iframe 
            src="https://app.acuityscheduling.com/schedule.php?owner=35455135&ref=embedded_csp" 
            title="Schedule Appointment" 
            width="100%" 
            height="800" 
            frameBorder="0" 
            className="w-full min-h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default SchedulingModal;