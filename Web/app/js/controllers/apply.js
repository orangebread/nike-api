module.controller('ApplyModalController', function ($scope, $uibModalInstance, items, $localStorage, $http) {

  $scope.forms = {
    login: true,
    inputs: {
      title: "",
      description: "",
      days: 0
    }
  }

  $scope.apply = function () {

    function success(response){
      console.log(response);
      // if logged in successfully
      if(response.data.success)
      {
        $scope.openNewThread();
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
      job_id: $localStorage.currentJobId,
      employer_id: $localStorage.currentEmployerId,
      message: $scope.forms.inputs.description
    }

    $http({
      method: 'POST',
      url: API_BASE_URL+"job/application",
      data: dataParams
    }).then(success, error);
  };

  $scope.openNewThread = function(){

    function success(response){
      console.log(response);
    }

    function error(response){
      //alert("Something went wrong.")
    }

    dataParams = {
      message: $scope.forms.inputs.description,
      employer_id: $localStorage.currentEmployerId,
    }

    $http({
      method: 'POST',
      url: API_BASE_URL+"message/new",
      data: dataParams
    }).then(success, error);
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});