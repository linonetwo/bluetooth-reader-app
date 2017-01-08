import Promise from 'bluebird';
import { filter } from 'lodash';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Dimensions,
  NativeAppEventEmitter,
  BackAndroid,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

import store from 'react-native-simple-store';

import { Container, Header, Title, InputGroup, Input, Icon, Content, Footer, FooterTab, Button } from 'native-base';

import { Buffer } from 'buffer';

import { Col, Row, Grid } from 'react-native-easy-grid';
import Snackbar from 'react-native-android-snackbar';

import NavLink from '../components/NavLink';
import { ListItem } from '../components/List';

import checkAndroidPermission from '../../utils/checkAndroidPermission';
import connectPeripheral from '../../utils/connectPeripheral';

import { setLoading, setNotLoading } from '../../data/reducers/view';

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

function mapStateToProps(state) {
  return {
    loading: state.view.getIn(['loading']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setLoading, setNotLoading }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class BluetoothSelect extends Component {
  static contextTypes = { router: PropTypes.object };
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    setNotLoading: PropTypes.func.isRequired,
  };

  state = {
    discovering: false,
    devices: [],
    filter: '',
    scanTimeSecond: 30,
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => false);
    checkAndroidPermission();
    BleManager.start({ showAlert: false });
    NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
    store.get('PERIPHERAL')
      .then(peripheralInfo => peripheralInfo ? this.setState({ devices: [peripheralInfo] }) : null);
  }

  discoverUnpaired() {
    if (this.state.discovering) {
      return BleManager.stopScan()
      .then(() => {
        this.setState({ discovering: false });
      });
    }

    BleManager.scan([], this.state.scanTimeSecond, true)
      .then(() => {
        this.setState({ discovering: true });
      });
  }

  stopDiscoveringAndJump() {
    return Promise.try(() => {
      this.setState({ discovering: false });
    })
    .then(BleManager.stopScan)
    .then(() =>
      Promise.delay(100) // 避免 update unmounted 的组件
    )
    .then(() => {
      this.props.setNotLoading();
      this.context.router.transitionTo('/services');
    });
  }

  handleDiscoverPeripheral(data) {
    if (!this.state.discovering) {
      return;
    }
    const knownDevices = this.state.devices;
    const deviceIds = knownDevices.map(d => d.id);
    if (data) {
      if (deviceIds.indexOf(data.id) < 0) {
        knownDevices.push(data);
      }
    }
    this.setState({ devices: knownDevices });
  }

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
            <Input
              placeholder={this.state.devices.length > 2 ? `Filter ${this.state.devices.length} peripherals` : ''}
              value={this.state.filter}
              onChangeText={text => this.setState({ filter: text.toUpperCase() })}
            />
            <Icon name="md-bluetooth" />
          </InputGroup>
          <Button transparent>
            Filter
          </Button>
        </Header>
        <Content>
          <RefreshControl
            refreshing={this.props.loading}
            colors={['#ff0000', '#00ff00', '#0000ff', '#123456']}
            progressBackgroundColor={'#ffffff'}
          >
            <Text style={{ alignSelf: 'center' }}>Bluetooth devices</Text>
            <View style={styles.listContainer}>
              {filter(this.state.devices, item => this.testName(item.name, item.id)).map((device, index) => (
                <ListItem
                  key={`${device.id}_${index}`}
                  onPress={() => Promise.try(this.props.setLoading)
                    .then(() => connectPeripheral(device.id))
                    .then(this.stopDiscoveringAndJump)
                    .catch((error) => { this.props.setNotLoading(); Snackbar.show(error); })
                  }
                  disabled={this.props.loading}
                  summary={device.name}
                  description={device.id}
                />
                ))}
            </View>
          </RefreshControl>
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
