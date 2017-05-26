
var app = angular.module("myApp",["ngRoute","ngCookies","textAngular","ui.bootstrap"]);
app.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl : "main.html",
		controller : "bookCtrl"
	})
	.when("/categories",{
		templateUrl : "categories.html",
		controller : "bookCtrl"
	})
	.when("/category/:id",{
		templateUrl : "categorybygenres.html",
		controller : "bookCtrl"
	})
	.when("/detail/:id",{ 
		templateUrl : "detail.html",
		controller : "bookCtrl"
	})
	.when("/search/:text",{ 
		templateUrl : "search.html",
		controller : "bookCtrl"
	})
	.when("/author/:name",{
		templateUrl : "author.html",
		controller : "bookCtrl"
	})
	.when("/admin",{
		templateUrl : "admin.html",
		controller : "bookCtrl"
	})
	.when("/admin/editbook/:id",{
		templateUrl : "editbook.html",
		controller : "bookCtrl"
	})
	.when("/tuychinh",{
		templateUrl : "tuychinh.html",
		controller : "bookCtrl"
	})
});
app.controller('bookCtrl', ['$scope', '$http', '$location', '$routeParams', '$cookieStore', 'uibDateParser', function($scope, $http, $location, $routeParams, $cookieStore, uibDateParser) {
  $scope.getBooks = function() {
        $http.get("https://green-web-bookstore.herokuapp.com/api/books").success(function(response) {
            $scope.books = response;
            $scope.paging();
        });
      }
   $scope.getBook = function() {
        var id = $routeParams.id;
        $http.get("https://green-web-bookstore.herokuapp.com/api/books/" + id).success(function(response) {
            $scope.book = response;
            $scope.book.createDate = new Date($scope.book.createDate);
            $scope.book.releaseDate = new Date($scope.book.releaseDate);
            var rateTotal = 0;
            $scope.book.comments.rate;
            for (var i = 0; i < $scope.book.comments.length; i++) {
                rateTotal += $scope.book.comments[i].rate
            }

          if (rateTotal == 0) {
                $scope.rateAvr = 5
            } else {
                $scope.rateAvr = rateTotal / $scope.book.comments.length;
            }
            var pre = $scope.book.previousPrice;
            sell = $scope.book.sellingPrice;
            $scope.sale = Math.ceil((pre - sell) * 100 / pre);
        });
    }

  $scope.getCategories = function() {
        $http.get("http://green-web-bookstore.herokuapp.com/api/genres").success(function(response) {
            $scope.categories = response;
        });
      }

  $scope.getCategory = function() {
       var id = $routeParams.id;
       $http.get("https://green-web-bookstore.herokuapp.com/api/books/genre/" + id).success(function(response) {
            $scope.books = response;
            $scope.genreName = function() {
             for (var i=0; i < $scope.categories.length; i++) {
             	if ($scope.categories[i]._id === $routeParams.id) {
             		return $scope.categories[i].name;
             		}
             	}
             }
            
             if ($scope.books.length > 0) {
             	$scope.unidentified = true;
             }
             else {$scope.unidentified = false;
             	   $scope.result = "Chưa có sách trong thể loại này";
             	 	} 
        });
      }

  $scope.getSearch = function() {
       $scope.text = $routeParams.text;
       $http.get("https://green-web-bookstore.herokuapp.com/api/books/search/" + $scope.text).success(function(response) {
            $scope.books = response;
        });
      }
  $scope.getAuthor = function() {
       $scope.text = $routeParams.name;
       $http.get("https://green-web-bookstore.herokuapp.com/api/books/author/" + $scope.text).success(function(response) {
            $scope.books = response;
        });
      }

      /** Carousel **/
  $scope.getBanners = function() {
        $http.get("https://green-web-bookstore.herokuapp.com/api/banners/").success(function(response) {
            $scope.banners = response;
            console.log($scope.getBannersrs);
        });
    }

  $scope.myInterval = 3000;

    $scope.activeBanner = 0;

  $scope.addBook = function() {
       console.log($scope.book);
       $http.post("https://green-web-bookstore.herokuapp.com/api/books", $scope.book).success(function(response) {
           window.location.href = '#/books';
        });
    }

   $scope.updateBook = function() {
        var id = $routeParams.id;
        $http.put("https://green-web-bookstore.herokuapp.com/api/books/" + id, $scope.book).success(function(response) {
            window.location.href = '#/books/' + $routeParams.id;
        });
    }

   $scope.removeBook = function(id) {
        $http.delete("https://green-web-bookstore.herokuapp.com/api/books/" + id).success(function(response) {
            window.location.href = '#/books';
        });
    }
    $scope.loadLogin = function () {
            var token = $cookieStore.get('token');
            if (token !== undefined) {
            	
            }
        }

    $scope.logOut = function () {
            $cookieStore.remove('token');
            $cookieStore.remove('user');
        }

    $scope.viewProfile = function () {
            var token = $cookieStore.get('token');
            if (token === undefined) {
                $location.url("/login")
            }
        }
    $scope.comment = {};
	$scope.addComment = function (post) {
            $scope.comment.userId = $scope.user._id;
            $scope.comment.bookId = post._id;
            console.log($scope.comment);
            $http.post("https://green-web-bookstore.herokuapp.com/api/books/comment", $scope.comment).success(function(response) {
            	$scope.getBook();
            });
            console.log(post);
        }
    $scope.paging = function() {

       $scope.totalItems = $scope.books.length;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 3;
        $scope.maxSize = 5;
        $scope.changePage = function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;

           $scope.filteredBooks = $scope.books.slice(begin, end);
        };
        $scope.changePage();
    }    
    /** Datepicker **/
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };
    $scope.popup1 = {
        opened: false
    };
    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };
    $scope.popup2 = {
        opened: false
    };
    
    /** Login **/
   $scope.summitLogin = function () {
            $http.post('https://green-web-bookstore.herokuapp.com/api/users/auth', $scope.loginUser).success(function (response) {
                var isSuccess = response.success;
                if (isSuccess) {
                    $cookieStore.put('token', response.token);
                    $cookieStore.put('user', response.user);
                    $scope.user = $cookieStore.get('user');
                    $scope.token = $cookieStore.get('token');
                    //Redirect here
                } else {
                    //Raise Error
                    alert(response.message);
                }
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
            });;
        }

   $scope.summitSignup = function () {
            $http.post('https://green-web-bookstore.herokuapp.com/api/users/signup/', $scope.signUpUser).success(function (response) {
                var isSuccess = response.success;
                if (isSuccess) {
                    $cookieStore.put('token', response.token);
                    $cookieStore.put('user', response.user);
                    $scope.user = $cookieStore.get('user');
                    $scope.token = $cookieStore.get('token');
                    //Redirect here
                    $location.url("/")
                } else {
                    //Raise Error
                    alert(response.message);
                }
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
            });
        }

   $scope.init = function () {
            $scope.user = $cookieStore.get('user');
            $scope.token = $cookieStore.get('token');
        }

   $scope.isLogged = function(){
            return $cookieStore.get('token') != undefined;
        } 
}]);


/* #####################################################################
   #
   #   Project       : Modal Login with jQuery Effects
   #   Author        : Rodrigo Amarante (rodrigockamarante)
   #   Version       : 1.0
   #   Created       : 07/29/2015
   #   Last Change   : 08/04/2015
   #
   ##################################################################### */
   
$(function() {
    
    var $formLogin = $('#login-form');
    var $formLost = $('#lost-form');
    var $formRegister = $('#register-form');
    var $divForms = $('#div-forms');
    var $modalAnimateTime = 300;
    var $msgAnimateTime = 150;
    var $msgShowTime = 2000;

    $("form").submit(function () {
        switch(this.id) {
            case "login-form":
                var $lg_username=$('#login_username').val();
                var $lg_password=$('#login_password').val();
                if ($lg_username == "ERROR") {
                    msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", "Đăng nhập thất bại");
                } else {
                    msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "success", "glyphicon-ok", "Đăng nhập thành công");
                }
                return false;
                break;
            case "lost-form":
                var $ls_email=$('#lost_email').val();
                if ($ls_email == "ERROR") {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "error", "glyphicon-remove", "Gửi thất bại");
                } else {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "success", "glyphicon-ok", "Gửi thành công");
                }
                return false;
                break;
            case "register-form":
                var $rg_username=$('#register_username').val();
                var $rg_email=$('#register_email').val();
                var $rg_password=$('#register_password').val();
                if ($rg_username == "ERROR") {
                    msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", "Đăng kí thất bại");
                } else {
                    msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "success", "glyphicon-ok", "Đăng kí thành công");
                }
                return false;
                break;
            default:
                return false;
        }
        return false;
    });
    
    $('#login_register_btn').click( function () { modalAnimate($formLogin, $formRegister) });
    $('#register_login_btn').click( function () { modalAnimate($formRegister, $formLogin); });
    $('#login_lost_btn').click( function () { modalAnimate($formLogin, $formLost); });
    $('#lost_login_btn').click( function () { modalAnimate($formLost, $formLogin); });
    $('#lost_register_btn').click( function () { modalAnimate($formLost, $formRegister); });
    $('#register_lost_btn').click( function () { modalAnimate($formRegister, $formLost); });
    
    function modalAnimate ($oldForm, $newForm) {
        var $oldH = $oldForm.height();
        var $newH = $newForm.height();
        $divForms.css("height",$oldH);
        $oldForm.fadeToggle($modalAnimateTime, function(){
            $divForms.animate({height: $newH}, $modalAnimateTime, function(){
                $newForm.fadeToggle($modalAnimateTime);
            });
        });
    }
    
    function msgFade ($msgId, $msgText) {
        $msgId.fadeOut($msgAnimateTime, function() {
            $(this).text($msgText).fadeIn($msgAnimateTime);
        });
    }
    
    function msgChange($divTag, $iconTag, $textTag, $divClass, $iconClass, $msgText) {
        var $msgOld = $divTag.text();
        msgFade($textTag, $msgText);
        $divTag.addClass($divClass);
        $iconTag.removeClass("glyphicon-chevron-right");
        $iconTag.addClass($iconClass + " " + $divClass);
        setTimeout(function() {
            msgFade($textTag, $msgOld);
            $divTag.removeClass($divClass);
            $iconTag.addClass("glyphicon-chevron-right");
            $iconTag.removeClass($iconClass + " " + $divClass);
  		}, $msgShowTime);
    }
});

/**Pagination js**/


