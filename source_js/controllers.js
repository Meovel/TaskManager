var mp4Controllers = angular.module('mp4Controllers', []);

var checkAPI = function () {
  if (window.sessionStorage.baseurl) {
    return true
  } else {
    alert("API URL not set");
    return false
  }
}

// User related controller
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

          }).error(function(e) {alert(e.message)});

        }).error(function(e) {alert(e.message)});
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
          }).error(function(e) {alert(e.message)});
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
          }).error(function(e) {alert(e.message)});

        }).error(function(e) {alert(e.message)});
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
              }).error(function(e) {alert(e.message)});
            }
          }).error(function(e) {alert(e.message)});
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
        }).error(function(e) {alert(e.message)});
      }
    }
  }
]);


// Task related controller
mp4Controllers.controller('TaskController', ['$scope', '$http', '$window', 'Users', 'Tasks',
  function($scope, $http, $window, Users, Tasks) {
    if (checkAPI()) {
      update();
      $scope.currentPage = 0;
      $scope.perPage = 10;
      $scope.filterMode = 2;
      $scope.sort = 1;
      $scope.sortAtrs = ["Name", "User", "Date", "Deadline"];
      $scope.sortAtr = $scope.sortAtrs[0];

      $scope.nextPage = function() {
        $scope.currentPage = ($scope.currentPage + 1) % $scope.maxPage;
        update();
      };

      $scope.prevPage = function() {
        $scope.currentPage = ($scope.currentPage + $scope.maxPage - 1) % $scope.maxPage;
        update();
      };

      function update() {
        Tasks.getAll({where: $scope.filter, count: true}).success(function(data) {
          $scope.maxPage = Math.ceil(data.data / $scope.perPage);

          if ($scope.sortAtr === 'Name') {
            Tasks.getAll({
              where: $scope.filter,
              sort: {name: $scope.sort},
              skip: $scope.perPage * $scope.currentPage,
              limit: $scope.perPage
            }).success(function (data) {
              $scope.tasks = data.data;
            }).error(function (e) {
              alert(e.message)
            });
          } else if ($scope.sortAtr === 'User') {
            Tasks.getAll({
              where: $scope.filter,
              sort: {assignedUserName: $scope.sort},
              skip: $scope.perPage * $scope.currentPage,
              limit: $scope.perPage
            }).success(function (data) {
              $scope.tasks = data.data;
            }).error(function (e) {
              alert(e.message)
            });
          } else if ($scope.sortAtr === 'Date') {
            Tasks.getAll({
              where: $scope.filter,
              sort: {dateCreated: $scope.sort},
              skip: $scope.perPage * $scope.currentPage,
              limit: $scope.perPage
            }).success(function (data) {
              $scope.tasks = data.data;
            }).error(function (e) {
              alert(e.message)
            });
          } else {
            Tasks.getAll({
              where: $scope.filter,
              sort: {deadline: $scope.sort},
              skip: $scope.perPage * $scope.currentPage,
              limit: $scope.perPage
            }).success(function (data) {
              $scope.tasks = data.data;
            }).error(function (e) {
              alert(e.message)
            });
          }
        }).error(function(e) {alert(e.message)});
      }

      $scope.deleteTask = function(id, userId) {
        Tasks.delete(id).success(function(data) {
          if (userId) {

            Users.get(userId).success(function(data) {
              var user = data.data;
              var index = user.pendingTasks.indexOf(id);
              if (index !== -1) {
                user.pendingTasks.splice(index, 1);

                Users.update(userId, user).success(function(data) {
                  update();
                }).error(function(e) {alert(e.message)});
              }
            }).error(function(e) {alert(e.message)});
          } else {
            update();
          }
        }).error(function(e) {alert(e.message)});
      };

      $scope.$watch('filterMode', function(now, past) {
        if (now !== past) {
          if (now === '0') {
            $scope.filter = {}
          } else if (now === '1') {
            $scope.filter = { completed: true }
          } else {
            $scope.filter = { completed: false }
          }
          $scope.currentPage = 0;
          update();
        }
      });

      $scope.$watch('sortAtr', function(now, past) {
        if (now !== past) {
          $scope.currentPage = 0;
          update();
        }
      });

      $scope.$watch('sort', function(now, past) {
        if (now !== past) {
          $scope.currentPage = 0;
          update();
        }
      });
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


// Setting
mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set: " + $window.sessionStorage.baseurl;
  };
}]);
