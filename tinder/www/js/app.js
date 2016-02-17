// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$rootScope) {

  $rootScope.api = "http://192.168.1.76:1337";



  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.hide();
    }
  });
})
  .directive('ngInitial', function() {
  return {
    restrict: 'A',
    controller: [
      '$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse) {
        var getter, setter, val;
        val = $attrs.ngInitial || $attrs.value;
        getter = $parse($attrs.ngModel);
        setter = getter.assign;
        setter($scope, val);
      }
    ]
  };
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider.state('connexion', {
    url: '/connexion',
    templateUrl: 'templates/connexion.html',
    controller: 'loginCtrl',
    // resolve: {
    //     getData: function (Auth) {
    //         return Auth.isLogged();
    //     }
    // }
  });

  $stateProvider.state('subscribe', {
    url: '/subscribe',
    templateUrl: 'templates/subscribe.html',
    controller: 'subscribeCtrl'
  });


  $stateProvider
      .state('home', {
        url: '/home',
        abstract: true,
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'

      })

      .state('home.index', {
          url: '/index',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home-index.html',
                  controller: 'CatprofilCtrl'
              }
          }
      })
      .state('home.show', {
          url: '/show?:id',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home-show.html',
                  controller: 'UserProfilCtrl'
              }
          }
      })
      .state('home.about', {
          url: '/about',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home-about.html'
              }
          }
      })
      .state('home.dislike', {
          url: '/dislike',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home-dislike.html',
                  controller: 'DislikeCtrl'
              }
          }
      })
      .state('home.like', {
          url: '/like',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home-like.html',
                  controller: 'LikeCtrl'
              }
          }

      })
      .state('home.admin', {
          url: '/admin',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home-admin.html',
                  controller: 'AdminCtrl'
              }
          }

      })
      .state('home.add', {
          url: '/add/user',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home-add-user.html',
                  controller: 'AdminCtrl'
              }
          }

      })
      .state('home.profil', {
          url: '/profil/me',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home-profil.html',
                  controller: 'ProfilCtrl'
              }
          }

      })
      .state('home.profilEdit', {
          url: '/profil/me/edit',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home-profil-edit.html',
                  controller: 'ProfilEditCtrl'
              }
          }
      })
      .state('home.profilEditPictures', {
          url: '/me/edit/pictures',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home-profil-edit-pictures.html',
                  controller: 'ProfilEditPicturesCtrl'
              }
          }

      });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/connexion');

});
