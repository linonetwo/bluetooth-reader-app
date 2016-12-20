/* @flow */
import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { TouchableOpacity, Text, View, Dimensions, StyleSheet } from 'react-native';
import { Container, Header, Title, InputGroup, Input, Icon, Content, Footer, FooterTab, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

const { width: windowWidth } = Dimensions.get('window');
const styles = StyleSheet.create({

});

function mapStateToProps(state) {
  return {
    name: state.peripheral.getIn(['name']),
    data: state.peripheral.getIn(['data']),
  };
}

@connect(mapStateToProps)
export default class PeripheralDetail extends Component {
  static propTypes = {
    name: PropTypes.string
  };

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
