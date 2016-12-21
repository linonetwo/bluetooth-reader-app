/* @flow */
import { setGlobalHandler } from 'ErrorUtils'; /* eslint import/no-extraneous-dependencies: 0, import/extensions: 0 */

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Match, MemoryRouter as Router, Miss } from 'react-router';

import { Provider, connect } from 'react-redux';

import reduxStore from '../data/reduxStore';

import NavLink from './components/NavLink';
import BluetoothSelect from './Main/BluetoothSelect';
import PeripheralServices from './Main/PeripheralServices';
import DisplayDetail from './Main/DisplayDetail';

// 防止闪退
setGlobalHandler((err) => console.warn(err)); // eslint-disable-line

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
  },
  route: {
    color: '#701010',
    fontSize: 40
  },
  routeLink: {
    color: '#0000FF'
  },
  routeContainer: {
    flex: 1,
    justifyContent: 'center'
  }
});


const componentFactory = (routeName: string) => () => (
  <View>
    <Text style={styles.route}>{routeName}</Text>
  </View>
);


export default class Route extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Provider store={reduxStore}>
          <Router>
            <View>
              <Match exactly pattern="/" component={() => <BluetoothSelect />} />
              <Match pattern="/services" component={() => <PeripheralServices />} />
              <Match pattern="/detail" component={() => <DisplayDetail />} />
              <Miss component={componentFactory('Nope, nothing here')} />
            </View>
          </Router>
        </Provider>
      </View>
    );
  }
}
