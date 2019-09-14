import React, { Component } from 'react';
import { Button,PermissionsAndroid,Platform,StyleSheet,Text,ToastAndroid,View,AsyncStorage} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import styles from '../styles/style.js';

var value;

export default class LocationTracker extends Component<{}> {
  watchId = null;

  state = {
    userid : "",
    loading: false,
    updatesEnabled: false,
    location: {}
  };

  getItemAs = async (item) => {
      try {
        console.log("passed item : ", item)
        const value = await AsyncStorage.getItem(item);
        console.log("hanged user ddi ", value);
        return value;
      } catch (error) {
        console.log("unabl to fetch the value")
        // Handle errors here
      }
  }

  async componentDidMount(){
     //value = await this.getItemAs('user_id');
     console.log(" am inside didmount  ")
    try {
                // console.log("passed item : ", item)
                 const value = await AsyncStorage.getItem('user_id');
                 if (value !== null) {
                     // We have data!!
                     console.log("value updated in mount  ", value)
                     this.setState({ userid : Number(value) });
                   } else {
                     console.log('No value returned from storage');
                   }

               } catch (error) {
                 console.log("unabl to fetch the value")
                 // Handle errors here
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


  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({ location: position, loading: false });
          console.log(position);
        },
        (error) => {
          this.setState({ location: error, loading: false });
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
      );
    });
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

  removeLocationUpdates = () => {
      if (this.watchId !== null) {
          Geolocation.clearWatch(this.watchId);
          Geolocation.stopObserving();
          this.setState({ updatesEnabled: false })
          console.log("cleared");
      }
  }

  handlePress = async () => {
    console.log("usr from async ", this.state.userid);
    console.log("in fetch call")
    fetch('http://192.168.43.102:8080/location',{
           method: 'POST',
           headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              },
           body: JSON.stringify({
             "userId": this.state.userid,
             "latitude":this.state.location.coords.latitude,
             "longitude":this.state.location.coords.longitude,
             "gpsAccuracy":this.state.location.coords.accuracy,
             "deviceId":"23ADEVIEW"
              })
          }).then(response => {
                  console.log("response from server ",response)
              })
              .catch(error =>{
                  console.log("response failed to server",error)
              })
     }


  componentWillUpdate(newProps,newState){
   console.log("NewProps: ",newProps);
   console.log("NewState: ",newState);
  }

  componentWillUnmount(){
     this.removeLocationUpdates();
     console.log("location updates stopped");
    }

  render() {
    const { loading, location, updatesEnabled } = this.state;
     return (
      <View style={styles.container}>
        <View style={styles.buttons}>
            <Button title='Allow Location Tracking' onPress={this.getLocationUpdates} />
        </View>
      </View>
    );
  }


  componentDidUpdate(prevProps, prevState){
     console.log("i was caledde");
     if (
       prevState.location !== this.state.location
       ) {
          console.log("location changed");
          this.handlePress();
     }
   }
}


