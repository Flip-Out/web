import { OrderOut } from '@arcpay/react-sdk/dist/types/order';
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

    const createOrder = async (): Promise<OrderOut> => {
        const user = getUser();
        console.log(`user: ${JSON.stringify(user)}`)
        const { data } = await axios.post<OrderOut>('/arcpay/create-order', {
            // user,
        });
        const order: OrderOut = data;
        return order;
    };

    return {
        createOrder,
    };
}