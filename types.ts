// FIX: Removed self-import causing circular dependency.
export type Language = 'en' | 'ar' | 'de' | 'es';
export type Direction = 'ltr' | 'rtl';
export type Platform = 'GetYourGuide' | 'Viator';

export interface User {
    id: string;
    fields: {
        name: string;
        Email: string;
        password?: string;
        isAdmin?: boolean;
    };
}

export interface NavLink {
    type: 'link';
    href: string;
    text: string;
}

export interface NavDropdown {
    type: 'dropdown';
    title: string;
    items: {
        href: string;
        text: string;
        description: string;
    }[];
}

export interface HeaderContent {
    navItems: (NavLink | NavDropdown)[];
    cta: string;
    login: string;
    logout: string;
    welcome: string;
    adminDashboard: string;
}

export interface HeroContent {
    headline: string;
    secondaryText: string;
    ctaTrial: string;
    ctaDemo: string;
    ctaIntro: string;
}

export interface TrustedPartnersContent {
    title: string;
    partners: { name: string; logoUrl: string }[];
}

export interface Stat {
    value: string;
    label: string;
}

export interface StatsContent {
    stats: Stat[];
}

export interface WhoItIsForContent {
    title: string;
    focus: string;
    points: string[];
}

export interface WorkflowContent {
    title: string;
    steps: {
        icon: string;
        title: string;
        description: string;
    }[];
}

export interface VisualFeaturesContent {
    title: string;
    features: {
        image: string;
        title: string;
        description: string;
        points: string[];
    }[];
}

export interface CtaSectionContent {
    title: string;
    subtitle: string;
    cta: string;
}

export interface PlaygroundContent {
    title: string;
    description: string;
    form: {
        bookingId: string;
        route: string;
        pickupTime: string;
        button: string;
    };
    result: {
        title: string;
        status: string;
        success: string;
        sent: string;
    };
}

export interface IntegrationsContent {
    title: string;
    partners: string[];
}

export interface TestimonialsContent {
    title: string;
    quote: string;
    author: string;
    company: string;
}

export interface Plan {
    name: string;
    price: string;
    features: string[];
    cta: string;
}

export interface PricingContent {
    title: string;
    plans: Plan[];
    retainer: string;
}

export interface FooterLink {
    text: string;
    href: string;
}

export interface FooterColumn {
    title: string;
    links: FooterLink[];
}

export interface FooterContent {
    slogan: string;
    copyright: string;
    socials: { name: string; href: string }[];
    columns: FooterColumn[];
}

export interface AiAssistantContent {
    openButtonLabel: string;
    title: string;
    description: string;
    initialMessage: string;
    inputPlaceholder: string;
    clearChat: string;
}

export interface AuthModalContent {
    title: string; // Used for booking
    loginTitle: string;
    signupTitle: string;
    closeButton: string;
    formPlaceholderFirstName: string;
    formPlaceholderLastName: string;
    formPlaceholderName: string; // For signup
    formPlaceholderEmail: string;
    formPlaceholderPassword: string;
    formPlaceholderConfirmPassword: string;
    formPlaceholderNote: string;
    slotPickerTitle: string;
    noSlots: string;
    submitButton: string;
    loginButton: string;
    signupButton: string;
    confirming: string;
    confirmationTitle: string;
    confirmationMessage: string;
    errorTitle: string;
    errorMessage: string;
    switchToSignup: string;
    switchToLogin: string;
    currentUser: User | null;
    intent: 'auth' | 'booking';
}

export interface CommercialOfferContent {
    mainTitle: string;
    whoWeAre: {
        description: string;
    };
    vision: {
        title: string;
        description: string;
    };
    whatWeOffer: {
        title: string;
        description: string;
        features: {
            icon: string;
            text: string;
        }[];
    };
}

export interface FaqItem {
    q: string;
    a: string;
}

export interface FaqCategory {
    title: string;
    icon: string;
    items: FaqItem[];
}

export interface FaqSectionContent {
    pageTitle: string;
    allCategories: string;
    searchPlaceholder: string;
    categories: FaqCategory[];
}

export interface ContactPageContent {
    pageTitle: string;
    intro: string;
    whyContact: {
        title: string;
        reasons: string[];
    };
    directContact: {
        title: string;
        items: {
            icon: string;
            label: string;
            value: string;
            href?: string;
        }[];
    };
    instantChannels: {
        title: string;
        items: {
            icon: string;
            label: string;
            action: string;
            href: string;
        }[];
    };
    formSection: {
        title: string;
        subtitle: string;
        form: {
            companyName: string;
            contactPerson: string;
            email: string;
            phone: string;
            platforms: string;
            platformOptions: string[];
            message: string;
            submitButton: string;
            sendingButton: string;
        };
        confirmation: string;
    };
}

export interface ProductPageContent {
  navTitle: string;
  hero: { title: string; subtitle: string; };
  descriptionSection: {
    title: string;
    content: string;
    features: { icon: string; text: string; }[];
  };
  benefits?: {
      title: string;
      features: { icon: string; text: string; }[];
  };
  pricing: {
    title: string;
    plans: Plan[];
  };
  cta: CtaSectionContent;
}

export interface PrivacyPolicySection {
    title: string;
    content: string | string[];
}

export interface PrivacyPolicyContent {
    pageTitle: string;
    lastUpdated: string;
    sections: PrivacyPolicySection[];
}

export interface TermsOfServiceContent {
    pageTitle: string;
    lastUpdated: string;
    sections: PrivacyPolicySection[];
}

export interface SupplierBooking {
    id: string;
    bookingNr: string;
    tripName: string;
    tripDate: string;
    customerName: string;
    pax: string; // e.g., "2 Adults, 1 Child"
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    pickupStatus: 'Set' | 'Missing';
    hotelName: string;
    roomNumber: string;
    pickupTime: string | null;
    hasNewMessage: boolean;
}

export interface DemoDashboardSimulationContent {
    loginModal: {
        title: string; // e.g. "Log in to {{platform}}"
        emailPlaceholder: string;
        passwordPlaceholder: string;
        loginButton: string;
        description: string;
    };
    loadingScreen: {
        title: string;
        steps: string[];
        complete: string;
    };
    dashboard: {
        title: string;
        searchPlaceholder: string;
        localDataWarning: string;
        demoNotice: string;
        upgradeButton: string;
        tabs: {
            bookings: string;
            alerts: string;
        };
        bookingCard: {
            pickup: string;
            missingInfo: string;
            status: string;
            sendMessage: string;
            setPickup: string;
        }
    };
}


export interface DemoPageContent {
    title: string;
    subtitle: string;
    backButton: string;
    workflow: {
        title: string;
        description: string;
        cta: string;
    };
    dashboard: {
        title: string;
        description: string;
        connectGyg: string;
        connectViator: string;
    };
    dashboardSimulation: DemoDashboardSimulationContent;
}

export interface AdminDashboardContent {
    pageTitle: string;
    searchPlaceholder: string;
    totalUsers: string; // e.g., "Total Users: {{count}}"
    tableHeaders: {
        name: string;
        email: string;
        role: string;
        actions: string;
    };
    roleAdmin: string;
    roleUser: string;
    loginAsButton: string;
    loggingIn: string;
}

export interface ImpersonationBannerContent {
    message: string; // e.g., "You are viewing as {{name}}."
    returnButton: string;
}


export interface Content {
    header: HeaderContent;
    hero: HeroContent;
    trustedPartners: TrustedPartnersContent;
    stats: StatsContent;
    whoItIsFor: WhoItIsForContent;
    workflow: WorkflowContent;
    visualFeatures: VisualFeaturesContent;
    ctaSection: CtaSectionContent;
    playground: PlaygroundContent;
    integrations: IntegrationsContent;
    testimonials: TestimonialsContent;
    pricing: PricingContent;
    slogan: string;
    footer: FooterContent;
    aiAssistant: AiAssistantContent;
    authModal: AuthModalContent;
    commercialOffer: CommercialOfferContent;
    faqSection: FaqSectionContent;
    contactPage: ContactPageContent;
    privacyPolicy: PrivacyPolicyContent;
    termsOfService: TermsOfServiceContent;
    demoPage: DemoPageContent;
    productPages: {
      operationSys: ProductPageContent;
      pickupTime: ProductPageContent;
      liveSupport: ProductPageContent;
    };
    adminDashboard: AdminDashboardContent;
    impersonationBanner: ImpersonationBannerContent;
}

export interface AppointmentSlot {
    id: string;
    fields: {
        DateTime: string;
        Status: string;
    };
}