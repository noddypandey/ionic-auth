angular.module('starter')

.controller('AppCtrl',  function($state, $scope, $ionicPopup, AuthService, AUTH_EVENTS){
	$scope.username = AuthService.username();

	$scope.$on(AUTH_EVENTS.notAuthenticated, function(event){
		AuthService.logout();
		$state.go('login');
		var alertPopup = $ionicPopup.alert({
			title: 'Session Lost',
			template: 'Sorry, You haveto login again.'
		});
	});

	$scope.$on(AUTH_EVENTS.notAuthorized, function(event){
		var alertPopup = $ionicPopup.alert({
			title: 'UnAuthorized',
			template: 'You are not allowed'
		});
	});
})
.controller('LoginCtrl',  function($scope, $state, $ionicPopup, AuthService){
	$scope.data = {};

	$scope.login= function(data){
		AuthService.login(data.username, data.password).then(function(authenticated){
			$state.go('main.dash', {}, {reload: true})

		}, function(error){
			var alertPopup = $ionicPopup.alert({
			title: 'Login Failed',
			template: 'Please check Credentials'
		});
		})
	}
	
})
.controller('DashCtrl',  function($scope, $state, $ionicPopup, $http, AuthService){
	$scope.logout = function(){
		AuthService.logout();
		$state.go('login');
	};

	$scope.performValidRequest = function(){
		$http.get('http://localhost:8100/valid').then(function(result){
			$scope.response = result;
		})
	};

	$scope.performUnauthorziedRequest = function(){
		$http.get('http://localhost:8100/notauthorized').then(function(result){
		}, function(err){
			$scope.response = err;
		});
	};

	$scope.performInvalidRequest = function(){
		$http.get('http://localhost:8100/notauthenticated').then(function(result){
		}, function(err){
			$scope.response = err;
		})
	};
});