var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('UserController', ['$scope', '$http', '$window', 'Users', 'Tasks',
  function($scope, $http, $window, Users, Tasks) {

    if (!$window.sessionStorage.baseurl) {
      alert("API URL not set")
    } else {
      update();

      function update() {
        Users.get().success(function(data) {
          $scope.users = data.data;
        }).error(function(e) {alert(e)});
      }

      $scope.deleteUser = function(id) {

        Users.delete(id).success(function(data) {
          Tasks.get({where: {
              assignedUser: id,
              completed: false
            }
          }).success(function(data) {
            var tasks = data.data;
            var success = true;

            for (var t in tasks) {
              t.assignedUser = '';
              t.assignedUserName = 'unassigned';

              var update = Tasks.update(t._id,t).error(
                  function(data) {
                    success = false;
                  });

              if (success) {
                alert("Delete successful!")
              } else {
                alert("* Fail to update all tasks")
              }
            }

          }).error(function(e) {alert("* Fail to get related tasks")});

        }).error(function(e) {alert("* Delete failed")});
      };
    }
  }
]);

mp4Controllers.controller('TaskController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";

  $scope.getData = function(){
    $scope.data = CommonData.getData();

  };

}]);


mp4Controllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });


}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set: " + $window.sessionStorage.baseurl;

  };

}]);
