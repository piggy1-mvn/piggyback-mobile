/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import locationApp from './src/services/locationService.js'
import Login from './src/components/Login.js'
import {name as appName} from './app.json';

//AppRegistry.registerComponent(appName, () => locationApp);
AppRegistry.registerComponent(appName, () => Login);
