import { useContext } from 'react';
import { DispatchContext } from './context';
import { Action } from '../types';

export function useDispatch() {
  const innerDispatch = useContext(DispatchContext);

  const dispatch = (action: Action) => {
    innerDispatch(action);
  };

  return { dispatch };
}
