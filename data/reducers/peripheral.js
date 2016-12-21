import { Record } from 'immutable';

import BleManager from 'react-native-ble-manager';
import Snackbar from 'react-native-android-snackbar';

export function setPeripheralInfo(data) {
  return {
    type: 'SET_PERIPHERAL_INFO',
    payload: data,
  };
}

export function disconnectCurrentPeripheral(data) {
  return {
    type: 'DISCONNECT_CURRENT_PERIPHERAL',
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
      return state.setIn(['data'], action.payload);
    case 'DISCONNECT_CURRENT_PERIPHERAL':
      BleManager.disconnect(state.getIn(['data']).id)
        .then(() => {
          Snackbar.show(`Disconnected from ${state.getIn(['data']).id}`);
        })
        .catch(error => Snackbar.show(error));
      return peripheralInitialState;

    default:
      return state;
  }
}
