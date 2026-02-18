import React from 'react';

interface SloganBannerProps {
  slogan: string;
}

const SloganBanner: React.FC<SloganBannerProps> = ({ slogan }) => {
  return (
    <section className="bg-brand-light-gray py-10">
      <div className="container mx-auto px-6 z-20 text-center">
        <p className="text-xl md:text-2xl text-gray-700 italic max-w-3xl mx-auto font-semibold">
          {slogan}
        </p>
      </div>
    </section>
  );
};

export default SloganBanner;