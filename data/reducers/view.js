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

const InitialState = Record({
  loading: false,
});


export const viewInitialState = new InitialState();

export function viewReducer(state = viewInitialState, action) {
  if (!(state instanceof InitialState)) return viewInitialState.mergeDeep(state);

  switch (action.type) {
    case 'SET_LOADING':
      return state.setIn(['loading'], true);
    case 'SET_NOT_LOADING':
      return state.setIn(['loading'], false);

    default:
      return state;
  }
}
