import React, { Component } from 'react';
import { Button, View, Text, TextInput, ToastAndroid, Platform,TouchableOpacity, StyleSheet, AsyncStorage , PermissionsAndroid} from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import LocationTracker from '../services/LocationTracker.js';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import User from "../lib/apiUtils.js"
import BackgroundTimer from 'react-native-background-timer';
import Geolocation from 'react-native-geolocation-service';

export default class HomePage extends Component{
     constructor(props){
            super(props);
            console.log(this.props);
            this.state = {
            isLoading:false,
            location: {
                userId: "",
                latitude: "",
                longitude: "",
                gpsAccuracy: "",
                deviceId: ""
                  }
            }

            }


    hasLocationPermission = async () => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
          return true;
        }

        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }

        return false;
      }


    componentDidMount =  async () => {
       const hasLocationPermission = await this.hasLocationPermission();
       if (!hasLocationPermission) return;

       try {
           const deviceToken = await AsyncStorage.getItem('fcmToken');
           const userId = await AsyncStorage.getItem('user_id');

           if (userId !== null) {
               // We have data!!
              //this.setState({ userid : Number(value) });
              console.log("userid from async ", userId);
              //userId = Number(userId);
              console.log("userid convert ", userId)
              this.getLocation(userId,deviceToken);
               BackgroundTimer.runBackgroundTimer(() => {
                      //code that will be called every 5 minutes
                      this.getLocation(userId,deviceToken)
                      },
                      12000);
             } else {
               console.log('No value returned from storage');
               alert("No userid / device token found")
            }


       } catch (error) {
          console.log("unable to fetch the value")
                         // Handle errors here
        }


      }

  getLocation = async (userId,deviceToken) => {
        Geolocation.getCurrentPosition(
          (position) => {
            const location = JSON.stringify(position);
            console.log("position returned ", position);
            console.log("strigified returned ", location);
            User.location({
                      "userId":userId,
                      "latitude":position.coords.latitude,
                      "longitude":position.coords.longitude,
                      "gpsAccuracy":position.coords.accuracy,
                      "deviceId":deviceToken
                      })
          },
          (error) => {
              console.log(error);

          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0, distanceFilter: 0, forceRequestLocation: true }
        );

    }


    render() {
      return (
       <View style = {styles.container}>
          <Text style = {styles.text}>Welcome to Piggy</Text>
          <Button
             title="Set my Interests"
             onPress={() => this.props.navigation.navigate('Interests')}
          />
          <Button
            title = "Logout from Piggy"
            onPress = {this.logout}
          />

       </View>
       );
}

  logout = async () => {
    //await AsyncStorage.clear();
    await AsyncStorage.removeItem('tokenval');
    await AsyncStorage.removeItem('isLoggedIn');
    if (AccessToken.getCurrentAccessToken){
                    LoginManager.logOut();
                    }
    this.props.navigation.navigate('Login');
  }
}

const styles = StyleSheet.create({
   container : {
     padding :20,
     flex : 1,
     backgroundColor : '#ecf0f1',
     justifyContent : 'center',
     alignItems : 'stretch'
   },
   text : {
     textAlign : 'center',
     color : 'black',
     fontSize : 20
     }
})

