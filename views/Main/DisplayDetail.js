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

import { LineChart } from 'react-native-mp-android-chart';

import { disconnectCurrentPeripheral } from '../../data/reducers/peripheral';

const colorSwatches = ['#F44336', '#03A9F4', '#E91E63', '#9C27B0', '#00BCD4', '#673AB7', '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#607D8B', '#000000'];
const { width: windowWidth } = Dimensions.get('window');
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
  return bindActionCreators({ disconnectCurrentPeripheral }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PeripheralDetail extends Component {
  static contextTypes = { router: PropTypes.object };
  static propTypes = {
    disconnectCurrentPeripheral: PropTypes.func.isRequired,
    name: PropTypes.string,
    id: PropTypes.string,
  };

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      this.context.router.transitionTo('/');
      this.props.disconnectCurrentPeripheral();
      return true;
    });
    const channelData1 = BleManager.read(
      this.props.id,
      this.props.characteristics[8].service,
      this.props.characteristics[8].characteristic
    )
      .then((readData) => {
        console.warn(readData);
      })
      .catch((error) => {
        console.warn(JSON.stringify(error, null, '  '));
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
          <Title>{this.props.name}</Title>
        </Header>
        <Content>
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
