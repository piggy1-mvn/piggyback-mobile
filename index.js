/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import locationApp from './src/services/locationService.js'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => locationApp);
