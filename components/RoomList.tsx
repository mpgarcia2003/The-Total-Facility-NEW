import React, { useState } from 'react';
import { RoomType } from '../types';
import { Plus, Minus, Trash2 } from './ui/Icons';
import { ANIMATION_DELAY, PRESET_ROOMS } from '../constants';

interface RoomListProps {
  rooms: RoomType[];
  onChange: (rooms: RoomType[]) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onChange }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>("");

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

    const preset = PRESET_ROOMS.find(p => p.name === presetName);
    if (preset) {
      const newId = Math.random().toString(36).substr(2, 9);
      onChange([...rooms, { 
        id: newId, 
        name: preset.name, 
        quantity: 1, 
        minutesPerRoom: preset.minutesPerRoom 
      }]);
    }
    setSelectedPreset(""); // Reset dropdown
  };

  const handleAddCustom = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    onChange([...rooms, { id: newId, name: 'Custom Area', quantity: 1, minutesPerRoom: 15 }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
          <span className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">
            2
          </span>
          Room Breakdown
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              value={selectedPreset}
              onChange={handleAddPreset}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-2xl pl-6 pr-10 py-3 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none font-medium cursor-pointer"
            >
              <option value="">+ Add Room Type...</option>
              {PRESET_ROOMS.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <button 
            onClick={handleAddCustom}
            className="text-xs uppercase tracking-widest font-black text-teal-600 hover:text-teal-700 transition-colors whitespace-nowrap px-2"
          >
            + CUSTOM
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-12 gap-4 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black px-8">
          <div className="col-span-8 md:col-span-9">Room Type</div>
          <div className="col-span-4 md:col-span-3 text-center">Quantity</div>
        </div>

        {rooms.map((room, idx) => (
          <div 
            key={room.id}
            className="group relative bg-white border border-slate-100 rounded-[2rem] p-5 px-8 flex items-center justify-between hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-500"
            style={{ animationDelay: `${idx * ANIMATION_DELAY}ms` }}
          >
            <div className="flex-1">
              <input
                type="text"
                value={room.name}
                onChange={(e) => handleUpdate(room.id, 'name', e.target.value)}
                className="w-full bg-transparent border-none text-slate-900 font-black text-lg focus:ring-0 focus:text-teal-600 placeholder-slate-300 transition-colors"
                placeholder="Area Name"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => handleDecrement(room.id)}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-black text-slate-900 min-w-[20px] text-center">{room.quantity}</span>
                <button 
                  onClick={() => handleIncrement(room.id)}
                  className="w-10 h-10 rounded-full bg-teal-50/50 flex items-center justify-center text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button 
                onClick={() => handleRemove(room.id)}
                className="text-slate-300 hover:text-red-500 transition-colors ml-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;