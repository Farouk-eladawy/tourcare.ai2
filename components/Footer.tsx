import React from 'react';
import { FooterContent } from '../types';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.98v16h4.98v-8.396c0-2.002 1.809-2.384 2.022-2.384 2.13 0 2.978 1.584 2.978 4.784v6h4.98v-9.589c0-4.882-3.23-5.411-5.148-5.411-2.4 0-4.136 1.34-4.814 2.518h.024v-2.019h-4.98v16h4.98v-8.396c0-2.002 1.809-2.384 2.022-2.384 2.13 0 2.978 1.584 2.978 4.784v6h4.98v-9.589c0-4.882-3.23-5.411-5.148-5.411-2.4 0-4.136 1.34-4.814 2.518z"/>
    </svg>
);

const Footer: React.FC<{ content: FooterContent }> = ({ content }) => {
  return (
    <footer className="bg-brand-blue text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <a href="#/" className="inline-block mb-4" aria-label="TourCare.ai Home">
              <div className="bg-white p-2 rounded-xl shadow-md">
                <img
                  src="https://res.cloudinary.com/dqlurfwet/image/upload/v1760801741/20251018_1834_%D8%AA%D9%83%D8%A8%D9%8A%D8%B1_%D9%84%D9%88%D8%AC%D9%88_TourCare.AI_remix_01k7vz6rjze1gbrer8wx1eke0k_qgdxxq.png"
                  alt="TourCare.ai logo"
                  style={{ height: 'var(--logo-height)' }}
                  className="object-contain"
                />
              </div>
            </a>
            <p className="max-w-xs text-gray-400">{content.slogan}</p>
            <div className="flex items-center space-x-4 mt-6">
              {content.socials.map(social => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="text-gray-400 hover:text-brand-accent transition-colors">
                  {social.name === 'Facebook' && <FacebookIcon />}
                  {social.name === 'LinkedIn' && <LinkedInIcon />}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {content.columns.map(column => (
              <div key={column.title}>
                <h4 className="font-bold text-white text-lg mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map(link => (
                    <li key={link.text}>
                      <a href={link.href} className="text-gray-400 hover:text-brand-accent hover:underline transition-colors">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-8 text-center text-sm text-gray-500">
          <p>{content.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;