
import React from 'react';
// FIX: Changed ConnectNowPageContent to DemoDashboardSimulationContent to match the expected props shape.
import { SupplierBooking, DemoDashboardSimulationContent } from '../../types';

interface BookingCardProps {
    booking: SupplierBooking;
    content: DemoDashboardSimulationContent['dashboard']['bookingCard'];
    onUpdate: (booking: SupplierBooking) => void;
}

const statusColors = {
    Confirmed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
};

const BookingCard: React.FC<BookingCardProps> = ({ booking, content, onUpdate }) => {
    
    const handleSetPickup = () => {
        const newTime = prompt("Enter pickup time (e.g., 10:00 AM):", "10:00");
        if (newTime) {
            onUpdate({ ...booking, pickupTime: newTime, pickupStatus: 'Set' });
        }
    };

    const handleSendMessage = () => {
        alert(`Simulating sending a message for booking: ${booking.bookingNr}`);
        if(booking.hasNewMessage) {
             onUpdate({ ...booking, hasNewMessage: false });
        }
    };
    
    const isAlert = booking.pickupStatus === 'Missing' || booking.hasNewMessage;

    return (
        <div className={`bg-white rounded-lg shadow-md border-l-4 ${isAlert ? 'border-red-500' : 'border-brand-accent'} p-5 flex flex-col gap-4`}>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-900">{booking.customerName}</h3>
                    <p className="text-sm text-gray-500">{booking.bookingNr}</p>
                </div>
                {booking.hasNewMessage && (
                    <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1 animate-pulse">
                        New
                    </span>
                )}
            </div>

            {/* Trip Info */}
            <div>
                <p className="font-semibold text-gray-800">{booking.tripName}</p>
                <p className="text-sm text-gray-600">{new Date(booking.tripDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm border-t border-b border-gray-200 py-3">
                <div>
                    <p className="text-gray-500">{content.pickup}</p>
                    {booking.pickupStatus === 'Set' ? (
                        <p className="font-bold text-brand-accent">{booking.pickupTime}</p>
                    ) : (
                        <p className="font-bold text-red-600">NOT SET</p>
                    )}
                </div>
                 <div>
                    <p className="text-gray-500">{content.status}</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status]}`}>
                        {booking.status}
                    </span>
                </div>
                 <div>
                    <p className="text-gray-500">Hotel</p>
                    <p className={`font-semibold ${!booking.hotelName ? 'text-red-600' : 'text-gray-800'}`}>
                        {booking.hotelName || 'Missing'}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500">PAX</p>
                    <p className="font-semibold text-gray-800">{booking.pax}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button 
                    onClick={handleSendMessage}
                    className="flex-1 bg-blue-500 text-white font-bold py-2 px-3 rounded-md hover:bg-blue-600 transition text-sm"
                >
                    {content.sendMessage}
                </button>
                <button 
                    onClick={handleSetPickup}
                    className="flex-1 bg-gray-700 text-white font-bold py-2 px-3 rounded-md hover:bg-gray-800 transition text-sm"
                >
                     {content.setPickup}
                </button>
            </div>
        </div>
    );
};

export default BookingCard;