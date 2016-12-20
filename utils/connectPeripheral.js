import BleManager from 'react-native-ble-manager';
import Snackbar from 'react-native-android-snackbar';

import store from '../data/reduxStore';
import { setPeripheralInfo, setPeripheralName } from '../data/reducers/peripheral';


export default function connectPeripheral(peripheralName, peripheralId, router) {
  BleManager.connect(peripheralId)
  .then((peripheralInfo) => {
    Snackbar.show('Connected');
    store.dispatch(setPeripheralInfo(peripheralInfo));
    store.dispatch(setPeripheralName(peripheralName));
    if (router) {
      router.transitionTo('/detail'); // 会导致 warn ？？？莫名其妙
    }
  })
  .catch((error) => {
    Snackbar.show(error);
    if (router) {
      router.transitionTo('/');
    }
  });
}
