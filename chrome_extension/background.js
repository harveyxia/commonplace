var dataRef = new Firebase("https://popping-fire-7822.firebaseio.com");

// stores the user object returned by auth
var user1;

var auth = new FirebaseSimpleLogin(dataRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
    console.log("error");
  } else if (user) {
    // user authenticated with Firebase
    user1 = user;
    console.log(user.firebaseAuthToken);
    console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
  } else {
    // user is logged out
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.text) {
        sendResponse({farewell: request.text});
        dataRef.set(request.text);
    } else if (request.email && request.password) {
        console.log("NICEECEWC");
        sendResponse({farewell: "poop"});
        auth.login('password', {
                email: request.email,
                password: request.password,
                rememberMe: true
            });
    }
  });