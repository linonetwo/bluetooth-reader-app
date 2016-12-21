import { Record } from 'immutable';

export function setLoading() {
  return {
    type: 'SET_LOADING'
  };
}

export function setNotLoading() {
  return {
    type: 'SET_NOT_LOADING'
  };
}

export function setCurrentCharacteristic(info) {
  return {
    type: 'SET_CURRENT_CHARACTERISTIC',
    payload: info,
  };
}

const InitialState = Record({
  loading: false,
  currentCharacteristic: null,
});


export const viewInitialState = new InitialState();

export function viewReducer(state = viewInitialState, action) {
  if (!(state instanceof InitialState)) return viewInitialState.mergeDeep(state);

  switch (action.type) {
    case 'SET_LOADING':
      return state.setIn(['loading'], true);
    case 'SET_NOT_LOADING':
      return state.setIn(['loading'], false);
    case 'SET_CURRENT_CHARACTERISTIC':
      return state.setIn(['currentCharacteristic'], action.payload);

    default:
      return state;
  }
}
