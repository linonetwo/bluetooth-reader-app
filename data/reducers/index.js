import { combineReducers } from 'redux';

import { presistReducer, presistInitialState } from './presist';
import { peripheralReducer, peripheralInitialState } from './peripheral';
import { viewReducer, viewInitialState } from './view';

import apolloClient from '../apolloClient';

export const rootReducer = combineReducers({
  presist: presistReducer,
  peripheral: peripheralReducer,
  view: viewReducer,
  apollo: apolloClient.reducer(),
});

export function getInitialState() {
  const initState = {
    presist: presistInitialState,
    peripheral: peripheralInitialState,
    view: viewInitialState,
  };
  return initState;
}
