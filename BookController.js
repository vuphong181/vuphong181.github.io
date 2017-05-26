app.controller('bookCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
    console.log('bookCtrl loaded...');
    var root = 'https://green-web-bookstore.herokuapp.com';
     $scope.getBooks = function() {
        $http.get(root + '/api/books').success(function(response) {
            $scope.myBook = response.data;
        });
    }
     $scope.getGenres = function() {
        $http.get(root + '/api/genres').success(function(response) {
            $scope.genres = response;
        });
    }