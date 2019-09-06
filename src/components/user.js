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


  const newUser =  new User();
  export default newUser;