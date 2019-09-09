import React, { Component } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import newUser from './user.js';

export default class RegisterPage extends Component{
    render() {
      return (
       <View style = {styles.container}>
          <Text style = {styles.text}>Welcome to Piggy</Text>
       </View>
       );
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

