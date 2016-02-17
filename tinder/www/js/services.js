

angular.module('starter.services', ['ngStorage'])

    .factory('Profils', function($http, $rootScope) {

      var result = {
        all: function() {
          return $http.get($rootScope.api+"/user");

        },
        getDetailAll: function(id_card) {
          return $http({
            url: $rootScope.api+"/user",
            method: "GET",
            params: {id: id_card }
          });
        }
      }
      return result;
    })
    .factory('Instagrams', function($http) {

      var result = {
        get: function(access_token, userid) {
          //path = "https://api.instagram.com/v1/media/popular?client_id=98d56a68eb2442128c660bb918333d28&callback=JSON_CALLBACK";
          path = "https://api.instagram.com/v1/users/" + userid + "/media/recent/?client_id=" + access_token;
                  //https://api.instagram.com/v1/users/245613632/media/recent/?client_id=98d56a68eb2442128c660bb918333d28
          return $http.jsonp(path);

        }
      }
      return result;
    })
   .factory('Pictures', function($http, $rootScope) {

      var result = {
        all: function() {
          //return $http.get("http://thecatapi.com/api/images/get?format=src&type=gif");
           return $http.jsonp("http://thecatapi.com/api/images/get?format=src&type=gif")
        }
      }
      return result;
    })
    .factory('Users', function($http, $rootScope) {

      var result = {
        subscribe: function(datas) {
          return $http({
            url: $rootScope.api+"/user",
            method: "POST",
            params: datas
          });
        },
        deleteOneUser: function (id_auth) {
          return $http({
            url: $rootScope.api+"/user",
            method: "DELETE",
            params: {id : id_auth}
          });
        }
      }
      return result;
    })
    .factory('Cards', function($http, $rootScope) {

      var result = {
        dislike: function(id_auth, id_card) {
          return $http({
            url: $rootScope.api+"/dislike",
            method: "POST",
            params: {owner: id_auth, target: id_card}
          });
        },
        getDislike: function(id_auth) {
          return $http({
            url: $rootScope.api+"/user",
            method: "GET",
            params: {id: id_auth}
          });
        },
        like: function(id_auth, id_card) {
          return $http({
            url: $rootScope.api+"/like",
            method: "POST",
            params: {owner: id_auth, target: id_card}
          });
        },
        getLike: function(id_auth) {
          return $http({
              url: $rootScope.api+"/user",
              method: "GET",
              params: {id: id_auth}
          });
        },
        /*      Supprimer 1 seul favoris         */
        deleteLike: function(id_like) {
          return $http({
            url: $rootScope.api+"/like/delete",
            method: "DELETE",
            params: {id : id_like}
          });
        },
        /*      Supprimer 1 seul black list         */
        deleteDislike: function(id_like) {
          return $http({
            url: $rootScope.api+"/dislike/delete",
            method: "DELETE",
            params: {id : id_like}
          });
        },
        /*      Supprimer Tout les favoris         */
        deleteLikeAll: function (id_auth) {
          return $http({
            url: $rootScope.api+"/like/deleteByAll",
            method: "DELETE",
            params: {id_auth : id_auth}
          });
        },
        /*      Supprimer Tout les black lists         */
        deleteDislikeAll: function (id_auth) {
          return $http({
            url: $rootScope.api+"/dislike/deleteByAll",
            method: "DELETE",
            params: {id_auth : id_auth}
          });
        }
        
      }
      return result;
    })
    .factory('Logins', function($http, $rootScope){

      var result = {
        login : function(username, password)
        {
          return $http({
            url: $rootScope.api+"/login",
            method: "POST",
            params: {username: username, password:password}
          });
        }
      }
      return result;
    })
    .factory('Auth', function($http, $rootScope, $sessionStorage){
      var result = {
        // isLogged : function()
        // {
        //   return $http({
        //     url: $rootScope.api+"/isLogged",
        //     method: "POST",
        //     params: {token: $sessionStorage.token}
        //   });
        // },
        me : function(token)
        {
          return $http({
            url: $rootScope.api+"/user",
            method: "GET",
            params: {token: token}
          });
        },
        meEdit : function(datas)
        {
          return $http({
            url: $rootScope.api+"/user/edit",
            method: "PUT",
            params: datas
          });
        },
        meEditImg : function(datas)
        {
          return $http({
            url: $rootScope.api+"/edit/image",
            method: "PUT",
            params: datas
          });
        }
      }
      return result;
    });

