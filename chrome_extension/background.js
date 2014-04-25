var dataRef = new Firebase("https://popping-fire-7822.firebaseio.com");
var poop = "poop";
var auth = new FirebaseSimpleLogin(dataRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
    console.log("error");
  } else if (user) {
    // user authenticated with Firebase
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