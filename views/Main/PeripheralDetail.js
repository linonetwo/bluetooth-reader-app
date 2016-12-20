/* @flow */
import React, { Component, PropTypes } from 'react';

import { autobind } from 'core-decorators';

import { TouchableOpacity, Text, View, Dimensions, StyleSheet } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

const { width: windowWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: 100,
    width: windowWidth,

    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
  },
  summaryCol: {
    flexDirection: 'column-reverse',
  },
  summary: {
    textAlign: 'right',
    fontSize: 40,
    fontWeight: '900',
  },
  descriptionCol: {
  },
  description: {
    fontSize: 25,
  }
});

export default class PeripheralDetail extends Component {
  static propTypes = {
    // touch
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    // display
    summary: PropTypes.string,
    description: PropTypes.string,
  };

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.disabled ? () => {} : this.props.onPress}>
        <Grid >
          <Col size={1} style={styles.summaryCol}>
            <Text style={styles.summary} numberOfLines={2}>
              {this.props.summary}
            </Text>
          </Col>
          <Col size={2} style={styles.descriptionCol}>
            <Text style={styles.description} numberOfLines={3}>
              {this.props.description}
            </Text>
          </Col>
        </Grid>
      </TouchableOpacity>
    );
  }
}
