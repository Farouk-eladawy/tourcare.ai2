import React from 'react';
import { ProductPageContent } from '../../types';
import ProductPageLayout from '../../components/ProductPageLayout';

interface OperationSysPageProps {
  pageContent: ProductPageContent;
  openAuthModal: (planName: string | null, intent?: 'auth' | 'booking') => void;
}

const OperationSysPage: React.FC<OperationSysPageProps> = ({ pageContent, openAuthModal }) => {
  // Now using the reusable layout component
  return <ProductPageLayout content={pageContent} onChoosePlan={(plan) => openAuthModal(plan, 'booking')} />;
};

export default OperationSysPage;