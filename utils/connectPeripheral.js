import BleManager from 'react-native-ble-manager';
import Snackbar from 'react-native-android-snackbar';

import store from '../data/reduxStore';
import { setPeripheralInfo } from '../data/reducers/peripheral';
import { setLastUsedPeripheral } from '../data/reducers/presist';


export default function connectPeripheral(peripheralId) {
  return BleManager.connect(peripheralId)
    .then((peripheralInfo) => {
      Snackbar.show('Connected');
      store.dispatch(setPeripheralInfo(peripheralInfo));
      store.dispatch(setLastUsedPeripheral(peripheralInfo));
    });
}
