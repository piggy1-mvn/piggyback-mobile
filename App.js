import React, { Component } from 'react';
import firebase from 'react-native-firebase';
//import type { Notification } from 'react-native-firebase';
import {Platform, StyleSheet, Text, View, Alert, AsyncStorage} from 'react-native';
import AppContainer from './Navigator';

export default class App extends Component {


  async componentDidMount(){
    this.checkPermission();
    this.createNotificationListeners();

  }

  async checkPermission() {
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
        this.getToken();
      } else {
        this.requestPermission();
      }
    }

    async requestPermission() {
        try {
          await firebase.messaging().requestPermission();
          // User has authorised
          this.getToken();
        } catch (error) {
          // User has rejected permissions
          console.log('permission rejected');
        }
      }

    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
          fcmToken = await firebase.messaging().getToken();
          if (fcmToken) {
            // user has a device token
            console.log('fcmToken:', fcmToken);
            await AsyncStorage.setItem('fcmToken', fcmToken);
          }
        }

      }

    async createNotificationListeners() {

         const channel = new firebase.notifications.Android.Channel('piggy-channel', 'Piggy Channel', firebase.notifications.Android.Importance.Max)
                         .setDescription('My apps test channel');

         // Create the channel
         firebase.notifications().android.createChannel(channel);

        /*

        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification( (notification : Notification) =>{
          notification
                      .android.setChannelId('piggy-channel')
                      .android.setSmallIcon('ic_launcher');
          firebase.notifications().displayNotification(notification);
          firebase.notifications().removeDeliveredNotification(notification._notificationId)
        }

         );

         /*
           * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
           * */
           this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
               const { title, body } = notificationOpen.notification;
              firebase.notifications().removeDeliveredNotification(notificationOpen.notification._notificationId)
               this.showAlert(title, body);
           });

         /*
           * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
           * */
           const notificationOpen = await firebase.notifications().getInitialNotification();
           if (notificationOpen) {
               const { title, body } = notificationOpen.notification;
               this.showAlert(title, body);
           }
           /*
           * Triggered for data only payload in foreground
           * */
           this.messageListener = firebase.messaging().onMessage((message) => {
             //process data message
            console.log(JSON.stringify(message));
           });

    }

    showAlert(title, body) {
      Alert.alert(
        title, body,
        [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    }


  render() {
    return (
        <AppContainer />
    );
  }

  componentWillUnmount() {
      this.notificationListener;
      this.notificationOpenedListener;

    }
}