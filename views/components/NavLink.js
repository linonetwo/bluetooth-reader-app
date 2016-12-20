/* @flow */
import React, { Component, PropTypes } from 'react';

import { autobind } from 'core-decorators';

import { TouchableHighlight } from 'react-native';

export default class NavLink extends Component {
  static contextTypes = { router: PropTypes.object };
  static propTypes = {
    to: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    children: PropTypes.node,
  };

  @autobind
  pressHandler() {
    this.props.onPress();
    this.context.router.transitionTo(this.props.to);
  }

  render() {
    return (
      <TouchableHighlight onPress={this.pressHandler}>
        {this.props.children}
      </TouchableHighlight>
    );
  }
}
