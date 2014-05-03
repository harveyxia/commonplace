function firebaseCallback(error, usr) {
  if (error) {          // an error occurred while attempting login
    console.log("error"); console.log(error);
    user = null;
  } else if (usr) {     // user authenticated with Firebase
    user = usr;
    console.log(user.firebaseAuthToken);
    console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
  } else {              // user is logged out
    user = null;
    console.log('logged out');
  }
};

var dataRef = chrome.extension.getBackgroundPage().dataRef;

var user = chrome.extension.getBackgroundPage().user;

var auth = chrome.extension.getBackgroundPage().FirebaseSimpleLogin(dataRef, firebaseCallback);

function login() {
  console.log("login");
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  // chrome.extension.getBackgroundPage().auth.createUser(email, password,
  //   function(error, user) {
  //   if (!error) {
  //     console.log('User Id: ' + user.uid + ', Email: ' + user.email);
  //   } else {
  //     console.log(error);
  //   }
  // });

  if (!user) {
    auth.login('password', {
      email: email,
      password: password,
      rememberMe: true,
      debug: true
    });
  }
}

function logout() {
  auth.logout();
}

if (!user) {
  $('#container').html("Email: <input type='text' name='email' id='email'/>"+
      "Password: <input type='password' name='password' id='password'/>"+
      "<button id='submit'> Submit </button>");
  document.getElementById("submit").addEventListener('click', login, false);
} else {
  $('#container').html("<button id='submit'> Logout </button>");
  document.getElementById("submit").addEventListener('click', logout, false);
}