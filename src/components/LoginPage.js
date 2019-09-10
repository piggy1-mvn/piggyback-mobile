import React, { Component } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, AsyncStorage } from 'react-native';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import newUser from './user.js';
import HomePage from './HomePage';
import RegisterPage from './RegisterPage';
import Fblogin from './Fblogin.js'

const userInfo = {email_id: 'elizabethjohnjk333@gmail.com', password : 'sarah'}

export default class LoginPage extends Component{

    constructor(props){
       super(props);
       this.state = {
          email_id : '',
          password : ''
          }
       }

    checkLogin = async () => {
       console.log("am inside checklogin");
       if(userInfo.email_id === this.state.email_id && userInfo.password === this.state.password){
          alert('You have successfully logged in  to PiggyBack !!');
          await AsyncStorage.setItem('isLoggedIn', '1');
          this.props.navigation.navigate('Home');
          } else {
           alert('Email id or password entered is wrong !!');
          }

    }


    render() {
      return (
        <View style = {styles.container}>
        <View style = {styles.textfields}>
          <TextInput style = {styles.input}
            placeholder = "email id"
            returnKeyType = "next"
            onChangeText = { (text) => this.setState({email_id : text})}
            onSubmitEditing = {()=> this.passwordInput.focus()}
            keyboardType = "email-address"
            autoCapitalize = "none"
            autoCorrect  = {false}
          />
          <TextInput style = {styles.input}
            placeholder = "password"
            onChangeText = { (text) => this.setState({password : text})}
            returnKeyType = "go"
            secureTextEntry = {true}
            ref = {(input) => this.passwordInput =input}
          />
          <TouchableOpacity style = {styles.buttoncontainer} onPress = {this.checkLogin}>
            <Text style ={styles.buttontext}>Login to Piggy</Text>
          </TouchableOpacity>
          <Button
             style = {styles.buttoncontainer}
             title = "Register here"
             color = "#1abc9c"
             onPress = {() => this.props.navigation.navigate('Register')}
          />
           <Fblogin />
        </View>
       </View>
       );
}
}

const styles = StyleSheet.create({
   container : {
     padding :20,
     flex : 1,
     backgroundColor : '#ecf0f1',
     justifyContent: 'center',
     alignItems : 'stretch'
   },
   input : {
     paddingLeft : 20,
     borderRadius : 50,
     height : 50,
     fontSize : 25,
     backgroundColor : 'white',
     borderColor : '#1abc9c',
     borderWidth : 1,
     marginBottom : 20,
     color : '#34495e'
   },
   buttoncontainer :{
     height : 50,
     borderRadius : 50,
     backgroundColor : '#1abc9c',
     justifyContent : 'center'
   },
   buttontext : {
     textAlign : 'center',
     color : '#ecf0f1',
     fontSize : 20
     }
})

