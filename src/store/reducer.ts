import { Reducer } from 'react';
import { v4 } from 'uuid';
import { Action, ActionType, AppState } from '../types';

export const reducer: Reducer<AppState, Action> = (state, action): AppState => {
  switch (action.type) {
    case ActionType.SET_LOADING: {
      return {
        ...state,
        settings: { ...state.settings, isLoading: action.payload },
      };
    }
    case ActionType.REMOVE_NOTIFICATION: {
      const notifications = state.settings.notifications.filter(
        (n) => n.id !== action.payload
      );
      return {
        ...state,
        settings: { ...state.settings, notifications },
      };
    }
    case ActionType.ADD_NOTIFICATION: {
      const notifications = [
        ...state.settings.notifications,
        { id: v4(), ...action.payload },
      ];
      return {
        ...state,
        settings: { ...state.settings, notifications },
      };
    }
    default: {
      return state;
    }
  }
};
