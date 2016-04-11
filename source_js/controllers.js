var mp4Controllers = angular.module('mp4Controllers', []);

var checkAPI = function () {
  if (window.sessionStorage.baseurl) {
    return true
  } else {
    alert("API URL not set");
    return false
  }
}

mp4Controllers.controller('UserController', ['$scope', '$http', '$window', 'Users', 'Tasks',
  function($scope, $http, $window, Users, Tasks) {
    if (checkAPI()) {
      update();

      function update() {
        Users.getAll().success(function(data) {
          $scope.users = data.data;
        }).error(function(e) {alert(e)});
      }

      $scope.deleteUser = function(id) {

        Users.delete(id).success(function(data) {
          Tasks.getAll({where: {
              assignedUser: id,
              completed: false
            }
          }).success(function(data) {
            var tasks = data.data;
            var success = true;

            for (var t in tasks) {
              t.assignedUserName = 'unassigned';
              t.assignedUser = '';

              var update = Tasks.update(t._id, t).error(
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

mp4Controllers.controller('UserCreateController', ['$scope', '$http', '$window', 'Users',
  function($scope, $http, $window, Users) {
    if (checkAPI()) {
      $scope.newUser = {name: '', email: ''};

      $scope.submitForm = function() {
          Users.create($scope.newUser).success(function(data) {
            alert(data.message);
          }).error(alert("Add user failed"));
      };
    }
  }
]);

mp4Controllers.controller('UserDetailsController', ['$scope', '$routeParams', '$http', '$window', 'Users', 'Tasks',
  function($scope, $routeParams, $http, $window, Users, Tasks) {
    if (checkAPI()) {
      update();
      var userId = $routeParams.userId;

      function update() {
        var userId = $routeParams.userId;
        Users.get(userId).success(function(data) {
          var userData = data.data;
          $scope.user = userData;
          $scope.tasks = userData.pendingTasks;
          $scope.completedTasks = [];

          Tasks.getAll({
            where: {_id: { $in: $scope.tasks }}
          }).success(function(data) {
            $scope.pendingTasks = data.data;
          })

        })
      }

      $scope.markAsComplete = function(taskId) {
        Tasks.get(taskId).success(function(data) {
          var task = data.data;
          task.completed = true;

          Tasks.complete(taskId, task).success(function(data) {
            var index = $scope.tasks.indexOf(taskId);
            if (index !== -1) {
              $scope.tasks.splice(index, 1);
              $scope.user.pendingTasks = $scope.tasks;
              Users.update(userId, $scope.user).success(function(data) {
                update();
              })
            }
          })
        })
      };

      $scope.getCompletedTasks = function() {
        Tasks.getAll({
          where: {
            assignedUser: userId,
            completed: true
          }
        }).success(function(data) {
          $scope.completedTasks = data.data;
        })
      }
    }
  }
]);


mp4Controllers.controller('TaskDetailsController', ['$scope', '$routeParams', '$http', '$window', 'Tasks',
  function($scope, $routeParams, $http, $window, Tasks) {
    if (checkAPI()) {
      Tasks.get($routeParams.taskId).success(function(data) {
        $scope.task = data.data;
      }).error(function(e) {alert(e.message)});
    }
  }
]);


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
