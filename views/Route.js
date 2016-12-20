/* @flow */
import { setGlobalHandler } from 'ErrorUtils'; /* eslint import/no-extraneous-dependencies: 0, import/extensions: 0 */

import React, { Component } from 'react';
import {
  StyleSheet,
  BackAndroid,
  Text,
  View,
} from 'react-native';

import { Match, MemoryRouter as Router, Miss } from 'react-router';

import { connect } from 'react-redux';

import { ApolloProvider } from 'react-apollo';

import Icon from 'react-native-vector-icons/FontAwesome';

import apolloClient from '../data/apolloClient';
import reduxStore from '../data/reduxStore';

import NavLink from './components/NavLink';
import BluetoothSelect from './Main/BluetoothSelect';
import PeripheralDetail from './Main/PeripheralDetail';

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

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => true);
  }

  render() {
    return (
      <Router>
        <View style={styles.container}>
          <View style={styles.routeContainer}>
            <Match exactly pattern="/" component={() => <BluetoothSelect />} />
            <Match pattern="/detail" component={() => <PeripheralDetail />} />
            <Miss component={componentFactory('Nope, nothing here')} />
          </View>
        </View>
      </Router>
    );
  }
}
