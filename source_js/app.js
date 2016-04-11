var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/user', {
      templateUrl: 'partials/userlist.html',
      controller: 'UserController'
    }).
    when('/user/:userId', {
      templateUrl: 'partials/user.html',
      controller: 'UserDetailsController'
    }).
    when('/user/add', {
      templateUrl: 'partials/addUser.html',
      controller: 'UserCreateController'
    }).
    when('/task', {
      templateUrl: 'partials/tasklist.html',
      controller: 'TaskController'
    }).
    when('/settings', {
      templateUrl: 'partials/settings.html',
      controller: 'SettingsController'
    }).
    otherwise({
      redirectTo: '/settings'
    });
}]);
