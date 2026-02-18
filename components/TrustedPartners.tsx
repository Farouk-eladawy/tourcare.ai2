import React from 'react';
import { TrustedPartnersContent } from '../types';

const getLogoSizeClass = (name: string): string => {
    switch (name) {
        case 'GetYourGuide':
        case 'Viator':
        case 'Headout':
        case 'Tiqets':
            return 'h-20'; // Increased from h-16 for better visibility
        default:
            return 'h-20';
    }
};

const TrustedPartners: React.FC<{ content: TrustedPartnersContent }> = ({ content }) => {
  // Duplicate the logos multiple times to ensure the marquee is always full, even on very wide screens.
  const logosToRender = Array(3).fill(content.partners).flat().map((partner, index) => (
      <li key={`${partner.name}-${index}`}>
        <img
            src={partner.logoUrl}
            alt={partner.name}
            // Displaying logos in full color on a light background.
            className={`${getLogoSizeClass(partner.name)} max-w-none transition-transform duration-300 hover:scale-105`}
        />
      </li>
  ));

  return (
    <section className="bg-brand-white py-8">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-8">
          {content.title}
        </h2>
        <div
          className="w-full inline-flex flex-nowrap overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0, black 128px, black calc(100% - 128px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 128px, black calc(100% - 128px), transparent 100%)',
          }}
        >
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-scroll">
            {logosToRender}
          </ul>
          {/* Duplicated for seamless animation */}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-scroll" aria-hidden="true">
            {logosToRender}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;