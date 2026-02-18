import React, { useState } from 'react';
import { Language } from '../types';
import { countries, Country } from '../data/countries';
import CountryCodePicker from './CountryCodePicker';

interface BookingPopupProps {
    onClose: () => void;
    onSubmit: (info: { name: string, whatsapp: string, email: string }) => Promise<void>;
    lang: Language;
}

const content = {
    en: {
        title: "Start Live Test",
        namePlaceholder: "Your Name",
        emailPlaceholder: "Your Email",
        whatsappPlaceholder: "Your WhatsApp Number",
        submitButton: "Start Automation",
        submitting: "Starting...",
        description: "Enter your details to receive live notifications as we simulate the booking process.",
    },
    ar: {
        title: "بدء الاختبار المباشر",
        namePlaceholder: "اسمك",
        emailPlaceholder: "بريدك الإلكتروني",
        whatsappPlaceholder: "رقم الواتساب الخاص بك",
        submitButton: "بدء الأتمتة",
        submitting: "جاري البدء...",
        description: "أدخل بياناتك لتلقي إشعارات مباشرة أثناء محاكاة عملية الحجز.",
    }
}

const BookingPopup: React.FC<BookingPopupProps> = ({ onClose, onSubmit, lang }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const popupContent = content[lang] || content.en;
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone) {
            alert("Please fill all fields.");
            return;
        }
        setIsSubmitting(true);
        const fullWhatsapp = `${selectedCountry.dial_code}${phone}`;
        await onSubmit({ name, whatsapp: fullWhatsapp, email });
        // The parent component will close the modal on success
        setIsSubmitting(false);
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-lg shadow-2xl p-8" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{popupContent.title}</h2>
                <p className="text-gray-600 mb-6">{popupContent.description}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text"
                        placeholder={popupContent.namePlaceholder}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                        required
                    />
                     <input 
                        type="email"
                        placeholder={popupContent.emailPlaceholder}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                        required
                    />
                    <div className="flex">
                        <CountryCodePicker selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
                        <input 
                            type="tel"
                            placeholder={popupContent.whatsappPlaceholder}
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full bg-gray-100 border border-l-0 border-gray-300 rounded-r-md p-3 text-gray-800 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                            required
                        />
                    </div>
                     <button 
                        type="submit"
                        className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:bg-brand-accent-hover transition disabled:bg-gray-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? popupContent.submitting : popupContent.submitButton}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookingPopup;
