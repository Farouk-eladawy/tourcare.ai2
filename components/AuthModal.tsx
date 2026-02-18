import React, { useState, useEffect } from 'react';
import { AuthModalContent, Language, AppointmentSlot, User } from '../types';
import { fetchAirtableSlots, bookConsultation, createUser, findUserByEmail, checkPassword } from '../lib/api';
import AppointmentPicker from './AppointmentPicker';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: Omit<AuthModalContent, 'currentUser' | 'intent'>;
    lang: Language;
    planOfInterest: string | null;
    onLoginSuccess: (user: User) => void;
    currentUser: User | null;
    intent: 'auth' | 'booking';
}

type ModalView = 'booking' | 'auth';
type AuthMode = 'login' | 'signup';
type ModalState = 'loading' | 'collecting_info' | 'submitting' | 'confirmed' | 'error';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, content, lang, planOfInterest, onLoginSuccess, currentUser, intent }) => {
    const [view, setView] = useState<ModalView>('auth');
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [modalState, setModalState] = useState<ModalState>('collecting_info');
    
    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [note, setNote] = useState('');
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    const [slots, setSlots] = useState<AppointmentSlot[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Determine initial view based on props
    useEffect(() => {
        if (isOpen) {
             // Reset fields every time modal opens
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setNote('');
            setSelectedSlotId(null);
            setErrorMessage('');

            if (currentUser) {
                // Logged-in user: go straight to booking
                setView('booking');
                setModalState('loading');
                loadSlots();
                // Pre-fill user data
                setName(currentUser.fields.name);
                setEmail(currentUser.fields.Email);
            } else {
                // Not logged-in: always show auth first
                setView('auth');
                setAuthMode('login');
                setModalState('collecting_info');
            }
        }
    }, [isOpen, currentUser]);
    
    const loadSlots = async () => {
        try {
            const fetchedSlots = await fetchAirtableSlots();
            setSlots(fetchedSlots);
            setModalState('collecting_info');
        } catch (err) {
            setErrorMessage(content.errorMessage);
            setModalState('error');
        }
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalState('submitting');
        setErrorMessage('');

        let successfulUser: User | null = null;

        try {
            if (authMode === 'signup') {
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match.');
                }
                successfulUser = await createUser({ name, email, password });
            } else { // Login
                const user = await findUserByEmail(email);
                if (user && user.fields.password && await checkPassword(password, user.fields.password)) {
                    successfulUser = user;
                } else {
                    throw new Error('Invalid email or password.');
                }
            }

            if (successfulUser) {
                onLoginSuccess(successfulUser); // Update app state

                if (intent === 'booking') {
                    // Transition to booking view
                    setView('booking');
                    setModalState('loading');
                    loadSlots();
                    setName(successfulUser.fields.name);
                    setEmail(successfulUser.fields.Email);
                } else {
                    // Just an auth action, so close the modal
                    onClose();
                }
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'An error occurred.');
            setModalState('error');
        }
    };
    
    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !selectedSlotId) {
            setErrorMessage('Please fill in all required fields and select a time slot.');
            return;
        }
        
        const selectedSlot = slots.find(s => s.id === selectedSlotId);
        if (!selectedSlot) {
            setErrorMessage('Selected slot is not valid.');
            return;
        }

        setModalState('submitting');
        try {
            await bookConsultation({
                name,
                email,
                time: selectedSlot.fields.DateTime,
                planOfInterest: planOfInterest,
                note: note
            });
            setModalState('confirmed');
        } catch (err) {
            setErrorMessage(content.errorMessage);
            setModalState('error');
        }
    };

    const renderAuthView = () => (
        <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {authMode === 'login' ? content.loginTitle : content.signupTitle}
            </h3>
            {modalState === 'error' && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{errorMessage}</p>}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                    <input type="text" placeholder={content.formPlaceholderName} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-brand-accent"/>
                )}
                <input type="email" placeholder={content.formPlaceholderEmail} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-brand-accent"/>
                <input type="password" placeholder={content.formPlaceholderPassword} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-brand-accent"/>
                {authMode === 'signup' && (
                    <input type="password" placeholder={content.formPlaceholderConfirmPassword} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-brand-accent"/>
                )}
                <button type="submit" className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:bg-brand-accent-hover transition disabled:bg-gray-400" disabled={modalState === 'submitting'}>
                    {modalState === 'submitting' ? '...' : (authMode === 'login' ? content.loginButton : content.signupButton)}
                </button>
            </form>
            <div className="text-center mt-4">
                <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-sm text-brand-accent hover:underline">
                    {authMode === 'login' ? content.switchToSignup : content.switchToLogin}
                </button>
            </div>
        </div>
    );

    const renderBookingView = () => {
         switch (modalState) {
            case 'loading':
            case 'submitting':
                return (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto"></div>
                        <p className="text-gray-600 mt-4 font-semibold">
                            {modalState === 'loading' ? 'Loading available times...' : content.confirming}
                        </p>
                    </div>
                );
            case 'collecting_info':
                 return (
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{content.title}</h3>
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            <input type="text" placeholder={content.formPlaceholderName} value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-brand-accent"/>
                             <input type="email" placeholder={content.formPlaceholderEmail} value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-brand-accent"/>
                            <textarea placeholder={content.formPlaceholderNote} value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-brand-accent"></textarea>
                            <div className="pt-2">
                                <h4 className="font-bold text-gray-900 mb-3 text-center text-base">{content.slotPickerTitle}</h4>
                                <div className="max-h-48 overflow-y-auto p-1 bg-gray-50 rounded-lg">
                                    <AppointmentPicker availableSlots={slots} selectedSlotId={selectedSlotId} onSlotSelection={setSelectedSlotId} lang={lang} noSlotsMessage={content.noSlots}/>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:bg-brand-accent-hover transition disabled:bg-gray-400" disabled={!selectedSlotId}>
                                {content.submitButton}
                            </button>
                        </form>
                    </div>
                );

            case 'confirmed':
                 return (
                    <div className="text-center py-8">
                        <h3 className="text-2xl font-bold text-green-600 mb-2">{content.confirmationTitle}</h3>
                        <p className="text-gray-600">{content.confirmationMessage}</p>
                    </div>
                 );
            case 'error':
                 return (
                    <div className="text-center py-8">
                        <h3 className="text-2xl font-bold text-red-600 mb-2">{content.errorTitle}</h3>
                        <p className="text-gray-600">{errorMessage}</p>
                         <button onClick={onClose} className="mt-4 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md">Close</button>
                    </div>
                 );
        }
    }


    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" 
            onClick={onClose} 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="auth-modal-title"
        >
            <div 
                className="bg-white w-full max-w-lg rounded-lg shadow-2xl p-8 relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" aria-label={content.closeButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {view === 'auth' ? renderAuthView() : renderBookingView()}
            </div>
        </div>
    );
};

export default AuthModal;