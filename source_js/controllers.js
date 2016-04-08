var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('UserController', ['$scope', '$http', '$q', '$window', 'Users', 'Tasks',
  function($scope, $http, $q, $window, Users, Tasks) {

    if ($window.sessionStorage.baseurl) {
      function getUsers() {
        Users.get().success(function(data) {
          $scope.users = data.data;
        }).error(function(e) {alert(e)});
      }
      getUsers();

      $scope.deleteUser = function(id) {
        Users.delete(id).success(function(data) {
          Tasks.get({
            where: {
              assignedUser: id,
              completed: false
            }
          }).success(function(data) {
            var updates = [];
            var numSuccess = 0;
            var numError = 0;
            var incompleteTasks = data.data;
            angular.forEach(incompleteTasks, function(task) {
              var unassignedTask = task;
              unassignedTask.assignedUser = '';
              unassignedTask.assignedUserName = 'unassigned';

              var update = Tasks.update(
                  unassignedTask._id,
                  unassignedTask
              ).success(function(data) {
                numSuccess++;
              }).error(function(data) {
                numError++;
              });
              updates.push(update);
            });
            $q.all(updates).then(function(data) {
              if (numSuccess > 0)
                alert('success', 'Successfully update ' + numSuccess + ' tasks.');
              getUsers();
            }, function(data) {
              if (numSuccess > 0)
                alert('success', 'Successfully update ' + numSuccess + ' tasks.');
              if (numError > 0)
                alert('alert', 'Failed to update ' + numError + ' tasks.');
              alert('alert', 'Failed to update all pendingTasks.');
            });
          }).error(function(e) {alert(e)});
        }).error(function(e) {alert(e)});
      };
    } else {
      alert("API URL not set")
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
