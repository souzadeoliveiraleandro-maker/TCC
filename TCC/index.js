/**
 * @format
 */
// Geralmente no App.js ou index.js
import 'react-native-gesture-handler'; // Se estiver usando react-navigation
import { enableScreens } from 'react-native-screens';

// CHAME A FUNÇÃO AQUI
enableScreens();
import { AppRegistry } from 'react-native';
import App from './App';
import Feed from './src/screens/Feed';
import Navigator from './src/screens/Navigator';
import Login from './src/screens/login';

import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Login);
