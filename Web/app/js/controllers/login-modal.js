module.controller('LoginModalController', function ($scope, $uibModalInstance, items) {

  $scope.forms = {
    login: true,
    inputs: {
      email: "",
      password: "",
      password_conf: ""
    }
  }

  $scope.ok = function () {
    //$uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});