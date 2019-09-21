import React, { Component } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, AsyncStorage , PermissionsAndroid , Platform, ToastAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import * as config from "../config/Config.js"
//import newUser from './user.js';
//import LocationTracker from '../services/LocationTracker.js';
//import { createStackNavigator, createAppContainer } from 'react-navigation';

var deviceToken : ""
var userId : ""
const baseUrl = config.baseUrlLocationApi;
console.log("location baseurl : ", baseUrl);

export default class HomePage extends Component{
     watchId = null;
     constructor(props){
            super(props);
            console.log(this.props);
            state = {
                //userid : "",
                loading: false,
                updatesEnabled: false,
                location: {//coords:{
                           //longitude : '103.769'}
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
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
    }

  async componentDidMount() {
     try {
        deviceToken = await AsyncStorage.getItem('fcmToken');
        userId = await AsyncStorage.getItem('user_id');
        console.log("user id from asycn ", userId)

        if (userId !== "") {
            // We have data!!
            console.log("userid got ", userId)
            //this.setState({ userid : Number(userId) });
            //if (this.state.userid !== ""){
                  this.getLocationUpdates();
                  //}
          } else {
            console.log('No value returned from storage');
            throw new Error('UserDetails cannot be found');
          }

      } catch (error) {
        console.log("unable to fetch the value")
        alert(error)
        // Handle errors here
      }

  }

  getLocationUpdates = async () => {
      const hasLocationPermission = await this.hasLocationPermission();
      if (!hasLocationPermission) return;
      this.setState({ updatesEnabled: true }, () => {
        this.watchId = Geolocation.watchPosition(
          (position) => {
            this.setState({ location: position });
            console.log("current position ",this.state.location);
           },
          (error) => {
            this.setState({ location: error });
            console.log(error);
          },
          { enableHighAccuracy: true, distanceFilter: 0, interval: 15000, fastestInterval: 15000 }
        );
      });
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

handlePress = async () => {
    console.log("handlepress ", deviceToken)
    console.log("stringified device id ", JSON.stringify(deviceToken))
    console.log("userid in handlepress ", userId)
    fetch(`${baseUrl}`,{
           method: 'POST',
           headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              },
           body: JSON.stringify({
             "userId": userId,
             "latitude":this.state.location.coords.latitude,
             "longitude":this.state.location.coords.longitude,
             "gpsAccuracy":this.state.location.coords.accuracy,
             "deviceId":deviceToken
              })
          }).then(response => {
                  console.log("response from server ",response)
              })
              .catch(error =>{
                  console.log("response failed to server",error)
              })
     }

componentDidUpdate(prevProps, prevState){
        this.handlePress();

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

  removeLocationUpdates = () => {
    if (this.watchId !== null) {
        Geolocation.clearWatch(this.watchId);
        Geolocation.stopObserving();
        this.setState({ updatesEnabled: false })
        console.log("cleared");
    }
}

  componentWillUnmount() {
        console.log("unmounted homee");
        this.removeLocationUpdates();
        console.log("location updates stopped");

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

