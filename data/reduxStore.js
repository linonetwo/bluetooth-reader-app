import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import devTools from 'remote-redux-devtools';

import apolloClient from './apolloClient';

import { rootReducer, getInitialState } from './reducers';

import { authInitialState } from './reducers/auth';


function configureStore(initialState) {
  const enhancer = compose(
  //   devTools({
  //     name: 'Power51', realtime: true, hostname: 'localhost', port: 5678,
  //   }),
    applyMiddleware(thunk, apolloClient.middleware())
  );

  const store = createStore(rootReducer, initialState, enhancer);
  // devTools.updateStore(store);

  return store;
}

const store = configureStore(getInitialState());

export default store;
