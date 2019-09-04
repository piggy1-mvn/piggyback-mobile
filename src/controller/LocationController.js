import React, { Component } from 'react';
import { TouchableOpacity, View, ActivityIndicator, Text, Alert} from 'react-native';
import LocationService from '../src/services/locationService.js'
export default class App extends Component {
handlePress = async () => {
  fetch('http://localhost:8080/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(position
      })
})
    .then((response) => response.json())
    .then((responseJson) => {
 Alert.alert("Author name at 0th index:  " + responseJson[0].name);
    })
    .catch((error) => {
      console.error(error);
    });
}
  render(){
  return(
   <View style={{paddingTop: 50, paddingLeft: 50 }}>
   <Text> Some other text </Text>
    <Text> Some other text </Text>
    <TouchableOpacity onPress={this.handlePress.bind(this)}>
     <Text style={{paddingTop: 50, paddingLeft: 50, color: '#FF0000'}}> Click me to see the name </Text>
    </TouchableOpacity>
</View>
  );
}
}