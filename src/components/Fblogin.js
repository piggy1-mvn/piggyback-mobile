import React, { Component } from 'react';
import { Button, View, Text, AsyncStorage, TextInput} from 'react-native';
import { LoginButton, AccessToken, LoginManager, GraphRequestManager, GraphRequest } from 'react-native-fbsdk';
import * as config from "../config/Config.js"
import newUser from './user.js';
import Home from './HomePage.js';


var fbTokenval : ""
var regOk : false
const baseUrl = config.baseUrlUserApi;

export default class Fblogin extends Component {
     constructor(props){
             super(props);
             console.log(this.props);
             this.state = {
               fbData :{},
               mobile_number : '',
               getphone : false

              }
             }

  isInRelationship = async () => {
              const requestedInfo = await this.getGraphRequest();

            };

 getGraphRequest = async() => {
         fbTokenval = await  AccessToken.getCurrentAccessToken();
         let accessToken = fbTokenval.accessToken
         const responseInfoCallback = (error,result) => {
                          if (error) {
                               alert('Error fetching data ' + error.toString());
                             } else {
                              alert('Success fetching data: ' + result.toString());
                              this.setState({fbData : result , getphone : true})
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

   shouldComponentUpdate(props, state) {
        return state.getphone == true;
    }

  render() {
      return (
         <View style={{marginTop:20}}>
          {this.state.getphone == true ?
             [
               <TextInput
                   placeholder = "enter your phone number"
                   onChangeText = { (text) => this.setState({mobile_number : text})} />,
               <Button title="Submit my contact" onPress={this.sendUpdate} />
             ]
             :
              [
                <Button title="Login with FaceBook" onPress={this.facebookLogin} />

               ]
               }

       </View>
    );
  }

fbChecklogin = async () => {
    const {fbData} = this.state;
    let fb_id = fbTokenval.userID
    let fbtoken = fbTokenval.accessToken
    //'http://192.168.43.102:8083/user/FBUserlogin'
  try{
        let response = await fetch(baseUrl + 'FbUserLogin',{
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
               await AsyncStorage.setItem('isLoggedIn', '1');
               await AsyncStorage.setItem('tokenval', res.jwttoken);
               this.props.navigation.navigate('Home');
            } else {
               console.log("error from server", response)
               throw new Error('Something went wrong');
               alert("Something went wrong");

             }
              } catch(errors) {
                 alert(errors);
                 this.props.navigation.navigate('Login')
              }


}
  sendUpdate = async () => {
          const {fbData} = this.state;
          try{
          //'http://192.168.43.102:8083/user/create'
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
                                             "device_id":"23ADEVIEW"
                                             })
                                          })

              if (response.status >= 200 && response.status < 300) {
                 let res = await response.json();
                 await AsyncStorage.setItem('user_id', JSON.stringify(res.id));
                 console.log("response for registeration ok")
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
};


