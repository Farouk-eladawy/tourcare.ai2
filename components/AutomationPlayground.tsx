import React from 'react';
import { useState } from 'react';
import ParticlesBackground from './ParticlesBackground';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface PlaygroundProps {
  content: {
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
  };
}

const AutomationPlayground: React.FC<PlaygroundProps> = ({ content }) => {
  const [bookingId, setBookingId] = useState('GYG-12345');
  const [route, setRoute] = useState('Dubai City Tour');
  const [pickupTime, setPickupTime] = useState('09:00 AM');
  const [result, setResult] = useState<object | null>(null);
  const [isSending, setIsSending] = useState(false);
  const ref = useScrollAnimation<HTMLElement>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setResult(null);

    setTimeout(() => {
      const resultJson = {
        bookingId,
        destination: "customer_whatsapp",
        message: `Hello! Your pickup for '${route}' is scheduled for ${pickupTime}.`,
        timestamp: new Date().toISOString(),
      };
      setResult(resultJson);
      setIsSending(false);
    }, 1500);
  };

  return (
    <section ref={ref} id="playground" className="scroll-animate relative py-16 bg-brand-white">
       <ParticlesBackground id="particles-playground" />
       <div className="relative container mx-auto px-6 z-20">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
            <p className="text-gray-600 mb-12">{content.description}</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-lg border border-gray-200/80">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700 mb-2">{content.form.bookingId}</label>
                        <input type="text" id="bookingId" value={bookingId} onChange={e => setBookingId(e.target.value)} className="w-full bg-brand-light-gray border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                    <div>
                        <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-2">{content.form.route}</label>
                        <input type="text" id="route" value={route} onChange={e => setRoute(e.target.value)} className="w-full bg-brand-light-gray border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                    <div>
                        <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">{content.form.pickupTime}</label>
                        <input type="text" id="pickupTime" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="w-full bg-brand-light-gray border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                    <button type="submit" disabled={isSending} className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:bg-brand-accent-hover transition disabled:bg-gray-500">
                        {isSending ? 'Sending...' : content.form.button}
                    </button>
                </form>
            </div>
            <div className="bg-gray-800 text-white backdrop-blur-sm p-8 rounded-lg border border-gray-600 min-h-[300px]">
                <h3 className="text-xl font-semibold text-white mb-4">{content.result.title}</h3>
                {isSending && <div className="text-gray-400">Simulating message send...</div>}
                {result && (
                    <div>
                        <p className="text-lg mb-4">
                            <span className="font-bold text-white">{content.result.status}:</span> 
                            <span className="text-green-400 font-semibold ms-2">{content.result.success}</span>
                        </p>
                        <pre className="bg-black p-4 rounded-md text-sm text-green-300 overflow-x-auto">
                            <code>{JSON.stringify(result, null, 2)}</code>
                        </pre>
                        <p className="mt-4 text-brand-accent bg-green-900/50 p-3 rounded-md">{content.result.sent}</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationPlayground;