import React, { useState, useEffect } from 'react';
import { useLocalization } from './hooks/useLocalization';
import { User } from './types';

import Header from './components/Header';
import Footer from './components/Footer';
import AiAssistantModal from './components/AiAssistantModal';
import VideoModal from './components/VideoModal';
import AuthModal from './components/AuthModal';
import SloganBanner from './components/SloganBanner';
import GuidingAssistant from './components/GuidingAssistant';
import ImpersonationBanner from './components/ImpersonationBanner';

// Page Components
import HomePage from './pages/HomePage';
import OfferPage from './pages/OfferPage';
import DemoPage from './pages/DemoPage';
import FaqPage from './pages/FaqPage';
import OperationSysPage from './pages/products/OperationSysPage';
import PickupTimePage from './pages/products/PickupTimePage';
import LiveSupportPage from './pages/products/LiveSupportPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const USER_SESSION_KEY = 'tourcare_user_session';
const ADMIN_SESSION_KEY = 'tourcare_admin_original_session';

function App() {
  const { lang, dir, content, changeLanguage, availableLangs } = useLocalization();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPlan, setAuthModalPlan] = useState<string | null>(null);
  const [authModalIntent, setAuthModalIntent] = useState<'auth' | 'booking'>('auth');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminOriginalSession, setAdminOriginalSession] = useState<User | null>(null);

  // Simple hash-based routing
  const [route, setRoute] = useState(window.location.hash || '#/');

  // Check for existing sessions on initial load
  useEffect(() => {
    try {
      const savedUserSession = localStorage.getItem(USER_SESSION_KEY);
      if (savedUserSession) {
        setCurrentUser(JSON.parse(savedUserSession));
      }
      const savedAdminSession = localStorage.getItem(ADMIN_SESSION_KEY);
      if (savedAdminSession) {
        setAdminOriginalSession(JSON.parse(savedAdminSession));
      }
    } catch (error) {
      console.error("Failed to parse session from localStorage", error);
      localStorage.removeItem(USER_SESSION_KEY);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
      window.scrollTo(0, 0); // Scroll to top on page change
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAuthModal = (planName: string | null = null, intent: 'auth' | 'booking' = 'auth') => {
    setAuthModalPlan(planName);
    // If a plan name is provided, the intent is always 'booking'. Otherwise, use the provided intent.
    setAuthModalIntent(planName ? 'booking' : intent);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    // The modal will now decide whether to close or switch views.
    // setIsAuthModalOpen(false); 
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAdminOriginalSession(null);
    localStorage.removeItem(USER_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    window.location.hash = '#/';
  };

  const handleImpersonate = (userToImpersonate: User) => {
    if (!currentUser || !currentUser.fields.isAdmin) {
      console.error("Only admins can impersonate users.");
      return;
    }
    // Store current admin session
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(currentUser));
    setAdminOriginalSession(currentUser);
    // Set current user to the impersonated one
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userToImpersonate));
    setCurrentUser(userToImpersonate);
    window.location.hash = '#/';
  };

  const handleReturnToAdmin = () => {
    const adminSessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
    if (adminSessionStr) {
      const adminSession = JSON.parse(adminSessionStr);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(adminSession));
      setCurrentUser(adminSession);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setAdminOriginalSession(null);
      window.location.hash = '#/admin';
    }
  };

  const renderPage = () => {
    // Admin route protection
    if (route === '#/admin') {
      if (currentUser?.fields.isAdmin) {
        return <AdminDashboardPage content={content.adminDashboard} onImpersonate={handleImpersonate} />;
      } else {
        window.location.hash = '#/'; // Redirect non-admins
        return null;
      }
    }

    switch (route) {
      case '#/':
        return <HomePage content={content} setIsVideoModalOpen={setIsVideoModalOpen} openAuthModal={openAuthModal} />;
      case '#/about':
        return <OfferPage content={content.commercialOffer} />;
      case '#/demo':
        return <DemoPage content={content.demoPage} lang={lang} openAuthModal={openAuthModal} />;
      case '#/faq':
        return <FaqPage content={content.faqSection} />;
      case '#/contact':
        return <ContactPage content={content.contactPage} />;
      case '#/products/operation-sys':
        return <OperationSysPage pageContent={content.productPages.operationSys} openAuthModal={openAuthModal} />;
      case '#/products/pickup-time':
        return <PickupTimePage content={content.productPages.pickupTime} openAuthModal={openAuthModal} />;
      case '#/products/live-support':
        return <LiveSupportPage content={content.productPages.liveSupport} openAuthModal={openAuthModal} />;
      case '#/privacy':
        return <PrivacyPolicyPage content={content.privacyPolicy} />;
      case '#/terms':
        return <TermsOfServicePage content={content.termsOfService} />;
      default:
        return <HomePage content={content} setIsVideoModalOpen={setIsVideoModalOpen} openAuthModal={openAuthModal} />;
    }
  }

  return (
    <div className={`${lang === 'ar' ? 'font-cairo' : 'font-sans'} bg-brand-white text-gray-800`} dir={dir}>
      {adminOriginalSession && (
        <ImpersonationBanner 
          content={content.impersonationBanner}
          impersonatedUser={currentUser}
          onReturn={handleReturnToAdmin}
        />
      )}
      <Header 
        content={content.header} 
        lang={lang} 
        availableLangs={availableLangs}
        changeLanguage={changeLanguage} 
        onAuthClick={() => openAuthModal(null, 'auth')}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main className={adminOriginalSession ? 'pt-12' : ''}>
        {renderPage()}
      </main>
      
      <SloganBanner slogan={content.slogan} />
      <Footer content={content.footer} />

      <GuidingAssistant
        onOpenAssistant={() => setIsAiModalOpen(true)}
        lang={lang}
        currentRoute={route}
      />

      <AiAssistantModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        aiAssistantContent={content.aiAssistant}
        pricingContent={content.pricing}
        lang={lang}
      />
      
      <VideoModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://drive.google.com/file/d/1xXNlbbZ9osKNvn9GHZ_1Oaj2KB33Z5JK/preview"
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        content={content.authModal}
        lang={lang}
        planOfInterest={authModalPlan}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
        intent={authModalIntent}
      />
    </div>
  );
}

export default App;