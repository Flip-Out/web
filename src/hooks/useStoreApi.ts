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
      return {};
    }
    return JSON.parse(user);
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
      user,
    });
  };

  const loadStoreGoods = () => {
    return axios.get<Good[]>('/store/buy_orders');
  };

  const loadStoreSubscrptions = () => {
    const user = getUser();

    return axios.get<{
      subscriptions: Subscription[];
      activeSubscriptions: number[];
    }>('/store/buy_subscriptions', {
      params: {
        id: user.id,
      },
    });
  };

  return {
    requestPaymenStatus,
    createOrder,
    loadUserBalance,
    loadStoreGoods,
    loadStoreSubscrptions,
  };
}
