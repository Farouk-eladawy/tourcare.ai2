
import React, { useState } from 'react';
import { DemoDashboardSimulationContent } from '../../types';

interface GygLoginModalProps {
  content: DemoDashboardSimulationContent['loginModal'];
  platformName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const GygLoginModal: React.FC<GygLoginModalProps> = ({ content, platformName, onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call for login
        setTimeout(() => {
            setIsLoading(false);
            onSuccess();
        }, 1500);
    };

    const title = content.title.replace('{{platform}}', platformName);

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gyg-login-title"
        >
            <div 
                className="bg-white w-full max-w-sm rounded-lg shadow-2xl p-8" 
                onClick={e => e.stopPropagation()}
            >
                <h2 id="gyg-login-title" className="text-2xl font-bold text-center mb-2 text-gray-900">{title}</h2>
                <p className="text-gray-600 text-center mb-6 text-sm">{content.description}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder={content.emailPlaceholder} 
                        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent" 
                        required 
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder={content.passwordPlaceholder} 
                        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent" 
                        required 
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:bg-brand-accent-hover transition disabled:bg-gray-400"
                    >
                        {isLoading ? 'Logging in...' : content.loginButton}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GygLoginModal;
