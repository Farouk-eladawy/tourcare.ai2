import { AppointmentSlot, User } from '../types';

/**
 * Generates more realistic mock appointment slots for demonstration or fallback purposes.
 * It creates slots for the next few business days, skipping weekends.
 */
const generateMockSlots = (): AppointmentSlot[] => {
    const slots: AppointmentSlot[] = [];
    const now = new Date();
    let currentDay = new Date(now);

    let slotsGenerated = 0;
    const totalSlotsToGenerate = 6;

    // Loop until we have enough slots, checking up to 10 days in the future
    for (let dayOffset = 1; dayOffset <= 10 && slotsGenerated < totalSlotsToGenerate; dayOffset++) {
        currentDay = new Date(now);
        currentDay.setDate(now.getDate() + dayOffset);

        const dayOfWeek = currentDay.getDay();
        // Skip weekends (Saturday=6, Sunday=0)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            continue;
        }

        // Define potential appointment times for a business day
        const daySlotTimes = [
            new Date(currentDay.setHours(9, 0, 0, 0)),
            new Date(currentDay.setHours(11, 30, 0, 0)),
            new Date(currentDay.setHours(14, 0, 0, 0)),
        ];

        for (const slotTime of daySlotTimes) {
            if (slotsGenerated < totalSlotsToGenerate) {
                slots.push({
                    id: `mock_slot_${slotsGenerated + 1}`,
                    fields: {
                        DateTime: slotTime.toISOString(),
                        Status: 'Available'
                    }
                });
                slotsGenerated++;
            }
        }
    }

    return slots.sort((a, b) => new Date(a.fields.DateTime).getTime() - new Date(b.fields.DateTime).getTime());
};


/**
 * Fetches available appointment slots from an Airtable base.
 * This function now reads credentials from environment variables for security.
 */
export const fetchAirtableSlots = async (): Promise<AppointmentSlot[]> => {
    const baseId = (import.meta as any).env.VITE_AIRTABLE_BASE_ID;
    const tableName = (import.meta as any).env.VITE_AIRTABLE_TABLE_NAME;
    const apiKey = (import.meta as any).env.VITE_AIRTABLE_API_KEY;

    if (!baseId || !tableName || !apiKey) {
        console.warn("Airtable appointment environment variables are not set. Using mock data.");
        return generateMockSlots();
    }
    
    const filterFormula = "AND({Status} = 'Available', DATETIME_DIFF({DateTime}, NOW()) > 0)";
    const encodedFilter = encodeURIComponent(filterFormula);

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?view=Grid%20view&filterByFormula=${encodedFilter}`;
    
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Airtable API error: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data.records && data.records.length > 0) {
            return data.records as AppointmentSlot[];
        }

        console.log("No available slots found in Airtable. Generating smart fallback slots.");
        return generateMockSlots();

    } catch (error) {
        console.error('An error occurred during the Airtable fetch operation:', error);
        throw error;
    }
};


interface BookingPayload {
    name: string;
    email: string;
    time: string; // ISO string format
    planOfInterest: string | null;
    note?: string;
}

/**
 * Sends the new consultation booking details to a Make.com webhook.
 */
export const bookConsultation = async (payload: BookingPayload): Promise<void> => {
    const webhookUrl = (import.meta as any).env.VITE_MAKE_BOOKING_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn("VITE_MAKE_BOOKING_WEBHOOK_URL is not set. Simulating a successful booking for demonstration purposes.");
        console.log("DEMO: Booking payload that would be sent:", payload);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return;
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to book consultation. Server responded with: ${errorText}`);
        }
    } catch (error) {
        console.error('An error occurred during the webhook fetch operation:', error);
        throw error;
    }
};


// --- User Authentication Functions ---

// IMPORTANT: This is a client-side simulation of hashing.
// In a production environment, hashing should ALWAYS be done on a secure server.
// Using btoa for this demo as a simple transformation.
const hashPassword = async (password: string): Promise<string> => {
    return btoa(password);
};

export const checkPassword = async (input: string, hashed: string): Promise<boolean> => {
    return btoa(input) === hashed;
};

const getAirtableUserConfig = () => {
    const baseId = (import.meta as any).env.VITE_AIRTABLE_BASE_ID;
    const tableName = (import.meta as any).env.VITE_AIRTABLE_USERS_TABLE;
    const apiKey = (import.meta as any).env.VITE_AIRTABLE_API_KEY;

    if (!baseId || !tableName || !apiKey) {
        throw new Error("Airtable user configuration is missing. Please set environment variables.");
    }
    return { baseId, tableName, apiKey };
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const { baseId, tableName, apiKey } = getAirtableUserConfig();
    const filterFormula = `{Email} = "${email}"`;
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) throw new Error('Failed to fetch user data.');
        
        const data = await response.json();
        if (data.records && data.records.length > 0) {
            return data.records[0] as User;
        }
        return null;
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw error;
    }
};

export const createUser = async (userData: {name: string, email: string, password: string}): Promise<User> => {
    const { baseId, tableName, apiKey } = getAirtableUserConfig();
    
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('An account with this email already exists.');
    }

    const hashedPassword = await hashPassword(userData.password);
    
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    
    const payload = {
        records: [{
            fields: {
                name: userData.name,
                Email: userData.email,
                password: hashedPassword
            }
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Airtable create user error:", errorBody);
            throw new Error('Failed to create user account.');
        }

        const responseData = await response.json();
        const newUser: User = responseData.records[0];
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const fetchAllUsers = async (): Promise<User[]> => {
    const { baseId, tableName, apiKey } = getAirtableUserConfig();
    // Select only non-sensitive fields
    const fields = ['name', 'Email', 'isAdmin'];
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?${fields.map(f => `fields%5B%5D=${f}`).join('&')}`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Airtable API error: ${errorText}`);
        }

        const data = await response.json();
        return (data.records as User[]) || [];
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};