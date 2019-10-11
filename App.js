import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {Platform, StyleSheet, Text, View, Alert, AsyncStorage , Linking, Button} from 'react-native';
import AppContainer from './Navigator';
import NavigationService from './src/services/NavigationService.js';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import {RSA} from 'react-native-rsa-native';
import UserService from "./src/lib/apiUtils.js";
import CryptoJS  from "crypto-js";


export default class App extends Component {

  async componentDidMount(){
    this.checkPermission();
    this.createNotificationListeners();
    this.generateKeys();

  }

 async generateKeys(){
    console.log('generateKeys4096Demo')
       try{
          let checkKey = await RNSecureKeyStore.get("RSAprivate");
    	  console.log("key exists ", checkKey);

       } catch(error){
          console.log("errored out in generte keys", error)
          const keys = await RSA.generateKeys(4096);
          console.log('4096 private:', keys.private) // the private key
          RNSecureKeyStore.set("RSAprivate", keys.private, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})
          RNSecureKeyStore.set("RSApublic", keys.public, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})
          console.log('4096 public:', keys.public) // the public key
       }

    //RNSecureKeyStore.set("RSAprivate", "-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----\n", {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})
    //RNSecureKeyStore.set("RSApublic", "-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEAvR7kxLTgSDjMXy5/ZCTaAvIbaXJ9DJFMvDJtpWyuwi71Va1Nebmg\nMue226VwnRm0nob7KdrhrFfo1eYYoPdCAKq5d1NNBY1Owtjguk0uBqEL+EtmomVD\nyoRkOQjDMHRiP1w/8eFy4A+T6NeHduojduVdDgd2oaH+kneckmHleW5tJuaxSL2W\nohzFdpzNdVLKeSsd1XA4cTxmrjxz/Boj1wyjxVLU+/vQHrmWpbbtv4cYzirkos1R\nOggk6UcS8IY1jowdzA3XNNS8sto+cHDo9N6ByWOIMlpqb+OrGsNzhx9W5kBV/hUq\n8WUhAcXQldy+GU1qvCWWxm/9M+TkGmJLMv3nSpne9KB7IOrbtI+FhgVfU2Af22VY\ncdvYqZeZs2IcmYKx6mWHGAa+thyAVZrcWSqsKNbJr6l4OUjgge/aWBhw3zidnnYQ\ngbXMtTAUUgbVaTYvXByZDZ43fH67116cEPzf+lo12zxHY+IJFSuoZRu1kIgfgkIf\nT3h1+XKNkJ9EvWNLWkkfZZsCO9RVnU32i3c4TbJxV9uh8YE0q6FcYiZPG4tJsftF\n8VC6EQ0XnvuCgB3yl9LVbHsbMRmWf9slxBUyZ6jB/5hRLKmbnp/s6pI5I0vf+tjN\nyFRQQuJSmD6FvzeQhYJKKrhdGiYQ55vkgmRdl+nMicfSwwX/yka02qsCAwEAAQ==\n-----END RSA PUBLIC KEY-----\n", {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})
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
        let fcmToken = "";
        try{
           fcmToken = await RNSecureKeyStore.get('fcmToken');
           } catch (error){
              if (!fcmToken) {
                fcmToken = await firebase.messaging().getToken();
                if (fcmToken) {
                  // user has a device token
                 await RNSecureKeyStore.set("fcmToken", fcmToken, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})
                      }
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

     getNotifyData = async(body,partner_url,title,voucher_code,key)=>{
           console.log("in getNotifyData");
           console.log("partner_url ", partner_url);
           console.log("voucher code ", voucher_code);
           console.log("key ", key);
           let priKey = await RNSecureKeyStore.get('RSAprivate'); //
           console.log("privatekey from secure ", priKey);
           let pubkey = await RNSecureKeyStore.get('RSApublic');
           console.log("publickey from secure ", pubkey);
           let enAES =  await RSA.encrypt('[B@5f84abe8', pubkey);
           console.log("encrypted AES ", enAES);
           let deAES = await RSA.decrypt(key, priKey);   //
           console.log("decrypted AES ", deAES);
           //let en_partner_url = CryptoJS.AES.encrypt(partner_url, 'd1pAI8Ekki6IB5h8lOvAOPtbz2Zs9cER');
           //console.log("aes encrypted message ", en_partner_url);
           //let partner_url_Str = en_partner_url.toString();
           //console.log("partner_url_Str to string ", partner_url_Str);
           //let en_voucher_code = CryptoJS.AES.encrypt(voucher_code, 'd1pAI8Ekki6IB5h8lOvAOPtbz2Zs9cER');
           //console.log("aes encrypted message ", en_voucher_code);
           //let en_voucher_code_str = en_voucher_code.toString();
           //console.log("partner_url_Str to string ", en_voucher_code_str);
           //let pub_partner_url = CryptoJS.AES.decrypt(en_partner_url.toString(), deAES);   //change to partner_url
           let pub_partner_url = CryptoJS.AES.decrypt(partner_url.toString(), deAES);
           url_plaintext = pub_partner_url.toString(CryptoJS.enc.Utf8);    //
           console.log("plainstring of url ", url_plaintext);
           //let pub_voucher_url = CryptoJS.AES.decrypt(en_voucher_code.toString(), deAES);   // change to voucher_code
           let pub_voucher_url = CryptoJS.AES.decrypt(voucher_code.toString(), deAES);
           voucher_plaintext = pub_voucher_url.toString(CryptoJS.enc.Utf8);
           console.log("voucher_plaintext of voucher ", voucher_plaintext);
           this.showAlert(body,url_plaintext,title,voucher_plaintext);

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
          console.log("notification from ", notification);
          firebase.notifications().removeDeliveredNotification(notification._notificationId)
          console.log("in notificationlistener")
        }

         );



        //If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
           this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async(notificationOpen) => {
              console.log("notificationopen in background  ", notificationOpen.notification);
               console.log("notificationopen in background  ", notificationOpen.notification._data);
               const {body,partner_url,title,voucher_code,key} = notificationOpen.notification._data;
               firebase.notifications().removeDeliveredNotification(notificationOpen.notification._notificationId)
               this.getNotifyData(body,partner_url,title,voucher_code,key);

           });


        //If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
          const notificationOpen = await firebase.notifications().getInitialNotification();
           if (notificationOpen) {
               console.log("notificationopen on tapping  ", notificationOpen.notification);
               console.log("notificationopen on tapping  ", notificationOpen.notification._data);
               const {body,partner_url,title,voucher_code,key} = notificationOpen.notification._data;
               console.log("am here in notificationOpen")
               this.getNotifyData(body,partner_url,title,voucher_code,key);
               //this.showAlert(body,partner_url,title,voucher_code);


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
     const titleBody = `Redeem our voucher code ${voucher_code} to get 100 SGD off`

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


  componentWillUnmount() {
      this.notificationListener;
      this.notificationOpenedListener;

    }
}