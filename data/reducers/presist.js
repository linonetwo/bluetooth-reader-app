import { Record } from 'immutable';
import store from 'react-native-simple-store';

export function setLastUsedPeripheral(peripheralInfo) {
  return {
    type: 'SET_LAST_USED',
    payload: peripheralInfo,
  };
}


const InitialState = Record({
  info: '',
});


export const presistInitialState = new InitialState();

export function presistReducer(state = presistInitialState, action) {
  if (!(state instanceof InitialState)) return presistInitialState.mergeDeep(state);

  switch (action.type) {
    case 'SET_LAST_USED':
      store.save('PERIPHERAL', action.payload); // 先更新本地存储
      return state.setIn(['info'], action.payload); // 然后更新 Redux

    default:
      return state;
  }
}
