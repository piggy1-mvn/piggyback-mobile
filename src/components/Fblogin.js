import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import newUser from './user.js';


export default class Fblogin extends Component {

initUser=(token)=>{
    console.log("am inside the inituser");
    console.log("access token --> ", token);
    console.log("access token 1 --> ", token.accessToken);
    console.log('https://graph.facebook.com/v2.5/me?fields=email,name,first_name,friends&access_token=' + token);
    fetch('https://graph.facebook.com/v2.5/me?fields=email,name,first_name,last_name&access_token=' + token.accessToken)
      .then((response) => response.json())
      .then((response) => {
         newUser.first_name = response.first_name
         newUser.last_name = response.last_name
         newUser.email = response.email
         //console.log("response --> ", response);
         //console.log("email --> ",newUser.email);
         //console.log("nsme -> ",response.name);
         //console.log("firstname--> ",response.first_name);
      })
      .catch(() => {
          console.log('ERROR GETTING DATA FROM FACEBOOK')
        })
}

 facebookLogin = async() => {
    try {
       const result = await LoginManager.logInWithPermissions(["public_profile","email"]);

       if (result.isCancelled)  {
          throw new Error("User cancelled the request");
          console.log("User did not allow to authenticate");
       }

       console.log('Login success with permissions:', result.grantedPermissions.toString())
       alert("Login was successull with permmissions: ", result.grantedPermissions);

       const accesstoken = await AccessToken.getCurrentAccessToken();
       if (!accesstoken) {
         throw new Error("Something went wrong obtaining user's access token")
         alert("Could not get Access token and cannot authenticate ");
         console.log("failed to get access token");
       } else {
         this.initUser(accesstoken);
       }

    } catch (e) {
        console.log("error", e);
        }
 }

 logout = () =>{
                if (AccessToken.getCurrentAccessToken)
                LoginManager.logOut();
                   }

  render() {
    return (
      <View>
        <Button title="Login with FaceBook" onPress={this.facebookLogin} />
        <Button title="Logout" onPress={this.logout} />
      </View>
    );
  }


};