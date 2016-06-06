module.directive('initialisation',['$rootScope',function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope) {
            var to;
            var listener = $scope.$watch(function() {
                clearTimeout(to);
                to = setTimeout(function () {
                    console.log('initialised');
                    listener();
                    $rootScope.$broadcast('initialised');
                }, 50);
            });
        }
    };
}]);