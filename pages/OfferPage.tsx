import React from 'react';
import CommercialOffer from '../components/CommercialOffer';
import { CommercialOfferContent } from '../types';

interface OfferPageProps {
  content: CommercialOfferContent;
}

const OfferPage: React.FC<OfferPageProps> = ({ content }) => {
  return <CommercialOffer content={content} />;
};

export default OfferPage;
