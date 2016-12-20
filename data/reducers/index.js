import { combineReducers } from 'redux';

import { authReducer, authInitialState } from './auth';
import { peripheralReducer, peripheralInitialState } from './peripheral';

import apolloClient from '../apolloClient';

export const rootReducer = combineReducers({
  auth: authReducer,
  peripheral: peripheralReducer,
  apollo: apolloClient.reducer(),
});

export function getInitialState() {
  const initState = {
    auth: authInitialState,
    peripheral: peripheralInitialState,
  };
  return initState;
}
