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
    // auth.login('google', {
    //   rememberMe: true,
    // });
  }
}

function initUser(url, email) {
  userRef = chrome.extension.getBackgroundPage().createRef(url);
  userRef.set({email: email});
}

function signup() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  auth.createUser(email, password,
    function(error, user) {
    if (!error) {
      auth.login('password', {
        email: email,
        password: password,
        rememberMe: true,
        debug: true
      });

      userURL = "https://popping-fire-7822.firebaseio.com" + "/users/" + user.uid
      initUser(userURL, email);
      console.log('User Id: ' + user.uid + ', Email: ' + user.email);
    } else {
      console.log(error);
    }
  });
}

function logout() {
  auth.logout();
}

if (!user) {
  $('#container').html("Email: <input type='text' name='email' id='email'/>"+
      "Password: <input type='password' name='password' id='password'/>"+
      "<button id='login'> Login </button>"+
      "<button id='signup'> Sign Up </button>");
  document.getElementById("login").addEventListener('click', login, false);
  document.getElementById("signup").addEventListener('click', signup, false);
} else {
  $('#container').html("<button id='submit'> Logout </button>");
  document.getElementById("submit").addEventListener('click', logout, false);
}