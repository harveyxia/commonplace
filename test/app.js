var dataRef = new Firebase('https://popping-fire-7822.firebaseio.com');
var app = angular.module('app', ['firebase']);




// SimpleLogin
app.controller('loginController', ['$rootScope', '$scope', '$firebase', '$firebaseSimpleLogin',
  function($rootScope, $scope, $firebase, $firebaseSimpleLogin) {

    $scope.auth = $firebaseSimpleLogin(dataRef);

    $scope.login = function() {
      $scope.auth.$login('password', {
          email: $scope.loginEmail,
          password: $scope.loginPassword
        }).then(function(user) {
          $rootScope.$broadcast('loginEvent');
          $scope.loginMessage = 'Logged in as: ' + user.uid;
        }, function(error) {
          $scope.loginMessage = 'Login failed: ' + error;
        });
    };

    $scope.logout = function() {
      $scope.auth.$logout();
      $rootScope.$broadcast('logoutEvent');
    };

  }
]);

// retrieves quotes
app.controller('quoteController', ['$rootScope','$scope', '$firebase', '$firebaseSimpleLogin',
  function($rootScope, $scope, $firebase, $firebaseSimpleLogin) {

    $scope.auth = $firebaseSimpleLogin(dataRef);

    var getQuotes = function() {
      $scope.auth.$getCurrentUser().then(function(user) {
        if (user) {
          var userRef = new Firebase('https://popping-fire-7822.firebaseio.com/users/' +
            user.uid + '/quotes');
          $scope.quotes = $firebase(userRef);
        };
      }, function(error) {
        console.log(error);
      });
    };
    
    getQuotes();

    $scope.$on('logoutEvent', function() {
      $scope.quotes = null;
    });
    $scope.$on('loginEvent', function() {
      getQuotes();
    });
  }
]);