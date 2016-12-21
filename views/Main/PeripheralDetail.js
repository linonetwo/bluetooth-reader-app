/* @flow */
import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BleManager from 'react-native-ble-manager';
import Snackbar from 'react-native-android-snackbar';

import { TouchableOpacity, Text, View, Dimensions, BackAndroid, StyleSheet } from 'react-native';
import { Container, Header, Title, InputGroup, Input, Icon, Content, Footer, FooterTab, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { disconnectCurrentPeripheral } from '../../data/reducers/peripheral';

const { width: windowWidth } = Dimensions.get('window');
const styles = StyleSheet.create({

});

function mapStateToProps(state) {
  return {
    name: state.peripheral.getIn(['data', 'name']),
    id: state.peripheral.getIn(['data', 'id']),
    characteristics: state.peripheral.getIn(['data', 'characteristics']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ disconnectCurrentPeripheral }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PeripheralDetail extends Component {
  static contextTypes = { router: PropTypes.object };
  static propTypes = {
    disconnectCurrentPeripheral: PropTypes.func.isRequired,
    name: PropTypes.string,
  };

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      this.context.router.transitionTo('/');
      this.props.disconnectCurrentPeripheral();
      return true;
    });
  }

  render() {
    return (
      <Container>
        <Header style={{ width: windowWidth }}>
          <Title>{this.props.name}</Title>
        </Header>
        <Content>
          <Text style={styles.summary}>
            {
              JSON.stringify(this.props.data, null, '  ')
            }
          </Text>
        </Content>
      </Container>
    );
  }
}
