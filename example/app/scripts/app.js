'use strict';

/**
 * @ngdoc overview
 * @name idtbeyondAngularDemoApp
 * @description
 * # idtbeyondAngularDemoApp
 *
 * Main module of the application.
 */
angular
  .module('idtbeyondAngularDemoApp', [
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule'
  ])
  .config(function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('idtBeyond');
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
