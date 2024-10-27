import { FC, ReactNode, useReducer } from 'react';
import { AppContext, DispatchContext, initialState } from './context';
import { reducer } from './reducer';

export const AppStore: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <AppContext.Provider value={state}>{children}</AppContext.Provider>
    </DispatchContext.Provider>
  );
};
