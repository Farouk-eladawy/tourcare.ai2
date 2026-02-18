import React, { useState } from 'react';

interface TimePickerProps {
    onClose: () => void;
    onSubmit: (time: string) => Promise<void>;
    submitText: string;
}

// Generate the time slots once, outside the component.
// This is more efficient as the list is static and fixes the conditional hook call issue.
const generateTimeSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 5) {
            const hour = h.toString().padStart(2, '0');
            const minute = m.toString().padStart(2, '0');
            slots.push(`${hour}:${minute}`);
        }
    }
    return slots;
};
const timeSlots = generateTimeSlots();

const TimePicker: React.FC<TimePickerProps> = ({ onClose, onSubmit, submitText }) => {
    const [selectedTime, setSelectedTime] = useState('09:00');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await onSubmit(selectedTime);
        setIsSubmitting(false);
    };

    return (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white w-72 rounded-lg shadow-2xl p-4 border border-gray-200 z-20">
            <div className="h-64 overflow-y-auto border border-gray-200 rounded-md bg-gray-50 mb-3">
                {timeSlots.map(time => (
                    <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`w-full text-center p-2 text-sm font-semibold transition-colors ${selectedTime === time ? 'bg-brand-accent text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                    >
                        {time}
                    </button>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-brand-accent text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent-hover transition disabled:bg-gray-400"
            >
                {isSubmitting ? '...' : submitText}
            </button>
        </div>
    );
};

export default TimePicker;