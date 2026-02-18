import React from 'react';
import { AppointmentSlot, Language } from '../types';

interface AppointmentPickerProps {
    availableSlots: AppointmentSlot[];
    // FIX: Removed comment as 'selectedSlotId' is already optional.
    selectedSlotId?: string | null;
    onSlotSelection: (slotId: string) => void;
    lang: Language;
    noSlotsMessage: string;
}

const AppointmentPicker: React.FC<AppointmentPickerProps> = ({ availableSlots, selectedSlotId, onSlotSelection, lang, noSlotsMessage }) => {
    if (availableSlots.length === 0) {
        return (
            <div className="text-center p-4 bg-gray-100 rounded-md">
                <p className="text-gray-500">{noSlotsMessage}</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableSlots.map(slot => {
                 const isSelected = slot.id === selectedSlotId;
                 return (
                     <button 
                        key={slot.id} 
                        type="button"
                        onClick={() => onSlotSelection(slot.id)} 
                        className={`text-sm p-3 rounded-md text-center transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                            isSelected 
                            ? 'bg-brand-accent text-white font-bold ring-2 ring-brand-accent' 
                            : 'bg-gray-200 text-gray-800 hover:bg-green-100'
                        }`}
                        aria-pressed={isSelected}
                        aria-label={`Select appointment on ${new Date(slot.fields.DateTime).toLocaleString(lang)}`}
                    >
                         {new Date(slot.fields.DateTime).toLocaleString(lang, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                     </button>
                 );
            })}
        </div>
    );
}

export default AppointmentPicker;