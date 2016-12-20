/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Route from './views/Route';

export default class PoselevelApp extends Component {
  render() {
    return (
      <Route />
    );
  }
}

AppRegistry.registerComponent('bluetoothApp', () => PoselevelApp);
