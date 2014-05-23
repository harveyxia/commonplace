function firebaseCallback(error, usr) {
  if (error) {          // an error occurred while attempting login
    console.log(error);
    user = null;
    var errorMessage = getError(error.message);
    loadLogin(errorMessage);        // load Login form
  } else if (usr) {     // user authenticated with Firebase
    user = usr;
    console.log(user.firebaseAuthToken);
    console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
    loadLogout();       // load Logout form
  } else {              // user is logged out
    user = null;
    loadLogin(null);        // load Login form
  }
};

var dataRef = chrome.extension.getBackgroundPage().dataRef;

var user = chrome.extension.getBackgroundPage().user;

var auth = chrome.extension.getBackgroundPage().FirebaseSimpleLogin(dataRef, firebaseCallback);

function login() {
  var email = $("#login-email").val();
  var password = $("#login-password").val();

  if (!user) {
    auth.login('password', {
      email: email,
      password: password,
      rememberMe: true,
      // debug: true
    });
  }
}

function initUser(url, email) {
  userRef = chrome.extension.getBackgroundPage().createRef(url);
  userRef.set({email: email});
}

function signup() {
  var email = $("#login-email").val();
  var password = $("#login-password").val();

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
    } else {
      var errorMessage = getError(error.message);
      loadLogin(errorMessage);        // load Login form
    }
  });
}

function logout() {
  auth.logout();
}

function loadLogin(error) {
  $('#container').load("loginForm.html", function () {
    $("#login").click(function () {
      login();
    });
    $("#signup").click(function () {
      signup();
    });
    if (error) {
      $(document).ready( function() {
        $('#container').append("<p class='error-message'>" + error + "</p>");
      });
    }
  });
  
}

function loadLogout() {
  $('#container').html("<a href='#' id='signout' class='signout button button-block button-rounded button-flat-caution'>Sign Out</a>");
  $("#signout").click(function () {
    logout();
  });
}

function getError(error) {
  var index = error.lastIndexOf(': ') + 2;
  return error.substring(index)
}