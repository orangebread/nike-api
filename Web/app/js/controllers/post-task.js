module.controller('PostTaskController', function ($scope, $uibModalInstance, items, $http) {

  $scope.forms = {
    login: true,
    inputs: {
      title: "",
      description: "",
      budget: 0
    }
  }

  $scope.postTask = function () {

    function success(response){
      console.log(response);
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