import React from 'react';
import { ImpersonationBannerContent, User } from '../types';

interface ImpersonationBannerProps {
  content: ImpersonationBannerContent;
  impersonatedUser: User | null;
  onReturn: () => void;
}

const ImpersonationBanner: React.FC<ImpersonationBannerProps> = ({ content, impersonatedUser, onReturn }) => {
  if (!impersonatedUser) return null;

  const message = content.message.replace('{{name}}', impersonatedUser.fields.name);

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-2 text-center text-sm font-bold z-50 flex items-center justify-center gap-4">
      <p>{message}</p>
      <button
        onClick={onReturn}
        className="bg-yellow-800 text-white font-bold px-3 py-1 rounded-md hover:bg-yellow-900 transition text-xs"
      >
        {content.returnButton}
      </button>
    </div>
  );
};

export default ImpersonationBanner;