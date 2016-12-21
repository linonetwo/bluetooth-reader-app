import { combineReducers } from 'redux';

import { authReducer, authInitialState } from './auth';
import { peripheralReducer, peripheralInitialState } from './peripheral';
import { viewReducer, viewInitialState } from './view';

import apolloClient from '../apolloClient';

export const rootReducer = combineReducers({
  auth: authReducer,
  peripheral: peripheralReducer,
  view: viewReducer,
  apollo: apolloClient.reducer(),
});

export function getInitialState() {
  const initState = {
    auth: authInitialState,
    peripheral: peripheralInitialState,
    view: viewInitialState,
  };
  return initState;
}
