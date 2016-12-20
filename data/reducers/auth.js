import { Record } from 'immutable';
import store from 'react-native-simple-store';

const SET_TOKEN = 'SET_TOKEN';

export function setToken(token: string) {
  return {
    type: SET_TOKEN,
    payload: token,
  };
}


const InitialState = Record({
  token: null,
});


export const authInitialState = new InitialState();

export function authReducer(state = authInitialState, action) {
  if (!(state instanceof InitialState)) return authInitialState.mergeDeep(state);

  switch (action.type) {
    case SET_TOKEN:
      store.save('TOKEN', action.payload); // 先更新本地存储
      return state.setIn(['token'], action.payload); // 然后更新 Redux

    default:
      return state;
  }
}
