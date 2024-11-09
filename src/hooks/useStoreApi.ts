import axios from '../lib/axios';
import {
  Balance,
  Good,
  PaymentConfirmationDto,
  PurchaseRequestDto,
  Subscription,
} from '../types';
import { loadFromLocalStorage, LOCAL_STORAGE } from '../utils/localStorage';

export function useStoreApi() {
  const getUser = () => {
    const user = loadFromLocalStorage(
      LOCAL_STORAGE.TELEGRAM_AUTH_DATA
    ) as string;
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  };

  const createOrder = async ({
    purchase_type,
    amount,
    purchaseId,
  }: Omit<PurchaseRequestDto, 'user'>) => {
    const user = getUser();

    return axios.post<{ paymentLink: string }>('/store/purchase', {
      user: JSON.parse(user),
      purchase_type,
      amount,
      purchaseId,
    });
  };

  const requestPaymenStatus = (orderId: string) => {
    return axios.get<PaymentConfirmationDto>('/store/purchase/confirm', {
      params: {
        orderId,
      },
    });
  };

  const loadUserBalance = () => {
    try {
      const user = getUser();

      return axios.post<Balance[]>('/store/get-wallet-balances', {
        user: JSON.parse(user),
      });
    } catch (message) {
      return Promise.reject({ message });
    }
  };

  const loadStoreGoods = () => {
    try {
      getUser();

      return axios.get<Good[]>('/store/buy_orders');
    } catch (message) {
      return Promise.reject({ message });
    }
  };

  const loadStoreSubscrptions = () => {
    try {
      const user = JSON.parse(getUser());

      return axios.get<{
        subscriptions: Subscription[];
        activeSubscriptions: number[];
      }>('/store/buy_subscriptions', {
        params: {
          id: user.id,
        },
      });
    } catch (message) {
      return Promise.reject({ message });
    }
  };

  return {
    requestPaymenStatus,
    createOrder,
    loadUserBalance,
    loadStoreGoods,
    loadStoreSubscrptions,
  };
}
