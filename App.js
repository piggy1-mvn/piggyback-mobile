import React, { Component } from 'react';
import firebase from 'react-native-firebase';
//import type { Notification } from 'react-native-firebase';
import {Platform, StyleSheet, Text, View, Alert, AsyncStorage} from 'react-native';
import AppContainer from './Navigator';
import NavigationService from './src/services/NavigationService.js';

var shouldDisplay : false ;

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
            await AsyncStorage.setItem('fcmToken', fcmToken);

          }
        }

        console.log("fcm token ", fcmToken);

      }

    setNotificationData = async (data) =>{
       console.log("data ret ", data);
       let title = data.title;
       let body = data.body;
       let url = data.partner_url;
       let voucher = data.voucher_code;
       console.log ("from notification ", voucher);
       NavigationService.navigate('Notification',{ Title : title , Body : body , Coupon : voucher, urlPartner : url});

      //await AsyncStorage.setItem('display', '1');
      //let asyncdisplayval = await AsyncStorage.getItem('display');
     // console.log("asyncdisplayval ", asyncdisplayval)
      //this.setState({notifyData : data , display : true})
      //console.log("notifyData ", this.state.notifyData);


    }

    async createNotificationListeners() {
         const channel = new firebase.notifications.Android.Channel('piggy-channel', 'Piggy Channel', firebase.notifications.Android.Importance.Max)
                         .setDescription('My apps test channel');
         // Create the channel
         firebase.notifications().android.createChannel(channel);

        //Triggered when a particular notification has been received in foreground
         this.notificationListener = firebase.notifications().onNotification( (notification : Notification) =>{
           notification
                      .android.setChannelId('piggy-channel')
                      .android.setSmallIcon('ic_launcher');
          firebase.notifications().displayNotification(notification);
          firebase.notifications().removeDeliveredNotification(notification._notificationId)
          console.log("am in notificationlistener")
        }

         );

        //If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
           this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async(notificationOpen) => {
               const { data } = notificationOpen.notification;
              firebase.notifications().removeDeliveredNotification(notificationOpen.notification._notificationId)
              console.log("am here in notificationOpenedListener")
               console.log("notification data in content variable ", data)
               await this.setNotificationData(data);
               //alert(data);
           });


        //If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
          const notificationOpen = await firebase.notifications().getInitialNotification();
           if (notificationOpen) {
               const { data } = notificationOpen.notification;
               console.log("am here in notificationOpen")
                console.log("notification data in content variable ", data)
                await this.setNotificationData(data);
               //alert(data);
              // this.showAlert(data);
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
          <AppContainer
           ref={navigatorRef => {
                          NavigationService.setTopLevelNavigator(navigatorRef);
                       }}
           />
      );
    }


  //omponentDidUpdate(prevProps, prevState){
    //   console.log("in component did update")

     //}

  componentWillUnmount() {
      this.notificationListener;
      this.notificationOpenedListener;

    }
}