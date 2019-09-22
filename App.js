import React, { Component } from 'react';
import firebase from 'react-native-firebase';
//import type { Notification } from 'react-native-firebase';
import {Platform, StyleSheet, Text, View, Alert, AsyncStorage , Linking} from 'react-native';
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
       let title = data.title;
       let body = data.body;
       let url = data.partner_url;
       let voucher = data.voucher_code;
       NavigationService.navigate('Notification',{ Title : title , Body : body , Coupon : voucher, urlPartner : url});
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
          console.log("in notificationlistener")
        }

         );

        //If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
           this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async(notificationOpen) => {
              const {body,partner_url,title,voucher_code} = notificationOpen.notification._data;
              firebase.notifications().removeDeliveredNotification(notificationOpen.notification._notificationId)
                console.log("in notificationOpenedListener")
                this.showAlert(body,partner_url,title,voucher_code);

           });


        //If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
          const notificationOpen = await firebase.notifications().getInitialNotification();
           if (notificationOpen) {
               const {body,partner_url,title,voucher_code} = notificationOpen.notification._data;
               console.log("am here in notificationOpen")
               this.showAlert(body,partner_url,title,voucher_code);


           }
           /*
           * Triggered for data only payload in foreground
           * */
           this.messageListener = firebase.messaging().onMessage((message) => {
             //process data message
            console.log(JSON.stringify(message));
           });

    }

    showAlert = (body,partner_url,title,voucher_code) => {
     const titleText = `Click on our partner url ${partner_url}`
     const titleBody = `Redeem our voucher code ${voucher_code} to get RS 100/- off`

      Alert.alert(
        titleText, titleBody,
        [{
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
            { text: 'OK', onPress: () => this.loadWebViewAgreement(partner_url) },
        ],
        { cancelable: false },
      );
    }

    loadWebViewAgreement = (partner_url) => {
      return (

        Linking.canOpenURL(partner_url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + partner_url);
        } else {
          return Linking.openURL(partner_url);
        }
      })
      .catch((err) => console.error('An error occurred', err))

      )
    }



  render() {
      return (
          <AppContainer />
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