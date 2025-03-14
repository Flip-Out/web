import axios from '../lib/axios';
import {loadFromLocalStorage, LOCAL_STORAGE} from "../utils/localStorage.ts";
export function useArcPayApi() {
    const getUser = () => {
        const user = loadFromLocalStorage(
            LOCAL_STORAGE.TELEGRAM_AUTH_DATA
        ) as string;
        if (!user) {
            return {};
        }
        return JSON.parse(user);
    };

    const createOrder = async () => {
        const user = getUser();

        return axios.post<{ paymentLink: string }>('/arcpay/create-order', {
            // user,
        });
    };

    return {
        createOrder,
    };
}