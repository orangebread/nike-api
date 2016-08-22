module.controller('MerchantSignUpController', function ($scope, $uibModalInstance, items, $http) {

  $scope.forms = {
    login: true,
    inputs: {
      title: "",
      description: "",
      budget: 0
    }
  }

  $scope.signUp = function(){
  	
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});