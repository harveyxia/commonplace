function createRef(url) {
  var ref = new Firebase(url);
  return ref;
}

var dataRef = new Firebase("https://popping-fire-7822.firebaseio.com");

// stores the user object returned by auth
var user;

// Reference to the user's JSON
var userRef;
var quoteRef;

var auth = new FirebaseSimpleLogin(dataRef, function(error, usr) {
  if (error) {          // an error occurred while attempting login
    console.log(error);
    user = null;
  } else if (usr) {     // user authenticated with Firebase
    console.log(usr);
    user = usr;
    var userURL = "https://popping-fire-7822.firebaseio.com/users/" + user.uid
    var quoteURL = userURL + '/quotes'
    userRef = new Firebase(userURL);
    quoteRef = new Firebase(quoteURL);
    // chrome.extension.getViews()[0].loadLogout;
  } else {              // user is logged out
    user = null;
    console.log('logged out');
  }
});

function addQuote(data) {
  quoteRef.push({text: data.text,
                 created_at: data.created_at,
                 url: data.url},
    function(error) {
      if (error) {
        console.log(error);
      }
  });
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.text) {
      sendResponse({farewell: request.text});
      addQuote(request);
    }
    // google auth token from website
    /* else if (request.type && (request.type == 'auth_token')) {
      dataRef.auth(request.token, function(error, result) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Login Succeeded!");
          user = result.auth;
        }
      });
    } */
  });