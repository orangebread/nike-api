module.service('imageService',['$q','$http',function($q,$http){
    this.loadImages = function(){
        return $http.jsonp("https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=JSON_CALLBACK");
    };
}])

module.directive('search', function() {
	return {
	templateUrl: '../../templates/modules/search-list.html',
	controller: ['$scope', '$http', 'imageService', function($scope, $http, imageService) {
			imageService.loadImages().then(function(data){
	           $scope.pics = data.data.items;
	           
	        });;
		}]
	};
});