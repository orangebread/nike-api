module.controller('LoginModalController', function ($scope, $uibModalInstance, items, $localStorage, $rootScope) {

  $scope.forms = {
    login: true,
    inputs: {
      email: "",
      password: "",
      password_conf: ""
    }
  }

  $scope.login = function () {
    $localStorage.userId = 1;
    $rootScope.$broadcast('loggedIn');
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});