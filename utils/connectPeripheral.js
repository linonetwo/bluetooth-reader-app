import BleManager from 'react-native-ble-manager';
import Snackbar from 'react-native-android-snackbar';

import store from '../data/reduxStore';
import { setPeripheralInfo } from './../data/reducers/peripheral';

export default function connectPeripheral(peripheralId) {
  BleManager.connect(peripheralId)
  .then((peripheralInfo) => {
    Snackbar.show('Connected');
    store.dispatch(setPeripheralInfo(peripheralInfo));
  })
  .catch((error) => {
    Snackbar.show(error);
  });
}
