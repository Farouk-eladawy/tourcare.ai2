

import React, { useState } from 'react';
import { DemoPageContent, Language, Platform } from '../types';
import ParticlesBackground from '../components/ParticlesBackground';
import AutomationWorkflow from '../components/AutomationWorkflow';
import GygLoginModal from '../components/dashboard/GygLoginModal';
import DashboardLoading from '../components/dashboard/DashboardLoading';
import SupplierDashboard from '../components/dashboard/SupplierDashboard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import BackgroundVideo from '../components/BackgroundVideo';

interface DemoPageProps {
  content: DemoPageContent;
  lang: Language;
  openAuthModal: (planName: string | null, intent: 'auth' | 'booking') => void;
}

type DemoView = 'choices' | 'workflow' | 'dashboard';
type DashboardState = 'idle' | 'login' | 'loading' | 'ready';

const DemoPage: React.FC<DemoPageProps> = ({ content, lang, openAuthModal }) => {
    const [view, setView] = useState<DemoView>('choices');
    const [dashboardState, setDashboardState] = useState<DashboardState>('idle');
    const [platform, setPlatform] = useState<Platform | null>(null);

    const titleRef = useScrollAnimation<HTMLHeadingElement>();
    const subtitleRef = useScrollAnimation<HTMLParagraphElement>({ delay: '150ms' });
    const choicesRef = useScrollAnimation<HTMLDivElement>({ delay: '300ms' });

    const handleStartWorkflow = () => setView('workflow');
    
    const handleStartDashboard = (selectedPlatform: Platform) => {
        setPlatform(selectedPlatform);
        setDashboardState('login');
        setView('dashboard');
    };
    
    const handleLoginSuccess = () => setDashboardState('loading');
    const handleLoadingComplete = () => setDashboardState('ready');

    const resetToChoices = () => {
        setView('choices');
        setDashboardState('idle');
        setPlatform(null);
    }
    
    const renderDashboardFlow = () => {
        switch (dashboardState) {
            case 'login':
                return platform && <GygLoginModal content={content.dashboardSimulation.loginModal} platformName={platform} onClose={resetToChoices} onSuccess={handleLoginSuccess} />;
            case 'loading':
                return <DashboardLoading content={content.dashboardSimulation.loadingScreen} onComplete={handleLoadingComplete} />;
            case 'ready':
                return platform && <SupplierDashboard content={content.dashboardSimulation.dashboard} openAuthModal={() => openAuthModal(null, 'booking')} platform={platform} />;
            default:
                return null;
        }
    }

    const renderContent = () => {
        if (view === 'workflow') {
            return (
                <div className="w-full">
                    <AutomationWorkflow onBookConsultation={() => openAuthModal(null, 'booking')} lang={lang} />
                </div>
            );
        }
        if (view === 'dashboard') {
            return <div className="w-full">{renderDashboardFlow()}</div>;
        }

        // Default view: 'choices'
        return (
            <div ref={choicesRef} className="scroll-animate grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
                {/* Workflow Card */}
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-lg border border-gray-200/80 flex flex-col items-center text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{content.workflow.title}</h2>
                    <p className="text-gray-600 mb-6 flex-grow">{content.workflow.description}</p>
                    <button onClick={handleStartWorkflow} className="bg-brand-accent text-white font-bold px-6 py-3 rounded-md hover:bg-brand-accent-hover transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                       {content.workflow.cta}
                    </button>
                </div>

                {/* Dashboard Card */}
                 <div className="bg-white/50 backdrop-blur-sm p-8 rounded-lg border border-gray-200/80 flex flex-col items-center text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{content.dashboard.title}</h2>
                    <p className="text-gray-600 mb-6 flex-grow">{content.dashboard.description}</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => handleStartDashboard('GetYourGuide')} className="bg-gray-800 text-white font-bold px-6 py-3 rounded-md hover:bg-gray-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                           {content.dashboard.connectGyg}
                        </button>
                         <button onClick={() => handleStartDashboard('Viator')} className="bg-gray-800 text-white font-bold px-6 py-3 rounded-md hover:bg-gray-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                           {content.dashboard.connectViator}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className={`relative py-16 min-h-[80vh] flex flex-col overflow-hidden ${view !== 'choices' ? 'bg-brand-light-gray' : ''}`}>
            {view === 'choices' && (
                <>
                    <BackgroundVideo src="https://res.cloudinary.com/dqlurfwet/video/upload/v1760505531/28657121-4a56-4468-b2de-53731deb4ae3_koemrh.mp4" />
                    <div className="absolute inset-0 bg-white/50 z-10"></div>
                </>
            )}
            {view !== 'choices' && <ParticlesBackground id="particles-demo-page" />}
            
            <div className="relative container mx-auto px-6 z-20 flex-grow flex flex-col items-center justify-center">
                 {view !== 'choices' && (
                    <div className="w-full max-w-6xl mb-8">
                        <button onClick={resetToChoices} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-accent transition">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                            {content.backButton}
                        </button>
                    </div>
                 )}

                {view === 'choices' && (
                     <div className="text-center mb-12">
                        <h1 ref={titleRef} className="scroll-animate text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                            {content.title}
                        </h1>
                        <p ref={subtitleRef} className="scroll-animate text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                           {content.subtitle}
                        </p>
                    </div>
                )}
                
                {renderContent()}
            </div>
        </section>
    );
};

export default DemoPage;