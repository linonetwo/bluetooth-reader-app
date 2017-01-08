/* @flow */
import { words, takeRight } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BleManager from 'react-native-ble-manager';
import Snackbar from 'react-native-android-snackbar';

import { TouchableOpacity, View, Dimensions, BackAndroid, StyleSheet, NativeAppEventEmitter } from 'react-native';
import { Container, Header, Title, Text, InputGroup, Input, Icon, Content, Footer, FooterTab, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { LineChart } from 'react-native-mp-android-chart';

import { disconnectCurrentPeripheral } from '../../data/reducers/peripheral';

const colorSwatches = ['#F44336', '#03A9F4', '#E91E63', '#9C27B0', '#00BCD4', '#673AB7', '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#607D8B', '#000000'];
const { width: windowWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  chart: {
    height: 300,
    width: windowWidth
  }
});

function mapStateToProps(state) {
  return {
    info: state.view.getIn(['currentCharacteristic']),
  };
}

@connect(mapStateToProps)
@autobind
export default class PeripheralDetail extends Component {
  static contextTypes = { router: PropTypes.object };
  static propTypes = {
    info: PropTypes.shape({
      id: PropTypes.string,
      service: PropTypes.string,
      characteristic: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    info: {
      id: '',
      service: '',
      characteristic: '',
    }
  }

  state = {
    notifying: false,
    openLineChart: true,
    eventListener: null,
    dataCache: [
      { name: 'ACC_X_L', values: [] },
      { name: 'ACC_X_H', values: [] },
      { name: 'ACC_Y_L', values: [] },
      { name: 'ACC_Y_H', values: [] },
      { name: 'ACC_Z_L', values: [] },
      { name: 'ACC_Z_H', values: [] }
    ],
    dataCacheLimit: 30,
    lastDataUpdateTime: new Date().getTime(),
    updatePeriod: 1000, // ms
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack() {
    if (this.state.notifying === true) {
      this.state.eventListener.remove();
      BleManager.stopNotification(
        this.props.info.id,
        this.props.info.service,
        this.props.info.characteristic
      )
        .then((data) => {
          this.setState({ notifying: false });
        })
        .catch((error) => {
          this.setState({ data: JSON.stringify(error, null, '  ') });
        });
    }
    this.context.router.transitionTo('/services');
    return true;
  }

  filteDataToState({ peripheral: peripheralID, characteristic, value }) {
    if (new Date().getTime() - this.state.lastDataUpdateTime >= this.state.updatePeriod && peripheralID === this.props.info.id && characteristic === this.props.info.characteristic) {
      // push things like [ 252, 0, 146, 0, 239, 188 ]
      const datas = words(value, /\S{2}/g).map(byte => parseInt(byte, 16));
      const dataCache = ['ACC_X_L', 'ACC_X_H', 'ACC_Y_L', 'ACC_Y_H', 'ACC_Z_L', 'ACC_Z_H'].map((name, index) => ({
        name, values: [...takeRight(this.state.dataCache[index].values, this.state.dataCacheLimit), datas[index]]
      }));

      this.setState({ dataCache, lastDataUpdateTime: new Date().getTime() });
    }
  }

  notifyData() {
    if (this.state.notifying === true) {
      this.state.eventListener.remove();
      return BleManager.stopNotification(
        this.props.info.id,
        this.props.info.service,
        this.props.info.characteristic
      )
        .then((data) => {
          this.setState({ notifying: false });
        })
        .catch((error) => {
          this.setState({ data: JSON.stringify(error, null, '  ') });
        });
    }

    return BleManager.startNotification(
      this.props.info.id,
      this.props.info.service,
      this.props.info.characteristic
    )
      .then((data) => {
        this.setState({ notifying: true });
        this.setState({ eventListener: NativeAppEventEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.filteDataToState) });
      })
      .catch((error) => {
        this.setState({ data: JSON.stringify(error, null, '  ') });
      });
  }

  readData() {
    BleManager.read(
      this.props.info.id,
      this.props.info.service,
      this.props.info.characteristic
    )
      .then((data) => {
        this.setState({ data });
      })
      .catch((error) => {
        this.setState({ data: JSON.stringify(error, null, '  ') });
      });
  }


  render() {
    const lineChartData = {
      datasets: this.state.dataCache.map(({ name, values }, index) => ({
        yValues: values,
        label: name,
        config: {
          lineWidth: 3,
          drawCubic: true,
          drawCubicIntensity: 0.1,
          circleRadius: 0,
          drawHighlightIndicators: true,
          color: colorSwatches[index % colorSwatches.length],
        },
      })),
      // need to be limit + 1, or there will be a crash
      xValues: Array.from(new Array(this.state.dataCacheLimit + 1), (item, index) => index + 1).map(number => number.toString()),
    };
    return (
      <Container>
        <Header style={{ width: windowWidth }}>
          <Button onPress={this.handleBack} transparent>
            <Icon name="ios-arrow-back" />
          </Button>
          <Title>{this.props.info.characteristic}</Title>
          <Button onPress={() => this.setState({ openLineChart: !this.state.openLineChart })} transparent>
            <Icon name="md-podium" />
          </Button>
        </Header>
        <Content>
          <Text>{''}</Text>
          {
            this.state.openLineChart
              ?
                <LineChart
                  style={styles.chart}
                  data={lineChartData}
                  description={{ text: '' }}

                  drawGridBackground={false}
                  borderColor={'teal'}
                  borderWidth={1}
                  drawBorders={true}

                  keepPositionOnRotation={false}
                />
              : <View />
          }

        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={this.notifyData} transparent>
              {this.state.notifying ? '... Notifying' : 'Start Notify'}
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
