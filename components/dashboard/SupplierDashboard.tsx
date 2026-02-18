
import React, { useState, useMemo } from 'react';
import { DemoDashboardSimulationContent, Platform } from '../../types';
import { useSupplierData } from '../../hooks/useSupplierData';
import BookingCard from './BookingCard';

interface SupplierDashboardProps {
  content: DemoDashboardSimulationContent['dashboard'];
  openAuthModal: () => void;
  platform: Platform;
}

const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ content, openAuthModal, platform }) => {
    const { bookings, isLoading, updateBooking } = useSupplierData(platform);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'bookings' | 'alerts'>('bookings');

    const filteredBookings = useMemo(() => {
        let filtered = bookings;

        if (activeTab === 'alerts') {
            filtered = filtered.filter(b => b.pickupStatus === 'Missing' || b.hasNewMessage);
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(b => 
                b.bookingNr.toLowerCase().includes(lowerSearch) ||
                b.customerName.toLowerCase().includes(lowerSearch)
            );
        }

        return filtered;
    }, [bookings, searchTerm, activeTab]);

    const alertCount = useMemo(() => {
        return bookings.filter(b => b.pickupStatus === 'Missing' || b.hasNewMessage).length;
    }, [bookings]);

    if (isLoading) {
        return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
                <div className="w-full md:w-auto flex-grow max-w-md">
                    <input 
                        type="search"
                        placeholder={content.searchPlaceholder}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition shadow-sm"
                    />
                </div>
            </div>

            {/* Local Data Warning Banner */}
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm">
                    <span className="font-bold">Demo Mode:</span> {content.demoNotice} {content.localDataWarning}
                </p>
                <button 
                    onClick={openAuthModal}
                    className="bg-yellow-500 text-white font-bold px-4 py-2 rounded-md hover:bg-yellow-600 transition text-sm flex-shrink-0"
                >
                    {content.upgradeButton}
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'bookings' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        {content.tabs.bookings}
                    </button>
                    <button 
                        onClick={() => setActiveTab('alerts')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'alerts' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        {content.tabs.alerts}
                        {alertCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                {alertCount}
                            </span>
                        )}
                    </button>
                </nav>
            </div>

            {/* Bookings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookings.map(booking => (
                    <BookingCard 
                        key={booking.id} 
                        booking={booking} 
                        content={content.bookingCard}
                        onUpdate={updateBooking}
                    />
                ))}
            </div>
            {filteredBookings.length === 0 && (
                 <div className="text-center py-10 col-span-full">
                    <p className="text-gray-600 text-lg">No bookings match your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default SupplierDashboard;