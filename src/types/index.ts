import { TelegramAuthData } from '@telegram-auth/react';
import { ReactElement } from 'react';

export interface GenericProps {
  children?: ReactElement | ReactElement[] | string;
}

export interface Subscription {
  id: number;
  power: number;
  crystals: number;
  cash: number;
  details: string;
  additionalInfo: string;
  frequency: string;
  currency: number;
  tonCurrency: number;
}

export interface Good {
  id: number;
  description: string;
  image: string;
  currency: number;
  tonCurrency: number;
  discount?: string;
}

export enum PurchaseType {
  SINGLE_PAYMENT = 'ORDER',
  SUBSCRIPTION = 'RECHARGE',
}

export interface PurchaseRequestDto {
  user: TelegramAuthData;
  purchase_type: PurchaseType;
  amount: string;
}

export interface Notification {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  handleClose?: () => void;
}

export interface AppState {
  user: {
    balances: Array<Balance>;
  };
  settings: {
    isLoading: boolean;
    notifications: Notification[];
  };
}

export enum ActionType {
  SET_LOADING = 'SET_LOADING',
  REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION',
  ADD_NOTIFICATION = 'ADD_NOTIFICATION',
  UPDATE_BALANCES = 'UPDATE_BALANCES',
}

export type Action =
  | { type: ActionType.SET_LOADING; payload: boolean }
  | { type: ActionType.REMOVE_NOTIFICATION; payload: string }
  | { type: ActionType.ADD_NOTIFICATION; payload: Omit<Notification, 'id'> }
  | { type: ActionType.UPDATE_BALANCES; payload: Balance[] };

export enum PurchaseStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CLOSE = 'CLOSE',
  TIMEOUT = 'TIMEOUT',
  FAILED = 'FAILED',
  DELAY_SUCCESS = 'DELAY_SUCCESS',
  DELAY_FAILED = 'DELAY_FAILED',
}

export interface Balance {
  currencyId: string;
  currencyName: string;
  balance: number;
}
