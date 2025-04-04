// src/hooks/useArcPayApi.ts
import { OrderOut } from '@arcpay/react-sdk/dist/types/order';
import axios from '../lib/axios'; // Your configured axios instance
import { loadFromLocalStorage, LOCAL_STORAGE } from "../utils/localStorage";
import { AxiosError } from 'axios'; // Import AxiosError for better error handling

// Define an interface for the order details we expect to receive
interface CreateOrderDetails {
    amount: string; // e.g., "10.50"
    currency: string; // e.g., "TON"
    purchaseId: number | string; // The ID of the subscription being purchased
    description?: string; // Optional description for the order
}

// Define an interface for the expected backend request payload
// **IMPORTANT**: Adjust the keys here ('amount', 'currency_code', etc.)
// to *exactly* match what your backend '/arcpay/create-order' endpoint expects.
interface BackendOrderRequestPayload {
    amount: string;
    currency_code: string; // Example: Backend might expect 'currency_code' instead of 'currency'
    subscription_id: number | string; // Example: Backend might expect 'subscription_id'
    description?: string;
    auth_data: Record<string, any>; // Assuming your backend expects the parsed user auth object
    // Add any other fields your backend requires
}


export function useArcPayApi() {
    // Function to get parsed user data, returns null if not found/invalid
    const getUserAuthData = (): Record<string, any> | null => {
        try {
            const userJson = loadFromLocalStorage(LOCAL_STORAGE.TELEGRAM_AUTH_DATA) as string | null;
            if (!userJson) {
                console.warn('useArcPayApi: No Telegram auth data found in local storage.');
                return null;
            }
            const parsedUser = JSON.parse(userJson);
            // Add basic validation if needed (e.g., check for essential keys)
            if (typeof parsedUser !== 'object' || parsedUser === null) {
                console.error('useArcPayApi: Invalid user auth data format.');
                return null;
            }
            return parsedUser;
        } catch (error) {
            console.error('useArcPayApi: Failed to parse user auth data:', error);
            return null;
        }
    };

    /**
     * Creates an ArcPay order via the backend.
     * @param orderDetails - The details of the order to create.
     * @returns A Promise resolving to the OrderOut object from ArcPay.
     * @throws Throws an error if user is not authenticated or API call fails.
     */
    const createOrder = async (orderDetails: CreateOrderDetails): Promise<OrderOut> => {
        const userAuthData = getUserAuthData();

        if (!userAuthData) {
            // Throw an error if user data isn't available. The calling component should handle this.
            throw new Error("User authentication data not found. Please log in.");
        }

        // Construct the payload for your backend API
        // **VERIFY THESE KEYS MATCH YOUR BACKEND**
        const requestPayload: BackendOrderRequestPayload = {
            amount: orderDetails.amount,
            currency_code: orderDetails.currency, // Adjust key if needed (e.g., 'currency')
            subscription_id: orderDetails.purchaseId, // Adjust key if needed (e.g., 'purchaseId')
            description: orderDetails.description || `Subscription Purchase ID: ${orderDetails.purchaseId}`, // Provide a default description
            auth_data: userAuthData, // Send the parsed user auth data
        };

        console.log('useArcPayApi: Sending create order request to /arcpay/create-order with payload:', requestPayload);

        try {
            // Make the POST request to your backend endpoint
            const { data } = await axios.post<OrderOut>(
                '/arcpay/create-order', // Your backend endpoint URL
                requestPayload          // The data being sent
            );

            // Basic validation: Check if the response looks like a valid OrderOut
            // (at minimum, it should have a uuid)
            if (!data || !data.uuid) {
                console.error('useArcPayApi: Received invalid order data from backend:', data);
                throw new Error('Failed to create payment order: Invalid response from server.');
            }

            console.log('useArcPayApi: Order created successfully:', data);
            // Assuming your backend endpoint returns the full OrderOut object as expected by ArcPay SDK
            return data;

        } catch (error) {
            console.error('useArcPayApi: Error calling /arcpay/create-order:', error);

            // Provide more specific error feedback if possible
            let errorMessage = 'Failed to initiate ArcPay payment.';
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message?: string }>; // Type assertion for response data
                if (axiosError.response?.data?.message) {
                    // Use the error message from the backend if available
                    errorMessage = axiosError.response.data.message;
                } else if (axiosError.message) {
                    errorMessage = axiosError.message;
                }
            } else if (error instanceof Error) {
                // Use the message from Error objects (like the "User not authenticated" one)
                errorMessage = error.message;
            }

            // Re-throw a new error with a potentially more user-friendly message.
            // The component calling createOrder (Pay.tsx) should catch this.
            throw new Error(errorMessage);
        }
    };

    return {
        createOrder,
    };
}