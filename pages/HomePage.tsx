import React from 'react';
import { Content } from '../types';

import Hero from '../components/Hero';
import WhoItIsFor from '../components/WhoItIsFor';
import TrustedPartners from '../components/TrustedPartners';
import Stats from '../components/Stats';
import Workflow from '../components/Workflow';
import VisualFeatures from '../components/VisualFeatures';
import CtaSection from '../components/CtaSection';
import Integrations from '../components/Integrations';
import Testimonials from '../components/Testimonials';

interface HomePageProps {
    content: Content;
    setIsVideoModalOpen: (isOpen: boolean) => void;
    openAuthModal: (planName: string | null, intent: 'auth' | 'booking') => void;
}

const HomePage: React.FC<HomePageProps> = ({ content, setIsVideoModalOpen, openAuthModal }) => {
    return (
        <>
            <Hero 
                content={content.hero} 
                onWatchIntroClick={() => setIsVideoModalOpen(true)}
                onBookConsultationClick={() => openAuthModal(null, 'booking')}
            />
            <TrustedPartners content={content.trustedPartners} />
            <Stats content={content.stats} />
            <WhoItIsFor content={content.whoItIsFor} />
            <Workflow content={content.workflow} />
            <VisualFeatures content={content.visualFeatures} />
            <CtaSection content={content.ctaSection} onBookConsultationClick={() => openAuthModal(null, 'booking')} />
            {/* The playground is now its own page */}
            {/* <AutomationPlayground content={content.playground} /> */}
            <Integrations content={content.integrations} />
            <Testimonials content={content.testimonials} />
            {/* The FAQ, Pricing, and Offer sections are now their own pages */}
        </>
    );
}

export default HomePage;