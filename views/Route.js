/* @flow */
import { setGlobalHandler } from 'ErrorUtils'; /* eslint import/no-extraneous-dependencies: 0, import/extensions: 0 */

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  BackAndroid,
  Text,
  View,
} from 'react-native';

import { Match, MemoryRouter as Router, Miss } from 'react-router';

import { Provider, connect } from 'react-redux';

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

class BackAndroidWrapper extends Component {
  static contextTypes = { router: PropTypes.object };
  static propTypes = { children: PropTypes.node };
  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      this.context.router.transitionTo('/');
      return true;
    });
  }
  render() {
    return (
      <View>
        {this.props.children}
      </View>
    );
  }
}


export default class Route extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Provider store={reduxStore}>
          <Router>
            <BackAndroidWrapper >
              <View >
                <Match exactly pattern="/" component={() => <BluetoothSelect />} />
                <Match pattern="/detail" component={() => <PeripheralDetail />} />
                <Miss component={componentFactory('Nope, nothing here')} />
              </View>
            </BackAndroidWrapper>
          </Router>
        </Provider>
      </View>
    );
  }
}
