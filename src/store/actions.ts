import { Action, ActionType, Notification } from '../types';

export const updateLoadingState = (isLoading: boolean): Action => ({
  type: ActionType.SET_LOADING,
  payload: isLoading,
});

export const removeNotification = (id: string): Action => ({
  type: ActionType.REMOVE_NOTIFICATION,
  payload: id,
});

export const addNotification = (
  notification: Omit<Notification, 'id'>
): Action => ({
  type: ActionType.ADD_NOTIFICATION,
  payload: notification,
});
