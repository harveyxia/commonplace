var dataRef = new Firebase('https://popping-fire-7822.firebaseio.com');
var app = angular.module('app', ['ngRoute','firebase', 'ngAnimate']);

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

    // Wait until content loads, and user loads, before loading content
    $scope.$watch('$viewContentLoaded', function() {
        $scope.auth.$getCurrentUser().then(function(user) {
          if (user) {
            getQuotes(user);
            $scope.loginForm = false;
          } else {
            $scope.loginForm = true;
          }
        }, function(error) {
          console.log(error);
        });
      });

    $scope.login = function() {
      $scope.auth.$login('password', {
          email: $scope.loginEmail,
          password: $scope.loginPassword
        }).then(function(user) {
          getQuotes(user);
          $scope.loginForm = false;
          
        }, function(error) {
          
        });
    };

    $scope.logout = function() {
      $scope.auth.$logout();
      $scope.quotes = null;
      $scope.loginForm = true;
    };

    var getQuotes = function(user) {
      var userRef = new Firebase('https://popping-fire-7822.firebaseio.com/users/' +
        user.uid + '/quotes');
      $scope.quotes = $firebase(userRef);
    };
  }
]);