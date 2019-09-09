import React, { Component } from 'react';
import { TextInput } from 'react-native';


export function UselessTextInput(){
   const [value, onChangeText] = React.useState('Useless Placeholder');
   return (
       <TextInput
         style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
         onChangeText={text => onChangeText(text)}
         value={value}
       />
     );

}
class User {
  constructor(first_name,last_name,user_password,mobile_number,mobile_verified,user_email,device_id) {
    this.first_name = first_name;
    this.last_name =  last_name;
    this.user_password = user_password;
    this.mobile_number = mobile_number;
    this.mobile_verified = mobile_verified;
    this.user_email= user_email;
    this.device_id = device_id;
  }

     test(){
     console.log("hiii, inside user class");


  }}
  export const newUser =  new User();



