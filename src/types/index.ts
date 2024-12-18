import { TelegramAuthData } from '@telegram-auth/react';
import { ReactElement } from 'react';

export interface GenericProps {
  children?: ReactElement | ReactElement[] | string;
}

export interface Subscription {
  id: number;
  xploit: number;
  chip: number;
  items: number;
  details: string;
  additionalInfo: string;
  currency: number;
  tonCurrency: number;
  frequency: FrequencyType;
}

export type FrequencyType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

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
  purchaseId: number;
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
  INIT = 'INIT',
  PROCESSING = 'PROCESSING',
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

export enum Browser {
  CHROME = 'CHROME',
  SAFARI = 'SAFARI',
  FIREFOX = 'FIREFOX',
  EDGE = 'EDGE',
  OPERA = 'OPERA',
  INTERNET_EXPLORER = 'INTERNET_EXPLORER',
  UNKNOWN_BROWSER = 'UNKNOWN_BROWSER',
}

export interface PaymentConfirmationDto {
  paymentUrl: string;
  amount: string;
  date: string; // Date
  purchaseStatus: PurchaseStatus;
}
