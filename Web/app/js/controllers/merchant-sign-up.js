module.controller('MerchantSignUpController', function ($scope, $uibModalInstance, items, $http, $localStorage) {

  $scope.forms = {
    login: true,
    inputs: {
      first_name: "",
      last_name: "",
      phone: "",
      dob: "",
      tax: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      zip: "",
      business: "",
      b_account: "",
      b_routing: "",
      email: ""
    }
  }

  $scope.signUp = function(){

  	function success(response){
      console.log(response);
      if(response.data.result.success)
      {
        $localStorage.merchantID = response.data.result.merchantAccount.id;
      }
      else
      {
        alert("Something went wrong with creating the merchant account.")
      }
    }

    function error(response){
      console.log("error");
      console.log(response);
      alert("Something bad happened");
    }

    dataParams = {
      first_name: $scope.forms.inputs.first_name,
      last_name: $scope.forms.inputs.last_name,
      email: $scope.forms.inputs.email,
      f_email: $scope.forms.inputs.email,
      phone: $scope.forms.inputs.phone,
      f_mobile_phone: $scope.forms.inputs.phone,
      dob: $scope.forms.inputs.dob,
      tax: $scope.forms.inputs.tax,
      street_address: $scope.forms.inputs.address_1,
      address_2: $scope.forms.inputs.address_2,
      locality: $scope.forms.inputs.city,
      region: $scope.forms.inputs.state,
      postal_code: $scope.forms.inputs.zip,
      tos_accepted: true,
      account_number: "000000000",
      routing_number: "071101307",
      //business: $scope.forms.inputs.business,
      b_account: $scope.forms.inputs.b_account,
      b_routing: $scope.forms.inputs.b_routing
    }

    $http({
      method: 'POST',
      data: dataParams,
      url: API_BASE_URL+"merchant/add"
    }).then(success, error);

  }

  $scope.getUserDetails = function(){

    function success(response){
      $scope.forms.inputs.email = response.data.result.email;
    }

    function error(response){
      alert("Something went wrong.")
    }

    $http({
        method: 'GET',
        url: API_BASE_URL+"user/"+$localStorage.userID,
      }).then(success, error);
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.getUserDetails();
});