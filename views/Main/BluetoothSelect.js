import { filter } from 'lodash';
import { autobind } from 'core-decorators';

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Dimensions,
  NativeAppEventEmitter,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

import { Container, Header, Title, InputGroup, Input, Icon, Content, Footer, FooterTab, Button } from 'native-base';

import { Buffer } from 'buffer';

import { Col, Row, Grid } from 'react-native-easy-grid';
import Snackbar from 'react-native-android-snackbar';

import NavLink from '../components/NavLink';
import { ListItem } from '../components/List';

import checkAndroidPermission from '../../utils/checkAndroidPermission';
import connectPeripheral from '../../utils/connectPeripheral';

global.Buffer = Buffer;

const { width: windowWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default class BluetoothSelect extends Component {
  static contextTypes = { router: PropTypes.object };

  state = {
    discovering: false,
    devices: [],
    filter: '',
  }

  componentDidMount() {
    checkAndroidPermission();

    BleManager.start({ showAlert: false });

    NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
  }

  @autobind
  discoverUnpaired() {
    const scanTimeSecond = 30;
    if (this.state.discovering) {
      return false;
    }
    this.setState({ discovering: true });
    BleManager.scan([], scanTimeSecond, true)
    .then(() => {
      setTimeout(() => this.setState({ discovering: false }), scanTimeSecond * 1000);
    });
  }

  @autobind
  handleDiscoverPeripheral(data) {
    const knownDevices = this.state.devices;
    const deviceIds = knownDevices.map(d => d.id);
    if (data) {
      if (deviceIds.indexOf(data.id) < 0) {
        knownDevices.push(data);
      }
    }
    this.setState({ devices: knownDevices });
  }

  @autobind
  testName(name, id) {
    // 略过默认情况避免开销
    if (this.state.filter === '') {
      return true;
    }
    const deviceFilter = new RegExp(this.state.filter);
    let matchesFilter = false;
    // 名字可能为空，只在有名的情况下进行过滤
    if (name) {
      matchesFilter = deviceFilter.test(name.toUpperCase());
    }
    matchesFilter = matchesFilter || deviceFilter.test(id.toUpperCase());
    return matchesFilter;
  }

  render() {
    return (
      <Container>
        <Header searchBar style={{ width: windowWidth }}>
          <InputGroup>
            <Icon name="ios-search" />
            <Input placeholder="Filter" value={this.state.filter} onChangeText={text => this.setState({ filter: text.toUpperCase() })} />
            <Icon name="md-bluetooth" />
          </InputGroup>
          <Button transparent>
            Filter
          </Button>
        </Header>
        <Content>
          <Text style={{ alignSelf: 'center' }}>Bluetooth devices</Text>
          <View style={styles.listContainer}>
            {filter(this.state.devices, item => this.testName(item.name, item.id)).map((device, index) => (
              <ListItem
                key={`${device.id}_${index}`}
                onPress={() => { connectPeripheral(device.id); this.context.router.transitionTo('/detail'); }}
                summary={device.name}
                description={device.id}
              />
              ))}
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={this.discoverUnpaired} transparent>
              {this.state.discovering ? '... Discovering' : 'Discover devices'}
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
