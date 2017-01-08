/* @flow */
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
    data: '',
    openLineChart: false,
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack() {
    this.context.router.transitionTo('/services');
    return true;
  }

  subscriptData() {
    BleManager.startNotification(
      this.props.info.id,
      this.props.info.service,
      this.props.info.characteristic
    )
      .then((data) => {
        this.setState({ data: 'startNotification' });
      })
      .catch((error) => {
        this.setState({ data: JSON.stringify(error, null, '  ') });
      });

    NativeAppEventEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', ({ peripheral: peripheralID, characteristic, value }) => {
      if (peripheralID === this.props.info.id && characteristic === this.props.info.characteristic) {
        this.setState({ data: value });
      }
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
      datasets: [].map(({ source, lineChart }, index) => ({
        yValues: lineChart.map(({ value }) => Number(value)),
        label: source,
        config: {
          lineWidth: 3,
          drawCubic: true,
          drawCubicIntensity: 0.1,
          circleRadius: 0,
          drawHighlightIndicators: true,
          color: colorSwatches[index % colorSwatches.length],
        },
      })),
      xValues: [],
    };
    return (
      <Container>
        <Header style={{ width: windowWidth }}>
          <Button onPress={this.handleBack} transparent>
            <Icon name="ios-arrow-back" />
          </Button>
          <Title>{this.props.info.characteristic}</Title>
        </Header>
        <Content>
          <Text>{this.state.data}</Text>
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
            <Button onPress={this.subscriptData} transparent>
              Subscript Data
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
