import axios from '../lib/axios';
import { Balance, PaymentConfirmationDto, PurchaseRequestDto } from '../types';
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
  }: Omit<PurchaseRequestDto, 'user'>) => {
    const user = getUser();

    return axios.post<{ paymentLink: string }>('/store/purchase', {
      user: JSON.parse(user),
      purchase_type,
      amount,
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

  return { requestPaymenStatus, createOrder, loadUserBalance };
}
