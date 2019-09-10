import React, { Component } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import newUser from './user.js';
import LocationTracker from '../services/LocationTracker.js';
import { createStackNavigator, createAppContainer } from 'react-navigation';

export default class Interests extends Component{
     constructor(props){
            super(props);
            console.log(this.props);

            }


    render() {
      return (
       <View style = {styles.container}>
          <Text style = {styles.text}>Welcome to Piggy</Text>
          <Button
             title="Choose your interests"
           />
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

