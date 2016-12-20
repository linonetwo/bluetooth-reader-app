import React from 'react';
import { Text, View } from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

import { ListItem } from '../../views/components/List';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')} />
  ));

storiesOf('Button', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with text', () => (
    <Button onPress={action('clicked-text')}>
      <Text>Hello Button</Text>
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onPress={action('clicked-emoji')}>
      <Text>😀 😎 👍 💯</Text>
    </Button>
  ));

storiesOf('List', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .addDecorator(withKnobs)
  .add('with summary and description AND disablability', () => (
    <ListItem disabled={boolean('Disabled', false)} summary={'概况'} description={'絮絮叨叨的详细说明信息'} onPress={action('clicked-ListItem')} />
  ))
  .add('with longer summary', () => (
    <ListItem summary={'长一点的概况'} description={'絮絮叨叨的详细说明信息'} onPress={action('clicked-ListItem')} />
  ))
  .add('with long texts that exceed it', () => (
    <ListItem
      summary={'长长长一点的概况'}
      description={'絮絮叨叨的详细说明信息实在是太罗嗦了因为超爱打字所以超出了能显示的最大范围'}
      onPress={action('clicked-ListItem')}
    />
  ))
  .add('two ListItems together', () => (
    <View>
      <ListItem summary={'概况'} description={'絮絮叨叨的详细说明信息'} onPress={action('clicked-ListItem')} />
      <ListItem summary={'长一点的概况'} description={'絮絮叨叨的详细说明信息'} onPress={action('clicked-ListItem')} />
      <ListItem
        summary={'长长长一点的概况'}
        description={'絮絮叨叨的详细说明信息实在是太罗嗦了因为超爱打字所以超出了能显示的最大范围'}
        onPress={action('clicked-ListItem')}
      />
    </View>
  ));
