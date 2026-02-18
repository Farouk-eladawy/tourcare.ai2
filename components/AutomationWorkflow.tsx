import React, { useState, useRef } from 'react';
import { Language } from '../types';
import BookingPopup from './BookingPopup';
import TimePicker from './TimePicker';

interface AutomationWorkflowProps {
  onBookConsultation: () => void;
  lang: Language;
}

interface CustomerInfo {
    name: string;
    whatsapp: string;
    email: string;
}

const AutomationWorkflow: React.FC<AutomationWorkflowProps> = ({ onBookConsultation, lang }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [animatingStep, setAnimatingStep] = useState<number | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [isSubmittingStep, setIsSubmittingStep] = useState<number | null>(null);


    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    const content = {
        en: {
            steps: ["Book Now", "Collect Info", "Set Pickup Time", "Request Review", "Book Consultation"],
            actions: ["Start Booking", "Collect Data", "Set Time", "Send Request", "Book Now"],
            pickupTime: "Send Pickup Time",
            submitting: "Sending..."
        },
        ar: {
            steps: ["احجز الآن", "جمع المعلومات", "تحديد وقت الاستلام", "طلب تقييم", "حجز استشارة"],
            actions: ["ابدأ الحجز", "اجمع البيانات", "حدد الوقت", "أرسل الطلب", "احجز الآن"],
            pickupTime: "أرسل وقت الاستلام",
            submitting: "جاري الإرسال..."
        }
    };
    // FIX: Added a fallback to English to prevent runtime errors if an unsupported language is passed.
    const stepContent = content[lang as keyof typeof content] || content.en;

    const handleAnimationEnd = (stepIndex: number) => {
        setAnimatingStep(null);
        setCurrentStep(stepIndex + 1);
    };

    const triggerAnimation = (stepIndex: number) => {
        setAnimatingStep(stepIndex);
        // The CSS animation will handle the rest, and onAnimationEnd will update the state
    };
    
    const sendToWebhook = async (data: object) => {
        // FIX: Removed comment as 'import.meta.env' with type casting is a valid workaround.
        const webhookUrl = (import.meta as any).env.VITE_MAKE_TEST_WEBHOOK_URL;
        if (!webhookUrl) {
            console.warn("VITE_MAKE_TEST_WEBHOOK_URL is not set. Simulating API call.");
            console.log("Simulated Webhook Payload:", data);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            return true;
        }
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return response.ok;
        } catch (error) {
            console.error("Webhook call failed:", error);
            return false;
        }
    };

    const handleBookingSubmit = async (info: CustomerInfo) => {
        const success = await sendToWebhook({ ...info, action: stepContent.steps[0] });
        if (success) {
            setCustomerInfo(info);
            setIsPopupOpen(false);
            triggerAnimation(0);
        } else {
            alert("Failed to submit booking. Please try again.");
        }
    };

    const handleTimeSubmit = async (time: string) => {
        if (!customerInfo) return;
        const payload = { ...customerInfo, pickupTime: time };
        const success = await sendToWebhook({ ...payload, action: stepContent.steps[2] });
        if (success) {
            setIsTimePickerOpen(false);
            triggerAnimation(2); // Corresponds to "Set Pickup Time" step index
        } else {
             alert("Failed to submit time. Please try again.");
        }
    };
    
    const handleActionClick = async (index: number) => {
        switch (index) {
            case 0: // Start Booking
                setIsPopupOpen(true);
                break;
            case 1: // Collect Info
                if (!customerInfo) return;
                setIsSubmittingStep(1);
                const successCollect = await sendToWebhook({ ...customerInfo, action: stepContent.steps[1] });
                setIsSubmittingStep(null);
                if (successCollect) {
                    triggerAnimation(1);
                } else {
                    alert(lang === 'en' ? "Failed to send data. Please try again." : "فشل إرسال البيانات. يرجى المحاولة مرة أخرى.");
                }
                break;
            case 2: // Set Pickup Time
                setIsTimePickerOpen(true);
                break;
            case 3: // Request Review
                if (!customerInfo) return;
                setIsSubmittingStep(3);
                const successReview = await sendToWebhook({ ...customerInfo, action: stepContent.steps[3] });
                setIsSubmittingStep(null);
                if (successReview) {
                    triggerAnimation(3);
                } else {
                    alert(lang === 'en' ? "Failed to send review request. Please try again." : "فشل إرسال طلب التقييم. يرجى المحاولة مرة أخرى.");
                }
                break;
            case 4: // Book Consultation
                onBookConsultation();
                break;
            default:
                break;
        }
    };
    
    const icons = [
        // 1. Book Now Icon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>,
        // 2. Collect Info Icon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
        // 3. Pickup Time Icon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        // 4. Review Icon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345h5.518a.562.562 0 01.329 1.004l-4.243 3.232a.563.563 0 00-.178.643l2.125 5.111a.562.562 0 01-.84.634l-4.243-3.232a.563.563 0 00-.652 0l-4.243 3.232a.562.562 0 01-.84-.634l2.125-5.111a.563.563 0 00-.178-.643l-4.243-3.232a.562.562 0 01.329-1.004h5.518a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
        // 5. Consultation Icon
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 15.75h.008v.008H12v-.008z" /></svg>
    ];

    return (
        <div className="w-full max-w-5xl mx-auto py-12">
            <div className="relative flex flex-col items-center gap-12 md:flex-row md:justify-between md:items-start md:gap-0">
                {/* Connecting Line - For Desktop Only */}
                 <div className="absolute top-12 left-0 right-0 h-1 z-0 px-12 md:px-16 hidden md:block">
                    <svg width="100%" height="100%" viewBox="0 0 100 2" preserveAspectRatio="none">
                        <path d="M0 1 C 15 1, 10 -1, 25 1 S 40 3, 50 1 S 65 -1, 75 1 S 90 3, 100 1" stroke="#D1D5DB" strokeWidth="0.25" fill="none" strokeDasharray="2 2" />
                    </svg>
                </div>
                
                {stepContent.steps.map((step, index) => {
                    const isCompleted = currentStep > index;
                    const isActive = currentStep === index;
                    const isAnimating = animatingStep === index;

                    return (
                        // FIX: Corrected the ref callback function to have a `void` return type, resolving a TypeScript error where the assignment was implicitly returning a value.
                        <div key={index} ref={el => { stepRefs.current[index] = el; }} className="z-10 flex flex-col items-center gap-3 text-center w-32">
                            <div className={`
                                relative w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500
                                ${isCompleted ? 'bg-green-100 border-brand-accent text-brand-accent' : isActive ? 'bg-white border-brand-accent text-brand-accent' : 'bg-gray-100 border-gray-300 text-gray-400'}
                            `}>
                               {isCompleted && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                    </div>
                                )}
                                {!isCompleted && (
                                  <div 
                                    className={`
                                        transition-transform duration-1000 ease-out 
                                        ${isAnimating ? 'animate-hit' : ''}
                                    `}
                                    onAnimationEnd={() => handleAnimationEnd(index)}
                                  >
                                    {icons[index]}
                                  </div>
                                )}
                            </div>
                            <h3 className={`font-bold transition-colors ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-500'}`}>{step}</h3>
                            {isActive && (
                                <div className="relative">
                                    <button 
                                        onClick={() => handleActionClick(index)} 
                                        disabled={isSubmittingStep === index}
                                        className="bg-brand-accent text-white font-bold px-5 py-2 rounded-md hover:bg-brand-accent-hover transition text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isSubmittingStep === index ? stepContent.submitting : stepContent.actions[index]}
                                    </button>

                                    {index === 2 && isTimePickerOpen && (
                                        <TimePicker
                                            onClose={() => setIsTimePickerOpen(false)}
                                            onSubmit={handleTimeSubmit}
                                            submitText={stepContent.pickupTime}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
             {isPopupOpen && (
                <BookingPopup 
                    onClose={() => setIsPopupOpen(false)}
                    onSubmit={handleBookingSubmit}
                    lang={lang}
                />
             )}
        </div>
    );
};

export default AutomationWorkflow;