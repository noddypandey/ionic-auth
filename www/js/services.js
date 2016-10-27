angular.module('starter')

.service('AuthService', function($q, $http, USER_ROLES){
	var LOCAL_TOKEN_KEY = 'your token key';
	var username = '';
	var isAuthenticated = false;
	var role = '';
	var authToken;

	function loadUserCred(){
		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
		if(token){
			userCredntials(token);
		}
	};

	function storeUserCredntials(token){
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		userCredntials(token);
	};

	function userCredntials(token){
		username = token.split('.')[0];
		isAuthenticated = true;
		authToken = token;

		if(username =='admin'){
			role = USER_ROLES.admin
		}
		if(username =='user'){
			role = USER_ROLES.public
		}
	$http.defaults.headers.common['X-Auth-Token'] = token;
	};

	function destroyUserCredentials(){
		authToken = 'undefined';
		username= '';
		isAuthenticated = false;
		$http.defaults.headers.common['X-Auth-Token'] = undefined;
		window.localStorage.removeItem(LOCAL_TOKEN_KEY);

	}

	var login = function(name, pw){
		return $q(function(resolve, reject){
			if((name == 'admin' && pw =='password') || (name == 'user' && pw=='password')){
				storeUserCredntials(name+ '.yourServerToken');
				resolve('Login Success');
			}
			else{
				reject('Login Failed');
			}
		});
	};

	var logout = function(){
		destroyUserCredentials();
	};

	var isAuthorized = function(authorizedRoles){
		if(!angular.isArray(authorizedRoles)){
			authorizedRoles = [authorizedRoles];
		}
		return(isAuthenticated && authorizedRoles.indexOf(role) !== -1);
	};

	loadUserCred();

	return{
		login: login,
		logout: logout,
		isAuthorized: isAuthorized,
		isAuthenticated: function(){return isAuthenticated;},
		username: function(){return username;},
		role: function(){return role;}
	};
})

.factory('AuthInerceptor', function($rootScope, $q, AUTH_EVENTS){
	return {
		responseError: function(response){
			$rootScope.$broadcast({
				401: AUTH_EVENTS.notAuthenticated,
				403: AUTH_EVENTS.notAuthorized
			}[response.status], response);
			return $q.reject(response);
		}
	};
})

/*.config(function($httpProvider){
	$httpProvider.interceptor.push('AuthInterceptor');
});*/