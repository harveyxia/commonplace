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
app.controller('accountController', ['UserService', '$rootScope', '$scope', '$firebase', '$firebaseSimpleLogin', '$timeout',
  function (UserService, $rootScope, $scope, $firebase, $firebaseSimpleLogin, $timeout) {
    $scope.auth = $firebaseSimpleLogin(dataRef);
    $scope.user = null;
    var url = '';
    var userRef = null;

    // listen for when user logs in and out, syncs navbar and content ctrl instances
    $scope.$on('updated', function () {
      $scope.loginForm = UserService.user;
    })

    var getCurrentUser = function() {
      $scope.auth.$getCurrentUser().then(function (user) {
        UserService.user = user;
        if (user) {
          $scope.user = user;
          url = 'https://popping-fire-7822.firebaseio.com/users/' +
                 $scope.user.uid + '/quotes';
          userRef = $firebase( new Firebase(url) );
          $scope.quotes = userRef;    // get the quotes
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
          password: $scope.loginPassword,
          rememberMe: true
        }).then(function(user) {
          UserService.update(false);
          // $scope.user = user;
          getCurrentUser();
        }, function(error) {
          console.log(error);
        });
    };

    $scope.createUser = function() {
      $scope.auth.$createUser($scope.loginEmail, $scope.loginPassword)
      .then(function(user) {
          UserService.update(false);
          // $scope.user = user;
          getCurrentUser();
        }, function(error) {
          console.log(error);
        });
    }

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

    $scope.submitQuote = function() {
      if ($scope.newQuote) {
        userRef.$add(
          {text: $scope.newQuote,
           url: '',
           created_at: Date.now()}
           ).then(function (ref) {
            $scope.successMessage = 'Quote added!';
            $('#quote-area').val('');
            $timeout(function () { $scope.successMessage = ''; }, 3000);
          });
      } else {
        $scope.failMessage = 'Quote cannot be empty!';
        $timeout(function () { $scope.failMessage = ''; }, 3000);
      }
    }

    $scope.deleteQuote = function (key) {
      userRef.$remove(key);
    };

    $scope.editQuote = function (key) {
      var quoteURL = url + '/' + key;
      var quoteRef = $firebase( new Firebase(quoteURL) );

      $('#' + key).attr('contenteditable', 'true');
      $('#' + key).focus();
      $('#' + key).blur(function () {
        $(this).attr('contenteditable', 'false');
        var new_text = $(this).text();
        quoteRef.$update({text: new_text});
      });
      // var quoteHtml = $('#' + key).html();
      // var editableText = $('<textarea />');
      // editableText.val(quoteHtml);
      // $('#' + key).replaceWith(editableText);
      // editableText.focus();

      // quoteRef.$update({text: 'This has been updated'});
    }
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