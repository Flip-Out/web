import axios from '../lib/axios';
import { PurchaseRequestDto, PurchaseStatus } from '../types';
import { loadFromLocalStorage, LOCAL_STORAGE } from '../utils/localStorage';

export function useStoreApi() {
  const createOrder = async ({
    purchase_type,
    amount,
  }: Omit<PurchaseRequestDto, 'user'>) => {
    const user = loadFromLocalStorage(
      LOCAL_STORAGE.TELEGRAM_AUTH_DATA
    ) as string;
    if (!user) {
      return;
    }

    return axios.post<{ paymentLink: string }>('/store/purchase', {
      user: JSON.parse(user),
      purchase_type,
      amount,
    });
  };

  const requestPaymenStatus = (orderId: string) => {
    return axios.get<{ purchaseStatus: PurchaseStatus }>(
      '/store/purchase/confirm',
      {
        params: {
          orderId,
        },
      }
    );
  };

  return { requestPaymenStatus, createOrder };
}
