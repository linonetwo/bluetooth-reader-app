/* @flow */
import Promise from 'bluebird';

import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BleManager from 'react-native-ble-manager';
import Snackbar from 'react-native-android-snackbar';

import { TouchableOpacity, View, Dimensions, BackAndroid, StyleSheet } from 'react-native';
import { Container, Header, Title, InputGroup, List, ListItem, Text, Input, Icon, Content, Footer, FooterTab, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { disconnectCurrentPeripheral } from '../../data/reducers/peripheral';
import { setCurrentCharacteristic } from '../../data/reducers/view';

const { width: windowWidth } = Dimensions.get('window');

const drawerStyles = {
  shadowColor: '#000',
  shadowOpacity: 0.8,
  shadowRadius: 3,
  backgroundColor: '#000',
};

const styles = StyleSheet.create({
});

function mapStateToProps(state) {
  const data = state.peripheral.getIn(['data']);
  return {
    data,
    name: data.name,
    id: data.id,
    characteristics: data.characteristics,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ disconnectCurrentPeripheral, setCurrentCharacteristic }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class PeripheralDetail extends Component {
  static contextTypes = { router: PropTypes.object };
  static propTypes = {
    disconnectCurrentPeripheral: PropTypes.func.isRequired,
    setCurrentCharacteristic: PropTypes.func.isRequired,
    name: PropTypes.string,
    id: PropTypes.string,
  };

  state = {
    showDetail: false,
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack() {
    this.context.router.transitionTo('/');
    this.props.disconnectCurrentPeripheral();
    return true;
  }

  handleSelect(info) {
    this.props.setCurrentCharacteristic(info);
    this.context.router.transitionTo('/detail');
  }

  render() {
    return (
      <Container>
        <Header style={{ width: windowWidth }}>
          <Button onPress={this.handleBack} transparent>
            <Icon name="ios-arrow-back" />
          </Button>
          <Title>{this.props.name}</Title>
          <Button onPress={() => this.setState({ showDetail: !this.state.showDetail })} transparent>
            <Icon name="md-document" />
          </Button>
        </Header>
        <Content>
          <List
            dataArray={this.props.characteristics}
            renderRow={item =>
              <ListItem onPress={() => this.handleSelect({ id: this.props.id, service: item.service, characteristic: item.characteristic })}>
                <Text >
                  service: {item.service}
                </Text>
                <Text note>
                  characteristic: {item.characteristic}
                </Text>
              </ListItem>
            }
          />

          {
            this.state.showDetail
            ? <Text style={styles.summary}>{JSON.stringify(this.props.data, null, '  ')}</Text>
            : <View />
          }
        </Content>
      </Container>
    );
  }
}
