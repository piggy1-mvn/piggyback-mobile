import React, { Component } from 'react';
import { Button,PermissionsAndroid,Platform,StyleSheet,Text,ToastAndroid,View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import styles from '../styles/style.js'

export default class locationApp extends Component<{}> {
  watchId = null;

  state = {
    loading: false,
    updatesEnabled: false,
    location: {}
  };

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
          console.log("Hi");
          console.log("watchid ", this.watchId);

        },
        (error) => {
          this.setState({ location: error });
          console.log(error);
        },
        { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 5000 }
      );
    });
  }

  removeLocationUpdates = () => {
      if (this.watchId !== null) {
          Geolocation.clearWatch(this.watchId);
          this.setState({ updatesEnabled: false })
          console.log("cleared");
      }
  }

  handlePress = async () => {
    console.log("in fetch call")
    fetch('http://localhost:8080/location',{
           method: 'POST',
           headers: {
              Accept: 'application/json',
                      'Content-Type': 'application/json',
              },
           body: JSON.stringify({
              userid: "simmer",
              latitude:this.state.location.coords.latitude,
              longitude:this.state.location.coords.longitude,
              gpsAccurac:this.state.location.coords.accuracy,
              deviceId:"23ADEVIEW",
              })
          }).then(response => {
                  console.log("response from server ",response)
              })
              .catch(error =>{
                  console.log(error)
              })
     }


  componentWillUpdate(newProps,newState){
   console.log("called before the render method");
   console.log("NewProps: ",newProps);
   console.log("NewState: ",newState);
  }

  render() {
    const { loading, location, updatesEnabled } = this.state;
     return (
      <View style={styles.container}>

        <Button title='Get Location' onPress={this.getLocation} disabled={loading || updatesEnabled} />
        <View style={styles.buttons}>
            <Button title='Start Observing' onPress={this.getLocationUpdates} disabled={updatesEnabled} />
            <Button title='Stop Observing' onPress={this.removeLocationUpdates} disabled={!updatesEnabled} />
        </View>

        <View style={styles.result}>
            <Text>{JSON.stringify(location, null, 4)}</Text>
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


