function login() {
  alert("poop");
  var dataRef = new Firebase("https://popping-fire-7822.firebaseio.com");
  var auth = new FirebaseSimpleLogin(dataRef, function(error, user) {
    if (error) {
      // an error occurred while attempting login
      console.log(error);
    } else if (user) {
      // user authenticated with Firebase
      console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
    } else {
      // user is logged out
    }
  });

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  console.log(email + password);
  auth.createUser(email, password, function(error, user) {
    if (!error) {
      console.log('User Id: ' + user.uid + ', Email: ' + user.email);
    } else {
      console.log(error);
    }
  });
  // auth.login('password', {
  //   email: email,
  //   password: password,
  //   rememberMe: true
  // });
}