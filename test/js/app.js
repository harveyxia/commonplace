// global reference to Firebase
var dataRef = new Firebase('https://popping-fire-7822.firebaseio.com');
var app = angular.module('app', ['ngRoute','firebase', 'ngAnimate']);

// routing
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.when('/',  {templateUrl: 'home.html', controller: 'homeController' });
  $routeProvider.when('/account',  {templateUrl: 'account.html', controller: 'accountController'});
  $routeProvider.when('/contact',  {templateUrl: 'contact.html', controller: ''});
}]);

// getCurrentUser wrapper
app.service('UserService', ['$rootScope', '$firebaseSimpleLogin', function ($rootScope, $firebaseSimpleLogin) {
    // broadcast user state change to sync navbar and view account controllers
    this.update = function (val) {
      this.user = val;
      $rootScope.$broadcast('updated');
    }
  }]
);

// views controller
app.controller('viewsController', ['$scope', '$location',
  function ($scope, $location) {
    $scope.changeView = function(view) {
      $location.path(view)
  };
}]);


// account controller
app.controller('accountController', ['UserService', '$rootScope', '$scope', '$firebase', '$firebaseSimpleLogin',
  function (UserService, $rootScope, $scope, $firebase, $firebaseSimpleLogin) {
    $scope.auth = $firebaseSimpleLogin(dataRef);
    
    // listen for when user logs in and out, syncs navbar and content ctrl instances
    $scope.$on('updated', function () {
      $scope.loginForm = UserService.user;
    })

    var getCurrentUser = function() {
      $scope.auth.$getCurrentUser().then(function (user) {
        UserService.user = user;
        if (user) {
          getQuotes(user);
          $scope.loginForm = false;
        } else {
          $scope.loginForm = true;
        }
      }, function(error) {
        console.log(error);
      });
    };


    // Wait until content loads, and user loads, before loading content
    $scope.$watch('$viewContentLoaded', getCurrentUser());

    $scope.login = function() {
      $scope.auth.$login('password', {
          email: $scope.loginEmail,
          password: $scope.loginPassword
        }).then(function(user) {
          getQuotes(user);
          UserService.update(false);
        }, function(error) {
          
        });
    };

    // $scope.login = function() {
    //   $scope.auth.$login('google', {
    //     rememberMe: true,
    //   }).then(function(user) {
    //     getQuotes(user);
    //     UserService.update(false);
    //     window.postMessage({type: "auth_token", token: user.firebaseAuthToken}, "*");
    //   }, function(error) {
    //     console.log(error);
    //   });
    // };

    $scope.logout = function() {
      $rootScope.$broadcast('refresh');
      $scope.auth.$logout();
      $scope.quotes = null;
      // $scope.loginForm = true;
      UserService.update(true);
      // console.log($scope.loginForm)
    };

    $scope.getTime = function(time) {
      var date = new Date(time);
      return date.toLocaleDateString();
    };

    $scope.getDomain = function(url) {
      var domain = new URL(url).hostname;
      return domain;
    };

    var getQuotes = function(user) {
      var userRef = new Firebase('https://popping-fire-7822.firebaseio.com/users/' +
        user.uid + '/quotes');
      $scope.quotes = $firebase(userRef);
    };
  }
]);

// home controller
app.controller('homeController', ['$http', '$rootScope', '$scope', '$firebase', '$firebaseSimpleLogin',
  function ($http, $rootScope, $scope, $firebase, $firebaseSimpleLogin) {
    $http.get('quotes.json')
      .then(function(res) {
        var rand_index = Math.floor(Math.random()*res.data.length);
        $scope.exampleQuote = res.data[rand_index];
      });
  }
]);