/* @flow */
import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import BleManager from 'react-native-ble-manager';
import Snackbar from 'react-native-android-snackbar';

import { TouchableOpacity, Text, View, Dimensions, BackAndroid, StyleSheet } from 'react-native';
import { Container, Header, Title, InputGroup, Input, Icon, Content, Footer, FooterTab, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

const { width: windowWidth } = Dimensions.get('window');
const styles = StyleSheet.create({

});

function mapStateToProps(state) {
  return {
    name: state.peripheral.getIn(['data', 'name']),
    id: state.peripheral.getIn(['data', 'id']),
    data: state.peripheral.getIn(['data']),
  };
}

@connect(mapStateToProps)
export default class PeripheralDetail extends Component {
  static contextTypes = { router: PropTypes.object };
  static propTypes = {
    name: PropTypes.string
  };

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      this.context.router.transitionTo('/');
      this.disconnect();
      return true;
    });
  }

  @autobind
  disconnect() {
    Snackbar.show(`Disconnecting from ${this.props.id}`); // 无法取得 id ？？？
    BleManager.disconnect(this.props.id)
      .then(() => {
        Snackbar.show(`Disconnected from ${this.props.id}`);
      })
      .catch((error) => {
        console.warn(error);
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
