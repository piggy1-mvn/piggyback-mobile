import React, { Component } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, AsyncStorage } from 'react-native';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import HomePage from './HomePage';
import RegisterPage from './RegisterPage';
import * as config from "../config/Config.js"
import Fblogin from './Fblogin.js'
import jwt from "jwt-decode";
import UserService from "../lib/apiUtils.js"

const baseUrl = config.baseUrlUserApi;
var logOk = false;

export default class LoginPage extends Component{

    constructor(props){
       super(props);
       this.state = {
          email_id : '',
          password : ''
          }
       }

    getUpdateUser = async () => {
       let userID = await AsyncStorage.getItem('user_id');
       tokenvalue = await AsyncStorage.getItem('tokenval');
       fcmtoken = await AsyncStorage.getItem('fcmToken');
       UserService.getUserDetails(userID,tokenvalue).then(async (res) => {
         let id = UserService.getUserId();
         if (res) {
           res.device_id = fcmtoken
           return res;

         } else {
           throw new Error("fToken updation failed")
         }
       }).then(async (res) => {
          const checkUpdate = await UserService.UpdateUserDetails(res,tokenvalue);
          if (checkUpdate == "success"){
             this.props.navigation.navigate('Home');
          } else {
             throw new Error("fToken updation failed")
            }
       }).catch((error)=>{
             alert(error);
                  });



    }


    checkLogin = async () => {
        let url = baseUrl + 'login'

        try{
            let response = await fetch(`${url}`,{
                                           method: 'POST',
                                           headers: {
                                              'Accept': 'application/json',
                                              'Content-Type': 'application/json',
                                                     },
                                           body: JSON.stringify({
                                               "email" : this.state.email_id,
                                               "user_password" : this.state.password
                                              })
                                           })

               if (response.status >= 200 && response.status < 300) {
                  let res = await response.json();
                  alert('You have successfully logged in  to PiggyBack !!');
                  let decoded = await jwt(res.jwttoken)
                  await AsyncStorage.setItem('user_id', JSON.stringify(decoded.userId));
                  await AsyncStorage.setItem('isLoggedIn', '1');
                  await AsyncStorage.setItem('tokenval', res.jwttoken);
                  await AsyncStorage.setItem('user_email', JSON.stringify(decoded.sub));
                  logOk = true
               } else {
                  throw new Error('Something went wrong');
                  alert("Something went wrong");
               }

               if (logOk = true) {
                  await this.getUpdateUser();

               }
             } catch(error) {
                alert("Incorrect password or Email id");
             }

       }


    render() {
      return (
        <View style = {styles.container}>
          <Text style={styles.appName}>Piggy Incentives</Text>
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

          <View  style = {styles.buttoncontainer}>
               <Button
                 title = "Login to Piggy"
                 color = "#1abc9c"
                 onPress = {this.checkLogin}
                 />
          </View>

          <View  style = {styles.buttoncontainer}>
             <Button
               title = "Register here"
               color = "#1abc9c"
               onPress = {() => this.props.navigation.navigate('Register')}
             />
          </View>

           <Fblogin navigation={this.props.navigation}/>

       </View>
       );
}
}

const styles = StyleSheet.create({
   container : {
     padding :20,
     flex : 1,
     flexDirection: "column",
     backgroundColor : '#ecf0f1',
     justifyContent: 'center',
     alignItems : 'stretch'
   },
   appName:{
     fontSize:26,
     color:'#1abc9c',
     marginBottom:10,
     textAlign : 'center',
     fontWeight: 'bold'
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
        justifyContent : 'center'
      },
   buttontext : {
     textAlign : 'center',
     color : '#ecf0f1',
     fontSize : 20
     }
})