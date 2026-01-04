
import React, { useState } from 'react';
import { RoomType, IndustryType } from '../types';
import { Plus, Minus, Trash2 } from './ui/Icons';
import { ANIMATION_DELAY, PRESET_ROOMS } from '../constants';

interface RoomListProps {
  rooms: RoomType[];
  onChange: (rooms: RoomType[]) => void;
  industry: IndustryType;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onChange, industry }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  const industryPresets = PRESET_ROOMS[industry] || [];

  const handleUpdate = (id: string, field: keyof RoomType, value: number | string) => {
    const newRooms = rooms.map(r => r.id === id ? { ...r, [field]: value } : r);
    onChange(newRooms);
  };

  const handleIncrement = (id: string) => {
    const room = rooms.find(r => r.id === id);
    if (room) handleUpdate(id, 'quantity', room.quantity + 1);
  };

  const handleDecrement = (id: string) => {
    const room = rooms.find(r => r.id === id);
    if (room && room.quantity > 0) handleUpdate(id, 'quantity', room.quantity - 1);
  };

  const handleRemove = (id: string) => {
    onChange(rooms.filter(r => r.id !== id));
  };

  const handleAddPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    if (!presetName) return;

    const preset = industryPresets.find(p => p.name === presetName);
    if (preset) {
      const newId = Math.random().toString(36).substr(2, 9);
      onChange([...rooms, { 
        id: newId, 
        name: preset.name, 
        quantity: 1, 
        minutesPerRoom: preset.minutesPerRoom 
      }]);
    }
    setSelectedPreset(""); 
  };

  const handleAddCustom = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    onChange([...rooms, { id: newId, name: 'Custom Area', quantity: 1, minutesPerRoom: 15 }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
          <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-sm md:text-base">
            2
          </span>
          Room Breakdown
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:flex-initial">
            <select 
              value={selectedPreset}
              onChange={handleAddPreset}
              className="w-full md:w-auto appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs md:text-sm rounded-2xl pl-4 pr-10 py-3 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none font-bold cursor-pointer transition-all"
            >
              <option value="">+ Add Type...</option>
              {industryPresets.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <button 
            onClick={handleAddCustom}
            className="text-[10px] uppercase tracking-widest font-black text-teal-600 hover:text-teal-700 transition-colors whitespace-nowrap px-2"
          >
            + CUSTOM
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="grid grid-cols-12 gap-2 text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black px-4 md:px-8">
          <div className="col-span-8 md:col-span-9">Room Type</div>
          <div className="col-span-4 md:col-span-3 text-right pr-4">Quantity</div>
        </div>

        {rooms.map((room, idx) => (
          <div 
            key={room.id}
            className="group relative bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] p-4 md:p-5 px-4 md:px-8 flex items-center justify-between hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-500"
            style={{ animationDelay: `${idx * ANIMATION_DELAY}ms` }}
          >
            <div className="flex-1 min-w-0 pr-2">
              <input
                type="text"
                value={room.name}
                onChange={(e) => handleUpdate(room.id, 'name', e.target.value)}
                className="w-full bg-transparent border-none text-slate-900 font-black text-sm md:text-lg focus:ring-0 focus:text-teal-600 placeholder-slate-300 transition-colors truncate"
                placeholder="Area Name"
              />
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="flex items-center gap-3 md:gap-6">
                <button 
                  onClick={() => handleDecrement(room.id)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
                >
                  <Minus size={14} className="md:w-[18px]" />
                </button>
                <span className="text-sm md:text-xl font-black text-slate-900 min-w-[16px] text-center">{room.quantity}</span>
                <button 
                  onClick={() => handleIncrement(room.id)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-teal-50/50 flex items-center justify-center text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-all active:scale-95"
                >
                  <Plus size={14} className="md:w-[18px]" />
                </button>
              </div>

              <button 
                onClick={() => handleRemove(room.id)}
                className="text-slate-300 hover:text-red-500 transition-colors ml-1"
              >
                <Trash2 size={18} className="md:w-[20px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
