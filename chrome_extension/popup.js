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

  chrome.extension.getBackgroundPage().auth.login('password', {
    email: email,
    password: password,
    rememberMe: true,
    debug: true
  });
}

document.getElementById("submit").addEventListener('click', login, false);