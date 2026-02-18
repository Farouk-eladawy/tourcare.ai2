import React from 'react';
import { IntegrationsContent } from '../types';

const Integrations: React.FC<{ content: IntegrationsContent }> = ({ content }) => {
  return (
    <section className="bg-brand-blue py-12">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-xl font-bold text-white mb-6">
          {content.title}
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
          {content.partners.map((partner, index) => (
            <div key={index} className="text-gray-300 text-lg font-medium transition duration-300 hover:text-white">
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;