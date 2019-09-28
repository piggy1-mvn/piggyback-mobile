import * as config from "../config/Config.js"

class User {
  constructor() {
    this.user = [];
  }

  api(url, method, body) {
    return fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  }

  getUserId(){
    return this.user.id
  }

  login(payload) {
    let baseUrl = config.baseUrlUserApi;
    let url = baseUrl + 'login'

    return new Promise((resolve,reject)=>{
      this.api(`${url}`, "POST",payload).then((response) => response.json())
      .then((responseJson) => {
        this.user = responseJson;
        resolve(responseJson);
      })
      .catch((error) => {
        resolve(error);
      });
    })
  }

  register(payload){
    let baseUrl = config.baseUrlUserApi;
    let url = baseUrl + 'create'

    return new Promise((resolve,reject)=>{
      this.api(`${url}`, "POST",payload).then(
        (response) => response.json())
      .then((responseJson) => {
        this.user = responseJson;
        resolve(responseJson);
      })
      .catch((error) => {
        resolve(error);
      });
    })
  }

  location(payload){
    let baseUrl = config.baseUrlLocationApi;
    console.log("payload ", payload)
    this.api(`${baseUrl}`, "POST",payload).then((response) => response.json())
    .then((responseJson) => {
      console.log("responseJson",responseJson)
    })
    .catch((error) => {
      alert(error);
    });
  }

  updateInterests(payload){
    let baseUrl = config.baseUrlUserApi;
    let url = baseUserUrl + 'interest/'
    return new Promise((resolve,reject)=>{
      this.api(`${url}${this.user.id}`, "PATCH",payload).then((response) => response.json())
      .then((responseJson) => {
        this.user = responseJson;
        resolve('success');
      })
      .catch((error) => {
        resolve(error);
      });
    })
  }

  apiGet(url, method, tokenvalue) {

      return fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          'Authorization' : 'Bearer ' + tokenvalue
        }
      });
    }

  apiPut(url, method, body, tokenvalue) {

        return fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            'Authorization' : 'Bearer ' + tokenvalue
          },
          body: JSON.stringify(body)
        });
      }




  getUserDetails(userID,tokenvalue) {
    let baseUrl = config.baseUrlUserApi;

    return new Promise((resolve,reject)=>{
          this.apiGet(`${baseUrl}${userID}`, "GET", tokenvalue).then((response) => response.json())
          .then((responseJson) => {
            this.user = responseJson;
            resolve(responseJson);
          })
          .catch((error) => {

            resolve(error);
          });
        })
   }

    UpdateUserDetails(payload,tokenvalue) {
         let baseUrl = config.baseUrlUserApi;
         return new Promise((resolve,reject)=>{
                this.apiPut(`${baseUrl}${this.user.id}`, "PUT", payload, tokenvalue).then((response) => response.json())
                .then((responseJson) => {
                  this.user = responseJson;
                  resolve("success");
                })
                .catch((error) => {

                  resolve(error);
                });
              })
         }


  }


export default new User();
