import React, { Component } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import Checkbox from "react-native-modest-checkbox";

const jsonData = {
  "items": [
     {"name" : "Electronics"} ,
     {"name" : "Food"},
     {"name" : "Clothes"}
  ]
};

export default class Interests extends Component{
     constructor(props){
            super(props);
            console.log(this.props);

            this.state = {
              options : [],
              //checked : true
              userid : ""
            }
            }

    getOptions = async ()=> {
       try{
           //let response = await fetch('http://192.168.43.102:8083/partner/interests/')
           //let res = await response.json();
           //if (response.status >= 200 && response.status < 300){
               console.log("am in if oondition");
               this.setState({
                 options: jsonData.items.map((item) => ({
                     title : item.name,
                     checked : true
                     })
                     )}
                     );
               //} else {
                // let error = res;
                 //throw error;
               } catch(error) {
                console.log("error from server --> ", error);
                alert("Failed to connect to server");

               }

      }


   async componentDidMount(){
       this.getOptions();
       try {
               const value = await AsyncStorage.getItem('user_id');
               if (value !== null) {
                  // We have data!!
                  console.log(" inside interests component did mount ", value)
                  this.setState({ userid : Number(value) });
                  } else {
                    console.log('No value returned from storage');
                    alert("Userid cannot be found")
                  }

                      } catch (error) {
                        console.log("unable to fetch the value")
                        // Handle errors here
                      }
    }

    selectInterest(checked, index) {
        const { options } = this.state;
        options[index].checked = !options[index].checked;
        this.setState({ options: options });
        console.log("options ", this.state.options);
      }


     updateInterests = async () => {
        let interests = this.state.options.filter(item =>item.checked).map((item=>item.title));
        console.log(interests);
        let url = "http://192.168.43.102:8083/user/interest/"
        await fetch(`${url}${this.state.userid}`,{
                         method: 'PATCH',
                         headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            },
                         body: JSON.stringify({
                           "user_interests" : interests
                            })
                        }).then(response => {
                                console.log("response from server ",response)
                                alert("failed to update your interest")
                            })
                            .catch(error =>{
                                console.log("response failed to server",error)
                                alert("failed to update your interests")
                            })
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

