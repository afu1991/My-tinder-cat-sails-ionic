angular.module('starter.controllers', ['ionic', 'ionic.contrib.ui.tinderCards','ngStorage','flash'])

    .directive('noScroll', function() {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                $element.on('touchmove', function (e) {
                    e.preventDefault();
                });
            }
        }
    })
    .filter('range', function() {
        return function(input, start, end) {
            start = parseInt(start);
            end = parseInt(end);
            var direction = (start <= end) ? 1 : -1;
            while (start != end) {
                input.push(start);
                start += direction;
            }
            return input;
        };
    })
  
    .controller('CatprofilCtrl', function($scope, $sessionStorage, Profils, Auth, Cards, $state) {
        $scope.cards = [];
        $scope.numbers = [];
        Auth.me($sessionStorage.token).success(function(datas){
                $scope.likedlists = datas[0].liked;
                Profils.all().success(function(datase){
                     angular.forEach($scope.likedlists, function(values, key) {
                   
                     $scope.numbers.push(angular.extend({}, values));  
                     //console.log($scope.numbers);                         
                     });      
                });

        }).error(function(datas){
            console.log(datas);
        });
        Auth.isLogged().success(function(datas){
         //   console.log(datas);
            $scope.profils = datas;
           // $state.go("home.index");

        }).error(function(datas){
            console.log('erreur cat profil')
            $state.go('connexion', {}, {reload: true, inherit: false});
        });
        Profils.all().success(function(datas){
            $scope.addCard = function(i) {
                var newCard = datas[Math.floor(Math.random() * datas.length)];
                //newCard.id = Math.random();
                $scope.cards.push(angular.extend({}, newCard));
            }
            for(var i = 0; i < datas.length; i++) $scope.addCard();
          
        }).error(function(){
            console.log('error')
        });

        $scope.cardSwipedLeft = function(index) {
            var auth_id = $scope.profils.id;
            var user_id = $scope.cards[index].id;
            Cards.dislike(auth_id, user_id).success(function(data){
    

            }).error(function(data){
                console.log('error');
            });
         
        }
        $scope.cardSwipedRight = function(index) {
            var auth_id = $scope.profils.id;
            var user_id = $scope.cards[index].id;
            Cards.like(auth_id, user_id).success(function(data){

            }).error(function(data){
                console.log('error');
            });
        }
        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        }
        $scope.checkCards = function(index) {
          
        }
    })
    .controller('UserProfilCtrl', function($scope, $state, $stateParams, Profils) {
        /* Recuperer id du route */
        var show_id = $stateParams.id; 
        Profils.getDetailAll(show_id).success(function(datas){
            $scope.items = datas;
        });
    })

    .controller('loginCtrl',function($scope, Logins, $timeout, $ionicLoading, $sessionStorage, $location, $state, $window, Auth, Flash) {
            Auth.isLogged().success(function(datas){
                $scope.profils = datas;
                //$state.go("home.index");
            }).error(function(data){

            });
          
        $scope.login = function(username, password) {  
            Logins.login(username, password).success(function(datas){
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                $timeout(function () {
                    $sessionStorage.token = datas.token;
                    $sessionStorage.auth_profil = datas.auth_profil;
                    //console.log(datas)
                    $ionicLoading.hide();
                    $state.go("home.index");
                    var message = '<strong>Bienvenue ' + datas.auth_profil.firstname + ' !</strong>';
                    Flash.create('success', message);
                }, 2000);
            }).error(function(data){
                var message = '<strong>'+data.error+'</strong>';
                Flash.create('danger', message);
            });
        };
    })
    .controller('HomeCtrl',function($scope, $ionicPopup, $timeout, $ionicLoading, $state, $sessionStorage, Auth, $http) {
         Auth.isLogged().success(function(datas){ 
                if (datas.username == 'admin') {
                    $scope.isAdmin = function() {
                        return true;
                    };
                }
            });
        $scope.disconnect = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Deconnexion',
                template: 'Etes vous sur de vouloir quitter l\'application'
            });
            $('.popup').css('background-color', 'white');
            confirmPopup.then(function(res) {
                if(res) {
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    $timeout(function () {

                        delete $sessionStorage.token;
                        delete $sessionStorage.auth_profil;
                        $ionicLoading.hide();
                        $state.go("connexion");
                    }, 2000);
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        };

    })
    .controller('DislikeCtrl',function($scope, Cards, Auth, Profils, $sessionStorage, $ionicPopup, Flash) {
        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true;
        var id_auth = $sessionStorage.auth_profil.id;
        $scope.items = [];
        $scope.pageTitle = "Black List  <button class=\"button button-clear button-assertive icon-size\"><i class=\"fa fa-ban\"></i></button>";
        Auth.isLogged().success(function(datas){
            Cards.getDislike(datas.id).success(function(datas){
                angular.forEach(datas.disliked, function(value, key) {
                    Profils.getDetailAll(value.target).success(function (datas) {
                        $scope.items.push(angular.extend({}, datas));
                    });
                });
            }).error(function(data){
                console.log('error');
            });

        }).error(function(data){
            console.log('You are not logged');
            $state.go('connexion', {}, {reload: true, inherit: false});
        });

        $scope.deleteCards = function($index){
            angular.forEach($scope.items[$index].being_disliked, function(value, key) {
                if(value.owner == id_auth && value.target == $scope.items[$index].id){
                    console.log('delete reponse ok gha');
                    console.log(value.id);
                    Cards.deleteDislike(value.id).success(function(datas){
                        console.log('requete succes.');

                    });
                }
            });

            $scope.items.splice($index, 1);
        }

        $scope.deleteAll = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Supprimer',
                okType:'button-assertive',
                template: 'Etes vous sur de vouloir tout supprimer'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    Cards.deleteDislikeAll(id_auth).success(function(datas){
                        console.log('success')
                        $scope.items.splice(0, $scope.items.length);
                        var message = '<strong>' +datas.success + ' !</strong> ';
                        Flash.create('success', message);
                    }).error(function(data){
                        console.log('error');
                    });
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        }
    })
    .controller('LikeCtrl',function($scope, Cards, Auth, Profils, $sessionStorage, $ionicListDelegate, $window, $ionicPopup, Flash) {
        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true;
        var id_auth = $sessionStorage.auth_profil.id;
        $scope.items = [];
        $scope.pageTitle = "Favoris <i class=\"ion-heart icon-size\"></i>";
        Auth.isLogged().success(function(datas){
            Cards.getLike(datas.id).success(function(datas){
                angular.forEach(datas.liked, function(value, key) {

                    Profils.getDetailAll(value.target).success(function (datas) {
                        $scope.items.push(angular.extend({}, datas));

                    });
                });

            }).error(function(data){
                console.log('error');
            });

        }).error(function(data){
            console.log('You are not logged');
            $state.go('connexion', {}, {reload: true, inherit: false});
        });

        $scope.deleteCards = function($index){
            angular.forEach($scope.items[$index].being_liked, function(value, key) {
                if(value.owner == id_auth && value.target == $scope.items[$index].id){
                    Cards.deleteLike(value.id).success(function(datas){
                     });
                }
            });
            $scope.items.splice($index, 1);
        }

        $scope.deleteAll = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Supprimer',
                okType:'button-assertive',
                template: 'Etes vous sur de vouloir tout supprimer'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    Cards.deleteLikeAll(id_auth).success(function(datas){
                        $scope.items.splice(0, $scope.items.length);
                        var message = '<strong>' +datas.success + ' !</strong> ';
                        Flash.create('success', message);
                    }).error(function(data){
                        console.log('error');
                    });
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        }
        $scope.share = function(items) {
            console.log(items.id)
        }
    })
    .controller('subscribeCtrl',function($scope, Users, Flash, $state) {
        $scope.datas = {};
      
        $scope.subscribe = function() {
            this.datas.token ="" ;
            this.datas.image = "http://thecatapi.com/api/images/get?format=src&type=gif";
            Users.subscribe(this.datas).success(function(datas){
     
                var message = '<strong>Votre compte a été crée avec succes !</strong>';
                Flash.create('success', message);
                $state.go("connexion");
            }).error(function (datas) {
                var errorsMessage = "Veuillez bien remplir tout les champs";
                Materialize.toast(errorsMessage, 3000)
  
            })

        }
    })
    .controller('AdminCtrl',function($scope, Users, Flash, Profils, $state, Pictures) {
       $scope.pageTitle = "Admins";
       $scope.shouldShowDelete = false;
       $scope.shouldShowReorder = false;
       $scope.listCanSwipe = true;
       $scope.items = [];
        Profils.all().success(function(datas){
           console.log(datas)   
           $scope.items = datas;
        }).error(function(){
            console.log('error')
        });
        $scope.deleteCards = function($index){
            Users.deleteOneUser($scope.items[$index].id).success(function(datas){});
            $scope.items.splice($index, 1);
        }
        
        $scope.addUser = function() {
            console.log(this.datas);
            this.datas.token ="" ;
            this.datas.passwordconfirm = this.datas.password;
           // http://thecatapi.com/api/images/get?format=src&type=gif
            this.datas.image = "http://24.media.tumblr.com/tumblr_lzyx71zOyn1qafc06o1_500.jpg";
            Users.subscribe(this.datas).success(function(datas){
     
                var message = '<strong>Votre compte a été crée avec succes !</strong>';
                Flash.create('success', message);
                $state.go("home.admin");
            }).error(function (datas) {
                var errorsMessage = "Veuillez bien remplir tout les champs";
                Materialize.toast(errorsMessage, 3000)
  
            })

        }

    })
    .controller('ProfilCtrl',function($scope, Users, Flash, Profils, $state, Auth, $sessionStorage) {
     // var access_token = "98d56a68eb2442128c660bb918333d28";
     //    var userid = "245613632";
        // Instagrams.get(access_token, userid).success(function(data){
        //             console.log(data);
        //         })
            Auth.me($sessionStorage.token).success(function(data){
                    console.log(data);
                    $scope.items = data;
            });

    })
    .controller('ProfilEditCtrl',function($scope, Users, Flash, Profils, $state, Auth, $sessionStorage) {
        Auth.me($sessionStorage.token).success(function(data){
                $scope.items = data;
        });
        $scope.EditUserMe = function(){
            this.datas.password = $scope.items[0].password;
            this.datas.passwordconfirm = $scope.items[0].password;
            this.datas.token = $scope.items[0].token;
            this.datas.image = $scope.items[0].image;

            Auth.meEdit(this.datas).success(function(data){
                  var message = '<strong>Votre modification a été un success</strong>';
                    Flash.create('success', message);
                    $state.go("home.profil");
            });
        }

    })
    .controller('ProfilEditPicturesCtrl',function($scope, Users, Flash, Profils, $state, Auth, $sessionStorage) {
        $scope.images = [];
        
        Auth.me($sessionStorage.token).success(function(data){
            $scope.items = data;
    
        });
        for (var i = 1; i <= 9; i++) {
           $scope.images.push(angular.extend({},{path : "../img/chat/chat"+i+".jpg"}));
        };
        $scope.update = function($index){
           $scope.items[0].image = $scope.images[$index].path;
            Auth.meEditImg($scope.items[0]).success(function(data){
                  var message = '<strong>Votre modification a été un success</strong>';
                    Flash.create('success', message);
                    $state.go("home.profil");
            });
        }

    });

       

       