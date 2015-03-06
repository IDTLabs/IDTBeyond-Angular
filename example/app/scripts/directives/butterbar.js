'use strict';

/**
 * @ngdoc directive
 * @name idtbeyondAngularDemoApp.directive:butterBar
 * @description
 * # butterBar
 */
angular.module('idtbeyondAngularDemoApp')
  .directive('butterBar', function () {
    return {
      templateUrl: 'scripts/directives/butterBar.html',
      restrict: 'E',
      scope: {
        message: '=message',
        alert: '=alertLevel'
      },
      link: function(scope, elem, attr){
        scope.clearMessage = function(){
          scope.message = '';
          scope.alert.alertSuccess = false;
          scope.alert.alertDanger = false;
          scope.alert.alertInfo = false;
          scope.alert.alertWarning = false;
        }
      }
    };
  });
