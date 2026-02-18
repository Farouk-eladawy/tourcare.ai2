import React from 'react';
import { ProductPageContent } from '../../types';
import ProductPageLayout from '../../components/ProductPageLayout';

interface PickupTimePageProps {
  content: ProductPageContent;
  openAuthModal: (planName: string | null, intent?: 'auth' | 'booking') => void;
}

const PickupTimePage: React.FC<PickupTimePageProps> = ({ content, openAuthModal }) => {
  return <ProductPageLayout content={content} onChoosePlan={(plan) => openAuthModal(plan, 'booking')} />;
};

export default PickupTimePage;