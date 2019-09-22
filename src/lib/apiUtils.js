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
    return new Promise((resolve,reject)=>{
      this.api("http://35.222.231.249:8083/user/login", "POST",payload).then((response) => response.json())
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
    return new Promise((resolve,reject)=>{
      this.api("http://35.222.231.249:8083/user/create", "POST",payload).then(
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
    this.api("http://35.222.231.249:8080/location", "POST",payload).then((response) => response.json())
    .then((responseJson) => {
      console.log("responseJson",responseJson)
    })
    .catch((error) => {
      alert(error);
    });
  }

  updateInterests(payload){
    return new Promise((resolve,reject)=>{
      this.api(`http://35.222.231.249:8083/user/interest/${this.user.id}`, "PATCH",payload).then((response) => response.json())
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

    return new Promise((resolve,reject)=>{
          this.apiGet(`http://35.222.231.249:8083/user/${userID}`, "GET", tokenvalue).then((response) => response.json())
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

          return new Promise((resolve,reject)=>{
                this.apiPut(`http://35.222.231.249:8083/user/${this.user.id}`, "PUT", payload, tokenvalue).then((response) => response.json())
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
