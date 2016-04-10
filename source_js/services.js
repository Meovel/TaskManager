var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Users', function($http, $window){
    return {
        get : function(params) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl + '/tasks');
        },
        create: function(data) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl + '/users', data);
        },
        getOne: function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl + '/users/' + id);
        },
        update: function(id, data) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.put(baseUrl + '/users/' + id, data);
        },
        delete: function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl + '/users/' + id);
        }
    };
});

mp4Services.factory('Tasks', function($http, $window) {
    return {
        get : function(params) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl + '/tasks', {
                params: params
            });
        },
        create: function(data) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl + '/tasks', data);
        },
        getOne: function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl + '/tasks/' + id);
        },
        update: function(id, data) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.put(baseUrl + '/tasks/' + id, data);
        },
        delete: function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl + '/tasks/' + id);
        }
    };
});
