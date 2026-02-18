
import React, { useState, useEffect } from 'react';
// FIX: Changed ConnectNowPageContent to DemoDashboardSimulationContent to match the expected props shape.
import { DemoDashboardSimulationContent } from '../../types';

interface DashboardLoadingProps {
  content: DemoDashboardSimulationContent['loadingScreen'];
  onComplete: () => void;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ content, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = content.steps.length;

    useEffect(() => {
        if (currentStep < totalSteps) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 900); // Slightly less than a second per step for a snappy feel
            return () => clearTimeout(timer);
        } else {
            // All steps are complete, wait a bit then call onComplete
            const finalTimer = setTimeout(() => {
                onComplete();
            }, 1000);
            return () => clearTimeout(finalTimer);
        }
    }, [currentStep, totalSteps, onComplete]);

    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="text-center w-full max-w-2xl flex flex-col items-center">
            <img 
                src="https://res.cloudinary.com/dqlurfwet/image/upload/v1760801741/20251018_1834_%D8%AA%D9%83%D8%A8%D9%8A%D8%B1_%D9%84%D9%88%D8%AC%D9%88_TourCare.AI_remix_01k7vz6rjze1gbrer8wx1eke0k_qgdxxq.png" 
                alt="TourCare.ai logo" 
                className="h-32 object-contain mb-6"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.title}</h2>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div 
                    className="bg-brand-accent h-2.5 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            
            <p className="text-gray-600 text-lg h-8 transition-opacity duration-300">
                {currentStep < totalSteps ? content.steps[currentStep] : content.complete}
            </p>
        </div>
    );
};

export default DashboardLoading;