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
    const user = getUser();

    return axios.post<Balance[]>('/store/get-wallet-balances', {
      user: JSON.parse(user),
    });
  };

  const loadStoreGoods = () => {
    return axios.get<Good[]>('/store/buy_orders');
  };

  const loadStoreSubscrptions = () => {
    return axios.get<Subscription[]>('/store/buy_subscriptions');
  };

  return {
    requestPaymenStatus,
    createOrder,
    loadUserBalance,
    loadStoreGoods,
    loadStoreSubscrptions,
  };
}
