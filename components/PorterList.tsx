import React from 'react';
import { PorterService } from '../types';
import { Plus, Minus, User } from './ui/Icons';

interface PorterListProps {
  porters: PorterService[];
  onChange: (porters: PorterService[]) => void;
}

const PorterList: React.FC<PorterListProps> = ({ porters, onChange }) => {
  const handleUpdate = (id: string, field: keyof PorterService, value: number | string) => {
    const newPorters = porters.map(p => p.id === id ? { ...p, [field]: value } : p);
    onChange(newPorters);
  };

  const handleIncrement = (id: string) => {
    const porter = porters.find(p => p.id === id);
    if (porter) handleUpdate(id, 'quantity', porter.quantity + 1);
  };

  const handleDecrement = (id: string) => {
    const porter = porters.find(p => p.id === id);
    if (porter && porter.quantity > 0) handleUpdate(id, 'quantity', porter.quantity - 1);
  };

  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand-secondary/20 flex items-center justify-center text-brand-secondary">
            2
          </span>
          Day Porter Services
        </h3>
      </div>

      <div className="grid gap-4">
        {porters.map((porter) => (
          <div 
            key={porter.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-2 bg-slate-100 rounded-lg text-brand-secondary">
                <User size={20} />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">{porter.name}</h4>
                <p className="text-xs text-slate-500">Daily On-site Support</p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
               {/* Hours Input */}
               <div className="flex flex-col items-center">
                <label className="text-[10px] uppercase text-slate-500 mb-1 font-bold">Hours/Day</label>
                <input
                  type="number"
                  value={porter.hoursPerDay}
                  onChange={(e) => handleUpdate(porter.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                  className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-center text-slate-900 focus:border-brand-secondary focus:outline-none"
                />
              </div>

               {/* Quantity Control */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleDecrement(porter.id)}
                  className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-lg font-bold text-slate-900">{porter.quantity}</span>
                <button 
                  onClick={() => handleIncrement(porter.id)}
                  className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-secondary hover:bg-brand-secondary hover:text-white transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Total Calculation */}
              <div className="w-24 text-right">
                <div className="text-sm font-mono text-brand-secondary font-bold">
                  {porter.quantity * porter.hoursPerDay} hrs
                </div>
                <div className="text-[10px] text-slate-500">Daily Total</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PorterList;