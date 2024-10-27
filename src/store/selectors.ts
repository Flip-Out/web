import { useContext } from 'react';
import { AppContext } from './context';

export function useAppStateSelectors() {
  const state = useContext(AppContext);

  const isAppLoading = state.settings.isLoading;
  const notifications = state.settings.notifications;

  return {
    isAppLoading,
    notifications,
  };
}
