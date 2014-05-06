var dataRef = new Firebase('https://popping-fire-7822.firebaseio.com');
var myApp = angular.module('myApp', ['firebase']);


// SimpleLogin
myApp.controller('loginController', ['$scope', '$firebase', '$firebaseSimpleLogin',
  function($scope, $firebase, $firebaseSimpleLogin) {

    $scope.auth = $firebaseSimpleLogin(dataRef);

    $scope.login = function() {
      $scope.auth.$login('password', {
          email: $scope.loginEmail,
          password: $scope.loginPassword
        }).then(function(user) {
          // bind user to scope to make available to other controllers
          $scope.loginMessage = 'Logged in as: ' + user.uid;
        }, function(error) {
          $scope.loginMessage = 'Login failed: ' + error;
        });
    };
  }
]);

// retrieves quotes
myApp.controller('quoteController', ['$scope', '$firebase', '$firebaseSimpleLogin',
  function($scope, $firebase, $firebaseSimpleLogin) {

    $scope.auth = $firebaseSimpleLogin(dataRef);

    console.log($scope.auth.user);

    $scope.getQuotes = function() {
      var userRef = new Firebase('https://popping-fire-7822.firebaseio.com/users/' +
        $scope.auth.user.uid + '/quotes');
      $scope.quotes = $firebase(userRef);
      console.log($scope.auth.user.uid);
    };
  }
]);