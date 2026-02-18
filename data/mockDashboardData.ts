
import { SupplierBooking, Platform } from '../types';

const sampleTripNames = [
    'Dubai Desert Safari', 'Burj Khalifa Sky Views', 'Abu Dhabi Grand Mosque Tour',
    'Morning Quad Biking Adventure', 'Dubai City Sightseeing', 'Dhow Cruise Marina Dinner'
];
const sampleCustomerNames = [
    'John Smith', 'Maria Garcia', 'Ahmed Khan', 'Chen Wei', 'Fatima Al-Jamil',
    'Hans Müller', 'Olga Petrova', 'Javier Rodriguez', 'Priya Sharma', 'Kenji Tanaka'
];
const sampleHotelNames = [
    'Atlantis, The Palm', 'Burj Al Arab Jumeirah', 'JW Marriott Marquis', 'Address Downtown',
    'Rove Downtown', null, 'Le Royal Méridien', 'Grosvenor House', null
];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateMockBookings = (count: number, platform: Platform = 'GetYourGuide'): SupplierBooking[] => {
    const bookings: SupplierBooking[] = [];
    const today = new Date();
    const bookingPrefix = platform === 'Viator' ? 'BR-' : 'GYG-';

    for (let i = 0; i < count; i++) {
        const tripDate = new Date(today);
        tripDate.setDate(today.getDate() + Math.floor(Math.random() * 14)); // Sometime in the next 2 weeks

        const statusOptions: SupplierBooking['status'][] = ['Confirmed', 'Confirmed', 'Pending', 'Cancelled'];
        const pickupStatusOptions: SupplierBooking['pickupStatus'][] = ['Set', 'Missing', 'Missing'];
        
        const hotelName = getRandomElement(sampleHotelNames);
        const pickupStatus = hotelName === null ? 'Missing' : getRandomElement(pickupStatusOptions);
        const pickupTime = pickupStatus === 'Set' ? '09:30' : null;

        const booking: SupplierBooking = {
            id: `booking_${i + 1}_${platform.toLowerCase()}`,
            bookingNr: `${bookingPrefix}${Math.floor(1000000 + Math.random() * 9000000)}`,
            tripName: getRandomElement(sampleTripNames),
            tripDate: tripDate.toISOString().split('T')[0],
            customerName: getRandomElement(sampleCustomerNames),
            pax: `${Math.floor(1 + Math.random() * 4)} Adults`,
            status: getRandomElement(statusOptions),
            pickupStatus: pickupStatus,
            hotelName: hotelName || '',
            roomNumber: hotelName ? `${Math.floor(100 + Math.random() * 900)}` : '',
            pickupTime: pickupTime,
            hasNewMessage: Math.random() > 0.8,
        };
        bookings.push(booking);
    }
    return bookings;
};