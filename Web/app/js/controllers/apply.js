module.controller('ApplyModalController', function ($scope, $uibModalInstance, items, $localStorage, $http) {

  $scope.forms = {
    login: true,
    inputs: {
      bid: 0,
      description: ""
    },
    errors: {
      description: false
    },
    showSpinner: false
  }

  $scope.apply = function () {

    function success(response){
      $scope.forms.showSpinner = false;
      // if logged in successfully
      if(response.data.success)
      {
        $scope.openNewThread();
        $uibModalInstance.dismiss('cancel');
      }
      else
      {
        alert("You may have already applied to this job, you can only apply once.");
      }
    }

    function error(response){
      $scope.forms.showSpinner = false;
      alert("Something went wrong.")
    }

    dataParams = {
      job_id: $localStorage.currentJobId,
      employer_id: $localStorage.currentEmployerId,
      bid_amount:$scope.forms.inputs.bid,
      description: $scope.forms.inputs.description
    }

    if($scope.forms.inputs.description != "")
    {
      $(".hourly-modal .spinner").height($(".modal-dialog").height());
      $scope.forms.showSpinner = true;
      $scope.forms.errors.description = false;
      
      $http({
        method: 'POST',
        url: API_BASE_URL+"application",
        data: dataParams
      }).then(success, error);
    }
    else
    {
      $scope.forms.errors.description = true;
    }
  };

  $scope.openNewThread = function(){

    function success(response){
      
    }

    function error(response){
      alert("Something went wrong.")
    }

    dataParams = {
      message: "[Job Title: "+$localStorage.currentJobTitle+"] " + $scope.forms.inputs.description,
      employer_id: $localStorage.currentEmployerId
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