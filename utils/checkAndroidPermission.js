import {
  Platform,
  PermissionsAndroid,
} from 'react-native';

import Snackbar from 'react-native-android-snackbar';

export default function checkAndroidPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
    .then((checkResult) => {
      if (checkResult) {
        return true;
      }
      PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
      .then((requestResult) => {
        if (requestResult) {
          Snackbar.show('User accept');
          return true;
        }
        Snackbar.show('User refuse');
        return false;
      });
    });
  }
}
