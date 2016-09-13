module.controller('PostTaskController', function ($scope, $uibModalInstance, items, $http) {

  $scope.forms = {
    login: true,
    inputs: {
      title: "",
      description: "",
      budget: 0
    },
    showSpinner: false
  }

  $scope.postTask = function () {
    $(".hourly-modal .spinner").height($(".modal-dialog").height());
    $scope.forms.showSpinner = true;

    function success(response){
      $scope.forms.showSpinner = false;
      // if logged in successfully
      if(response.data.success)
      {
        $uibModalInstance.dismiss('cancel');
      }
      else
      {
        alert("Please fill out all inputs");
      }
    }

    function error(response){
      $scope.forms.showSpinner = false;
      alert("Something went wrong.")
    }

    dataParams = {
      title: $scope.forms.inputs.title,
      description: $scope.forms.inputs.description,
      budget: $scope.forms.inputs.budget
    }

    $http({
      method: 'POST',
      url: API_BASE_URL+"job",
      data: dataParams
    }).then(success, error);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});