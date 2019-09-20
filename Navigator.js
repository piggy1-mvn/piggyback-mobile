import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { ActivityIndicator, StatusBar, AsyncStorage , StyleSheet, View } from 'react-native';
import LoginPage from './src/components/LoginPage.js'
import RegisterPage from './src/components/RegisterPage.js';
import HomePage from './src/components/HomePage.js';
import LocationTracker from './src/services/LocationTracker.js';
import Interests from './src/components/Interests.js';
import Fblogin from './src/components/Fblogin.js';
import NotificationPage from './src/components/NotificationPage.js';

const AppNavigator = createStackNavigator ({
    Home : HomePage,
    LocationTracker : LocationTracker,
    Interests : Interests,

     },
     {
       //initialRouteName: 'Home'
       }
     );

const LoginNavigator = createStackNavigator({
   Login : LoginPage,
   Register : RegisterPage
  },
   {
       initialRouteName: 'Login'
    }
 );

const NotifyNavigator = createStackNavigator({
   Notification : NotificationPage

  },
   {
       //initialRouteName: 'Login'
    }
 );


class AuthLoadingScreen extends Component {
   constructor(props) {
    super(props);
    this.loadData();
    }

    loadData = async() => {
      console.log("in authloadd")
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      this.props.navigation.navigate(isLoggedIn !== '1'? 'LoginNav' : 'AppN' )

    }

    render() {
      return(
           <View style = {styles.container}>
             <ActivityIndicator />
             <StatusBar barStyle = 'default' />
           </View>
           );
      }

}

const styles = StyleSheet.create({
   container : {
      flex : 1,
      justifyContent : 'center',
      alignItems : 'center',
    }
})

const AppswNavigator  = createSwitchNavigator({
   AuthLoading : AuthLoadingScreen,
   AppN : AppNavigator,
   LoginNav : LoginNavigator,
   Notification : NotificationPage
},
{
   initialRouteName : 'AuthLoading'
}
);

const AppContainer = createAppContainer(AppswNavigator);
export default AppContainer;