module.controller('PostTaskController', function ($scope, $uibModalInstance, items) {

  $scope.forms = {
    login: true,
    inputs: {
      title: "",
      description: "",
      days: 0
    }
  }

  $scope.ok = function () {
    //$uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});