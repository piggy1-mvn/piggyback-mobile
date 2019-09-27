import React, { Component } from 'react';
import { Button, View, Text, AsyncStorage, TextInput} from 'react-native';
import { ActivityIndicator, StatusBar, LoginButton, AccessToken, LoginManager, GraphRequestManager, GraphRequest } from 'react-native-fbsdk';
import * as config from "../config/Config.js"
import Home from './HomePage.js';
import jwt from "jwt-decode";
import UserService from "../lib/apiUtils.js"

var fbTokenval : ""
var regOk : false ;
var logOk : false;

const baseUrl = config.baseUrlUserApi;

export default class Fblogin extends Component {
     constructor(props){
             super(props);
             console.log(this.props);
             this.state = {
               fbData :{},
               mobile_number : '',
               getphone : false,
			   loading : false,

              }
             }

  isInRelationship = async () => {
              const requestedInfo = await this.getGraphRequest();

            };

  apiCall = async (fbData) => {
	let fb_id = fbTokenval.userID
    let fbtoken = fbTokenval.accessToken

	try{
	    let response = await fetch(baseUrl + 'FBUserLogin',{

                                             method: 'POST',
                                            headers: {
                                               'Content-Type': 'application/json',
                                               'Authorization' : fbtoken
                                                      },
                                            body: JSON.stringify({
                                               "fb_user_id" : fb_id,
                                               "email" : fbData.email
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


             }
             }catch(errors){
                 console.log("errors ", errors);

             }


}

  checkIfExists = async () => {
      const {fbData} = this.state;
      await this.apiCall(fbData);

        if (logOk == true) {
               await this.getUpdateUser();
         } else {
		   alert("Please enter your contact to register")
           this.setState({loading : false, getphone : true})

         }

	 }

 getGraphRequest = async() => {
         fbTokenval = await  AccessToken.getCurrentAccessToken();
         let accessToken = fbTokenval.accessToken
         const responseInfoCallback = (error,result) => {
                          if (error) {
                               alert('Error fetching data ' + error.toString());
                             } else {
                              alert('Success fetching data: ' + result.toString());
                              //this.setState({fbData : result , getphone : true})
							  this.setState({fbData : result, loading : true});
							  this.checkIfExists();


                               }
                                }

         const infoRequest = new GraphRequest(
                                                '/me',
                                                {
                                                  accessToken : accessToken,
                                                  parameters : {
                                                   fields :{
                                                      string : 'email,name,first_name,last_name'
                                                      }
                                                      }
                                                },
                                                responseInfoCallback
                                                );
         new GraphRequestManager().addRequest(infoRequest).start();
         };




 facebookLogin = async() => {

    try {
      const result = await LoginManager.logInWithPermissions(["public_profile","email"]);

       if (result.isCancelled)  {
         throw new Error("User cancelled the request");

       }

        alert("Permissions granted to user : ", result.grantedPermissions);
        let pure = await this.isInRelationship();

    } catch (e) {
        console.log("error", e);
        }
 }



 logout = () =>{
                if (AccessToken.getCurrentAccessToken)
                LoginManager.logOut();
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
             throw new Error("Token updation failed")
           }
         }).then(async (res) => {
            const checkUpdate = await UserService.UpdateUserDetails(res,tokenvalue);
            if (checkUpdate == "success"){
               this.props.navigation.navigate('Home');
            } else {
               throw new Error("Updating Token failed")
              }
         }).catch((error)=>{
               alert(error);
                    });



      }




fbChecklogin = async () => {
    const {fbData} = this.state;
    await this.apiCall(fbData);

    try{
	       if (logOk = true){
	       await this.getUpdateUser();
            } else {
            throw new Error("Failed to Login")
            this.props.navigation.navigate('Login')
           }
	} catch (error) {
		alert("Something went wrong !!")

	}


}


 sendUpdate = async () => {
          let deviceT = await AsyncStorage.getItem('fcmToken');
          const {fbData} = this.state;
          try{
               let response = await fetch(baseUrl + 'create',{
                                          method: 'POST',
                                          headers: {
                                             'Accept': 'application/json',
                                             'Content-Type': 'application/json',
                                                    },
                                          body: JSON.stringify({
                                             "first_name" : fbData.first_name,
                                             "last_name" : fbData.last_name,
                                             "mobile_number" : this.state.mobile_number,
                                             "mobile_verified": "true",
                                             "user_type": "USER_TYPE_FB",
                                             "user_role": "PIGGY_USER",
                                             "email" : fbData.email,
                                             "device_id": deviceT
                                             })
                                          })

              if (response.status >= 200 && response.status < 300) {
                 let res = await response.json();
                 regOk = true
              } else {
                 let error = response;
                 throw error;
                }

               if (regOk == true){
                    await this.fbChecklogin();
                  }
            } catch(errors) {
               alert(errors);
            }
    }


   render() {
        return (
           <View style={{marginTop:20}}>
            {this.state.getphone == true ?
               [
                 <TextInput key = "number"
                     placeholder = "enter your phone number"
                     onChangeText = { (text) => this.setState({mobile_number : text})} />,
                 <Button key = "contact" title="Submit my contact" onPress={this.sendUpdate} />
               ]
               :
                [
                  <Button key = "login" title="Login with FaceBook" onPress={this.facebookLogin} />

                 ]
                 }

         </View>
      );
    }


};
