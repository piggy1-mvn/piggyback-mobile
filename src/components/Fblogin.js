import React, { Component } from 'react';
import { Button, View, Text, AsyncStorage } from 'react-native';
import { LoginButton, AccessToken, LoginManager, GraphRequestManager, GraphRequest } from 'react-native-fbsdk';
import newUser from './user.js';
import Home from './HomePage.js';


export default class Fblogin extends Component {
     constructor(props){
             super(props);
             console.log(this.props);
             }

initUser=(token)=>{
    console.log("access token --> ", token);
    console.log("access token 1 --> ", token.accessToken);
    console.log('https://graph.facebook.com/v2.5/me?fields=email,name,first_name,friends&access_token=' + token.accessToken);
    fetch('https://graph.facebook.com/v2.5/me?fields=email,name,first_name,last_name&access_token=' + token.accessToken)
      .then((response) => response.json())
      .then((response) => {
         newUser.first_name = response.first_name
         newUser.last_name = response.last_name
         newUser.email = response.email
         console.log("response --> ", response);
         console.log("email --> ",newUser.email);
         console.log("nsme -> ",response.name);
         console.log("firstname--> ",response.first_name);
      })
      .catch(() => {
          console.log('ERROR GETTING DATA FROM FACEBOOK')
          alert("Network error, failed to log you in ")
       })
}

 facebookLogin = async() => {
    try {
       const result = await LoginManager.logInWithPermissions(["public_profile","email"]);

       if (result.isCancelled)  {
          throw new Error("User cancelled the request");
          console.log("User did not allow to authenticate");
       }

        console.log('Permissions granted to user :', result.grantedPermissions.toString())
        console.log("am going for facebook login");
        alert("Permissions granted to user : ", result.grantedPermissions);

        AccessToken.getCurrentAccessToken().then(
         (data) => {
           let accessToken = data.accessToken
           alert("accesstoken from server " + accessToken.toString())

           const responseInfoCallback = (error,result) => {
              if (error) {
                console.log("error from server ", error)
                alert('Error fetching data ' + error.toString());
                } else {
                 console.log("result -->", result)
                 alert('Sucess fetching data: ' + result.toString());
                 AsyncStorage.setItem('isLoggedIn', '1');
                 this.props.navigation.navigate('Home');

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

             new GraphRequestManager().addRequest(infoRequest).start()
            }
         )



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
