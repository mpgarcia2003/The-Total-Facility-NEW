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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent">
            1
          </span>
          Room Breakdown
        </h3>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedPreset}
            onChange={handleAddPreset}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none font-medium"
          >
            <option value="">+ Add Room Type...</option>
            {PRESET_ROOMS.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>
          <button 
            onClick={handleAddCustom}
            className="text-xs uppercase tracking-wider font-semibold text-brand-accent hover:text-teal-700 transition-colors whitespace-nowrap px-2"
          >
            + Custom
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Header - Hiding Mins and Total columns */}
        <div className="hidden md:grid grid-cols-12 gap-4 text-xs uppercase tracking-wider text-slate-500 font-bold px-4">
          <div className="col-span-8">Room Type</div>
          <div className="col-span-4 text-center">Quantity</div>
        </div>

        {rooms.map((room, idx) => (
          <div 
            key={room.id}
            className="group relative bg-white border border-slate-200 rounded-xl p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:border-brand-accent/50 hover:shadow-md transition-all duration-300"
            style={{ animationDelay: `${idx * ANIMATION_DELAY}ms` }}
          >
            {/* Room Name - Expanded to take more space */}
            <div className="col-span-8 mb-3 md:mb-0">
              <input
                type="text"
                value={room.name}
                onChange={(e) => handleUpdate(room.id, 'name', e.target.value)}
                className="w-full bg-transparent border-none text-slate-900 font-medium focus:ring-0 focus:text-brand-accent placeholder-slate-400"
                placeholder="Area Name"
              />
              {/* Hidden Input for calculation logic preservation */}
              <input type="hidden" value={room.minutesPerRoom} />
            </div>

            {/* Quantity Control */}
            <div className="col-span-3 flex items-center justify-center gap-3 mb-3 md:mb-0">
              <button 
                onClick={() => handleDecrement(room.id)}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-lg font-bold text-slate-900">{room.quantity}</span>
              <button 
                onClick={() => handleIncrement(room.id)}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-accent hover:bg-brand-accent hover:text-white transition-all"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Delete Action */}
            <div className="col-span-1 flex items-center justify-end">
              <button 
                onClick={() => handleRemove(room.id)}
                className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;