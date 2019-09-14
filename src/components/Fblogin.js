import React, { Component } from 'react';
import { Button, View, Text, AsyncStorage, TextInput} from 'react-native';
import { LoginButton, AccessToken, LoginManager, GraphRequestManager, GraphRequest } from 'react-native-fbsdk';
import newUser from './user.js';
import Home from './HomePage.js';


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
         let data = await  AccessToken.getCurrentAccessToken();

         let accessToken = data.accessToken
         //alert("accesstoken from server " + accessToken.toString())

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
          console.log("User did not allow to authenticate");
       }

        console.log('Permissions granted to user :', result.grantedPermissions.toString())
        console.log("am going for facebook login");
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

  sendUpdate = async () => {
          const {fbData} = this.state;
          try{
              let response = await fetch('http://192.168.43.102:8083/user',{
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
              let res = await response.json();
              if (response.status >= 200 && response.status < 300) {
                 await AsyncStorage.setItem('user_id', JSON.stringify(res.id));
                 await AsyncStorage.setItem('isLoggedIn', '1');
                 alert("Redirecting to Home Page");
                 this.props.navigation.navigate('Home');
              } else {
                 let error = res;
                 throw error;
                }
            } catch(errors) {
               alert(errors);
            }
    }
};