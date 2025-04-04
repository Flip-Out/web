import { OrderOut } from '@arcpay/react-sdk/dist/types/order';
import axios from 'axios';
import axiosInstance from '../lib/axios';
import { loadFromLocalStorage, LOCAL_STORAGE } from "../utils/localStorage";
import { type AxiosError } from 'axios';
import { useCallback } from 'react';

interface CreateOrderDetails {
    amount: string;
    currency: string;
    purchaseId: number | string;
    description?: string;
}

interface BackendOrderRequestPayload {
    amount: string;
    currency_code: string;
    subscription_id: number | string;
    description?: string;
    auth_data: Record<string, any>;
}

export function useArcPayApi() {
    const getUserAuthData = (): Record<string, any> | null => {
        try {
            const userJson = loadFromLocalStorage(LOCAL_STORAGE.TELEGRAM_AUTH_DATA) as string | null;
            if (!userJson) {
                return null;
            }
            const parsedUser = JSON.parse(userJson);
            if (typeof parsedUser !== 'object' || parsedUser === null) {
                return null;
            }
            return parsedUser;
        } catch (error) {
            console.error('useArcPayApi: Failed to parse user auth data:', error);
            return null;
        }
    };

    const createOrder = useCallback(async (orderDetails: CreateOrderDetails): Promise<OrderOut> => {
        const userAuthData = getUserAuthData();

        if (!userAuthData) {
            throw new Error("User authentication data not found. Please log in.");
        }

        const requestPayload: BackendOrderRequestPayload = {
            amount: orderDetails.amount,
            currency_code: orderDetails.currency,
            subscription_id: orderDetails.purchaseId,
            description: orderDetails.description || `Subscription Purchase ID: ${orderDetails.purchaseId}`,
            auth_data: userAuthData,
        };

        try {
            const { data } = await axiosInstance.post<OrderOut>(
                '/arcpay/create-order',
                requestPayload
            );

            if (!data || !data.uuid) {
                throw new Error('Failed to create payment order: Invalid response from server.');
            }
            return data;

        } catch (error) {
            let errorMessage = 'Failed to initiate ArcPay payment.';
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message?: string }>;
                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                } else if (axiosError.message) {
                    errorMessage = axiosError.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("ArcPay createOrder API Error:", error);
            throw new Error(errorMessage);
        }
    }, []);

    return {
        createOrder,
    };
}
