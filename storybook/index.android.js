import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@kadira/react-native-storybook';

// import stories
configure(() => {
  require('./stories');
}, module);

const StorybookUI = getStorybookUI({ port: 7007, host: '10.0.0.90' });
AppRegistry.registerComponent('bluetoothApp', () => StorybookUI);
