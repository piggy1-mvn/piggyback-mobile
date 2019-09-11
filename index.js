/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import locationApp from './src/services/locationService.js'
import Fblogin from './src/components/Fblogin.js'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);