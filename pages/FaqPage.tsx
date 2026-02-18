import React from 'react';
import FaqSection from '../components/FaqSection';
import { FaqSectionContent } from '../types';

interface FaqPageProps {
  content: FaqSectionContent;
}

const FaqPage: React.FC<FaqPageProps> = ({ content }) => {
  return <FaqSection content={content} />;
};

export default FaqPage;
