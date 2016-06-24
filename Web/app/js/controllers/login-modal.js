module.controller('LoginModalController', function ($scope, $uibModalInstance, items, $localStorage, $rootScope, Facebook) {

  $scope.forms = {
    login: true,
    inputs: {
      email: "",
      password: "",
      password_conf: ""
    }
  }

  $scope.login = function () {
    $localStorage.userID = 1;
  };

  $scope.fbLogin = function(){
    //delete $localStorage.jwtToken;
    delete $localStorage.userID;
    //delete $localStorage.username;
    // From now on you can use the Facebook service just as Facebook api says
    Facebook.login(function(firstResponse) {
      if(firstResponse.status == "connected")
      {
        Facebook.api('/me?fields=email', function(secondResponse) {
            var email = secondResponse.email;

            dataParams = {                
              fb_id: firstResponse.authResponse.userID,
              fb_token: firstResponse.authResponse.accessToken,
              email: secondResponse.email
            }
        
            // $http({
            //     method: 'POST',
            //     url: API_BASE_URL+"login/facebook",
            //     data: dataParams
            //   }).then(success, error);
            // });

            $rootScope.$broadcast('loggedIn');
            $uibModalInstance.dismiss('cancel');
        }, { scope: 'email' });

        function success(response){
          // if logged in successfully
          if(response.data.success)
          {
            $localStorage.jwtToken = response.data.token;
            $localStorage.userID = jwtHelper.decodeToken(response.data.token).id;
            $localStorage.username = response.data.displayName;
            $window.location.href = "/";
          }
          else
          {
            alert("Wrong username or password");
          }
        }

        function error(response){
          alert("Something bad happened");
          $log.log(response)
          delete $localStorage.jwtToken;
        }
      }
    });
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});