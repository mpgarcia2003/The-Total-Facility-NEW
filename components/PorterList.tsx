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
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-4">
          <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            3
          </span>
          Day Porter Services
        </h3>
      </div>

      <div className="grid gap-4">
        {porters.map((porter) => (
          <div 
            key={porter.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-3 bg-slate-50 rounded-2xl text-amber-600">
                <User size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900">{porter.name}</h4>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Daily On-site Support</p>
              </div>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
               <div className="flex flex-col items-center">
                <label className="text-[9px] uppercase tracking-widest text-slate-400 mb-2 font-black">Hours / Day</label>
                <input
                  type="number"
                  value={porter.hoursPerDay}
                  onChange={(e) => handleUpdate(porter.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                  className="w-20 bg-slate-50 border-2 border-slate-100 rounded-xl py-2 px-3 text-center text-slate-900 font-black focus:border-amber-500/50 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleDecrement(porter.id)}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  <Minus size={18} />
                </button>
                <span className="w-6 text-center text-xl font-black text-slate-900">{porter.quantity}</span>
                <button 
                  onClick={() => handleIncrement(porter.id)}
                  className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="w-24 text-right">
                <div className="text-lg font-black text-amber-600">
                  {porter.quantity * porter.hoursPerDay} hrs
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily Total</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PorterList;