import React, { Component } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import Checkbox from "react-native-modest-checkbox";
import * as config from "../config/Config.js"
import NewUser from './user.js'

const jsonData = {
  "items": [
     {"name" : "Electronics"} ,
     {"name" : "Food"},
     {"name" : "Clothes"}
  ]
};

const baseUserUrl = config.baseUrlUserApi;
const basePartnerUrl = config.baseUrlPartnerApi;


var tokenvalue : ""

export default class Interests extends Component{
     constructor(props){
            super(props);
            console.log(this.props);

            this.state = {
              options : [],
              userid : ""
            }
            }

    getOptions = async ()=> {
       let url = basePartnerUrl + 'categories'

       try{
           let response = await fetch(`${url}`)

           if (response.status >= 200 && response.status < 300){
               let res = await response.json();
               this.setState({
                   options: res.body.orderType.map((item) => ({
                     title : item,
                     checked : true
                     })
                     )}
                     );
               } else {
                 throw new Error('Something went wrong');

               }
               } catch(error) {

                alert("Uh oh !!..Server connection failed");

               }
      }


   async componentDidMount(){
       this.getOptions();
       try {
               const value = await AsyncStorage.getItem('user_id');
               tokenvalue = await AsyncStorage.getItem('tokenval');
               if (value !== null && tokenvalue !== null) {
                    this.setState({ userid : Number(value) });
                  } else {
                    alert("Userid/accesstoken cannot be found")
                  }

                      } catch (error) {
                        console.log("unable to fetch the value")

                      }
    }

    selectInterest(checked, index) {
        const { options } = this.state;
        options[index].checked = !options[index].checked;
        this.setState({ options: options });

      }


     updateInterests = async () => {

        let interests = this.state.options.filter(item =>item.checked).map((item=>item.title));
        let url = baseUserUrl + 'interest/'

        try{
                  let response = await fetch(`${url}${this.state.userid}`,{
                                  method: 'PATCH',
                                  headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization' : 'Bearer ' + tokenvalue
                                  },
                                  body: JSON.stringify({
                                         "user_interests" : interests
                                  })
                                  })


                  if (response.status >= 200 && response.status < 300) {
                       alert('Interests updated successfully !!');
                  } else {
                      throw new Error('Something went wrong');
                   }
                   }catch(error) {
                       alert(error);
                       alert("Session expired !!! Log in Again !!")
                       this.props.navigation.navigate('Home');

                    }

                }


    render() {
      return (
      <View style = {styles.container}>
          <Text style = {styles.text}>Welcome to Piggy</Text>
          <Button title="Choose your interests" onPress={this.updateInterests}  />
          {this.state.options.map((item, index) => (
            <Checkbox label={item.title}
                      key={item.title}
                      checked={item.checked}
                       onChange={checked => this.selectInterest(checked, index)}
                            />
            ))}
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

