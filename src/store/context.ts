import React, { createContext } from 'react';
import { Action, AppState } from '../types';

export const initialState: AppState = {
  user: {
    balances: [],
  },
  settings: {
    isLoading: false,
    notifications: [],
  },
};

export const AppContext = createContext<AppState>(initialState);
export const DispatchContext = createContext<React.Dispatch<Action>>(() => {});
