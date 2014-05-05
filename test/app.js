var myApp = angular.module('myApp', ['firebase', ]);

myApp.controller('myController', ['$scope', '$firebase',
  function($scope, $firebase) {
    var ref = new Firebase("https://popping-fire-7822.firebaseio.com/users/simplelogin%3A2/quotes");
    $scope.quotes = $firebase(ref);
  }
]);