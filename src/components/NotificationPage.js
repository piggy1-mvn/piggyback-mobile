import React, { Component } from 'react';
import { StyleSheet, Button, View, Text, TextInput, Linking } from 'react-native';


export default class NotificationPage extends Component {
  render() {
    /* 2. Get the param, provide a fallback value if not available */
    const { navigation } = this.props;
    const Title = navigation.getParam('Title', 'Panel');
    const Body = navigation.getParam('Body', 'Avail discount');
    const Coupon = navigation.getParam('Coupon', 'AZ456');
    const urlPartner = navigation.getParam('urlPartner', 'www.piggy.com');
    console.log("title: ", Title);
    console.log("Body: ", Body);
    console.log("Coupon: ", Coupon)
    console.log("url : ", urlPartner);


    return (
      <View style={styles.container}>
        <Text>NotificationPage Screen</Text>
        <Text>{JSON.stringify(Title)}</Text>
        <Text>{JSON.stringify(Body)}</Text>
        <Text>{JSON.stringify(Coupon)}</Text>
        <Text>{JSON.stringify(urlPartner)}</Text>
        <Text style={styles.TextStyle} onPress={ ()=> Linking.openURL(urlPartner) } >Click Here To Open Google.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
   container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  TextStyle: {
   color: '#E91E63',
   textDecorationLine: 'underline'

  }
});