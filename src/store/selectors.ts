import { useContext } from 'react';
import { AppContext } from './context';

export function useAppStateSelectors() {
  const state = useContext(AppContext);

  const isAppLoading = state.settings.isLoading;
  const notifications = state.settings.notifications;
  const balances = state.user.balances;

  return {
    isAppLoading,
    notifications,
    balances,
  };
}
