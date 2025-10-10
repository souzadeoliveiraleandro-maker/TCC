/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import Feed from './src/screens/Feed';
import Navigator from './src/Navigator'
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Feed);
