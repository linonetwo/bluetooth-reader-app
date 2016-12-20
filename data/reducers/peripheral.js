import { Record } from 'immutable';


export function setPeripheralInfo(data) {
  return {
    type: 'SET_PERIPHERAL_INFO',
    payload: data,
  };
}


const InitialState = Record({
  data: null,
});


export const peripheralInitialState = new InitialState();

export function peripheralReducer(state = peripheralInitialState, action) {
  if (!(state instanceof InitialState)) return peripheralInitialState.mergeDeep(state);

  switch (action.type) {
    case 'SET_PERIPHERAL_INFO':
      return state.setIn(['data'], action.payload); // 然后更新 Redux

    default:
      return state;
  }
}
