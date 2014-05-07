var dataRef = new Firebase('https://popping-fire-7822.firebaseio.com');
var app = angular.module('app', ['ngRoute','firebase', 'ngAnimate', 'waitForAuth']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.when('/',  {templateUrl: 'home.html', controller: '' });
  $routeProvider.when('/account',  {templateUrl: 'account.html', controller: 'accountController'});
  $routeProvider.when('/contact',  {templateUrl: 'contact.html', controller: ''});

  // $locationProvider.html5Mode(true); // remove '#' from URLs
}]);

// views controller
app.controller('viewsController', ['$scope', '$location',
  function($scope, $location) {
    $scope.changeView = function(view) {
      $location.path(view)
    };
  }]);


// account controller
app.controller('accountController', ['$rootScope', '$scope', '$firebase', '$firebaseSimpleLogin',
  function($rootScope, $scope, $firebase, $firebaseSimpleLogin) {

    $scope.auth = $firebaseSimpleLogin(dataRef);

    $scope.login = function() {
      $scope.auth.$login('password', {
          email: $scope.loginEmail,
          password: $scope.loginPassword
        }).then(function(user) {
          getQuotes();
          $scope.loginMessage = 'Logged in as: ' + user.uid;
        }, function(error) {
          $scope.loginMessage = 'Login failed: ' + error;
        });
    };

    $scope.logout = function() {
      $scope.auth.$logout();
      $scope.quotes = null;
    };

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
  }
]);