var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Users', function($http, $window){
    return {
        getAll : function(p) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl + '/users');
        },
        get: function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl + '/users/' + id);
        },
        create: function(data) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl + '/users', data);
        },
        delete: function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl + '/users/' + id);
        },
        update: function(id, data) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.put(baseUrl + '/users/' + id, data);
        }
    };
});

mp4Services.factory('Tasks', function($http, $window) {
    return {
        getAll : function(params) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl + '/tasks', {
                params: params
            });
        },
        get: function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl + '/tasks/' + id);
        },
        create: function(data) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl + '/tasks', data);
        },
        complete: function(id, data) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.put(baseUrl + '/tasks/' + id, data);
        },
        delete: function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl + '/tasks/' + id);
        },
        update: function(id, data) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.put(baseUrl + '/tasks/' + id, data);
        }
    };
});
