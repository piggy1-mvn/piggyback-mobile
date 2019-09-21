import React, { Component } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import newUser from './user.js';
import HomePage from './HomePage.js';
import LoginPage from './LoginPage.js';
import * as config from "../config/Config.js";

const baseUrl = config.baseUrlUserApi;

export default class RegisterPage extends Component{
    constructor(props){
        super(props);
        console.log(this.props);

     this.state ={
       first_name : "",
       last_name : "",
       user_password : "",
       confirm_password : "",
       mobile_number : "",
       mobile_verified : "",
       user_email : "",
       device_id : "ABC123",
       errors : []
     }

    }


    onRegisterPressed = async () => {
      let deviceT = await AsyncStorage.getItem('fcmToken');
      let url = baseUrl + 'create'
      try{
         let response = await fetch(`${url}`,{
                                    method: 'POST',
                                    headers: {
                                       'Accept': 'application/json',
                                       'Content-Type': 'application/json',
                                              },
                                    body: JSON.stringify({
                                       "first_name" : this.state.first_name,
                                       "last_name" : this.state.last_name,
                                       "user_password" : this.state.confirm_password,
                                       "mobile_number" : this.state.mobile_number,
                                       "mobile_verified" : "true",
                                       "user_role" : "PIGGY_USER",
                                       "email" : this.state.user_email,
                                       "device_id":deviceT
                                       })
                                    })

        if (response.status >= 200 && response.status < 300) {
           let res = await response.json();
           await AsyncStorage.setItem('user_email', JSON.stringify(res.email));
           await AsyncStorage.setItem('user_id', JSON.stringify(res.id));
           alert("You have successfully registered !!")
           this.props.navigation.navigate('Login');
        } else {
           throw new Error('Something went wrong');
           alert("Something went wrong");

        }
      } catch(errors) {
        this.setState({errors: errors});
        alert(errors)
      }
    }



    render() {
      return (
       <View style = {styles.container}>
        <View style = {styles.registerform}>

          <TextInput style = {styles.input}
            placeholder = "enter your first name"
            returnKeyType = "next"
            onChangeText = { (text) => this.setState({first_name : text})}
            onSubmitEditing = {()=> this.secondnameInput.focus()}
          />

          <TextInput style = {styles.input}
           placeholder = "enter your second name"
           returnKeyType = "next"
           onChangeText = { (text) => this.setState({last_name : text})}
           onSubmitEditing = {()=> this.phoneInput.focus()}
            ref = {(input) => this.secondnameInput =input}
          />

          <TextInput style = {styles.input}
           placeholder = "enter your phone number"
           returnKeyType = "next"
           onChangeText = { (text) => this.setState({mobile_number : text})}
           onSubmitEditing = {()=> this.emailInput.focus()}
           ref = {(input) => this.phoneInput =input}
           />

           <TextInput style = {styles.input}
           placeholder = "enter your email id"
           returnKeyType = "next"
           onChangeText = { (text) => this.setState({user_email : text})}
           onSubmitEditing = {()=> this.passwordInput.focus()}
           ref = {(input) => this.emailInput =input}
           />

           <TextInput style = {styles.input}
            placeholder = "enter your password "
            secureTextEntry = {true}
            returnKeyType = "next"
            onChangeText = { (text) => this.setState({confirm_password : text})}
            onSubmitEditing = {() => this.confirmpasswordInput.focus()}
            ref = {(input) => this.passwordInput =input}
            />

            <TextInput style = {styles.input}
             placeholder = "enter your confirm password "
             secureTextEntry = {true}
             returnKeyType = "go"
             onChangeText = { (text) => this.setState({user_password : text})}
             ref = {(input) => this.confirmpasswordInput =input}
             />

          <TouchableOpacity style = {styles.buttoncontainer} onPress = {this.onRegisterPressed}>
            <Text style ={styles.buttontext}>Sign Me up!!</Text>
          </TouchableOpacity>


         </View>
       </View>
       );
}
}


const Errors = (props) => {
  return (
    <View>
      {props.errors.map((error) => <Text style = {styles.error}>{error}</Text>)}
    </View>
  )
 }

const styles = StyleSheet.create({
   container : {
     padding :20,
     flex : 1,
     backgroundColor : '#ecf0f1',
   },
   registerform : {
     marginTop : 50,
     justifyContent : 'center',
     alignItems: 'stretch'
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
      },
   error: {
      color: 'red',
      paddingTop: 10
    }
});

