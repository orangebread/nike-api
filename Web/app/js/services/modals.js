module.factory("modals", function($uibModal){

	var service = {};

	service.openMerchantSignUp = function(){
		var modalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: 'templates/modules/merchant-sign-up.html',
	      controller: 'MerchantSignUpController',
	      resolve: {
	        items: function () {
	          return [];
	        }
	      }
	    });
	}

	service.openApplyModal = function(){
		var modalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: 'templates/modules/apply-modal.html',
	      controller: 'ApplyModalController',
	      resolve: {
	        items: function () {
	          return [];
	        }
	      }
	    });
	}

	service.openLoginModal = function(){
		var modalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: 'templates/modules/login-modal.html',
	      controller: 'LoginModalController',
	      resolve: {
	        items: function () {
	          return [];
	        }
	      }
	    });
	}

	service.openTaskModal = function(){
		var modalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: 'templates/modules/post-task-modal.html',
	      controller: 'PostTaskController',
	      resolve: {
	        items: function () {
	          return [];
	        }
	      }
	    });
	}

	service.openAcceptModal = function(application){
		$localStorage.appAcceptUserId = application.user_id;
		$localStorage.amountToPay = application.bid_amount;
		$localStorage.appId = application.application_id;
		$localStorage.acceptJobId = application.job_id;

		var modalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: 'templates/modules/apply-accept-modal.html',
	      controller: 'ApplyAcceptController',
	      resolve: {
	        items: function () {
	          return [];
	        }
	      }
	    });
	}

	return service;
})