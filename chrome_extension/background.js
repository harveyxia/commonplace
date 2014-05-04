function createRef(url) {
  var ref = new Firebase(url);
  return ref;
}

var dataRef = new Firebase("https://popping-fire-7822.firebaseio.com");

// stores the user object returned by auth
var user;

// Reference to the user's JSON
var userRef;

var auth = new FirebaseSimpleLogin(dataRef, function(error, usr) {
  if (error) {          // an error occurred while attempting login
    console.log(error);
    chrome.extension.getViews()[0].alert(error)
    user = null;
  } else if (usr) {     // user authenticated with Firebase
    user = usr;
    userURL = "https://popping-fire-7822.firebaseio.com" + "/users/" + user.uid
    console.log(userURL)
    userRef = new Firebase(userURL);
  } else {              // user is logged out
    user = null;
    console.log('logged out');
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.text) {
        sendResponse({farewell: request.text});
        dataRef.set(request.text);
    }
  });