'use strict';

/**
 * @ngdoc function
 * @name idtbeyondAngularDemoApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the idtbeyondAngularDemoApp
 */
angular.module('idtbeyondAngularDemoApp')
  .controller('SettingsCtrl', function (localStorageService, IdtBeyond, $timeout) {

  var redirectToHome = function(){
    $timeout( function(){
      window.location.href = '/';
    }, 3000);
  };

  var setAlertLevel = function(level){
    switch (level){
      case 'danger':
        vm.alert.alertDanger = true;
        vm.alert.alertSuccess = false;
        vm.alert.alertInfo = false;
        vm.alert.alertWarning = false;
        return;
      case 'info':
        vm.alert.alertInfo = true;
        vm.alert.alertSuccess = false;
        vm.alert.alertDanger = false;
        vm.alert.alertWarning = false;
        return;
      case 'success':
        vm.alert.alertSuccess = true;
        vm.alert.alertDanger = false;
        vm.alert.alertInfo = false;
        vm.alert.alertWarning = false;
        return;
      case 'warning':
        vm.alert.alertWarning = true;
        vm.alert.alertSuccess = false;
        vm.alert.alertDanger = false;
        vm.alert.alertInfo = false;
        return;
      default:
        vm.alert.alertSuccess = false;
        vm.alert.alertDanger = false;
        vm.alert.alertInfo = false;
        vm.alert.alertWarning = false;
        return;
    }
  };

    var resetDataAndMessage = function(message, alertType){
      vm.message = message;
      vm.appId = '';
      vm.appKey = '';
      vm.termId = '';
      vm.developmentMode = null;
      switch (alertType){
        case 'danger':
          setAlertLevel('danger');
          return;
        case 'info':
          setAlertLevel('info');
          return;
        case 'success':
          setAlertLevel('success');
      }
    };

    // Variables setup to be used in the browser off the controller object vm.
    var vm = this;
    vm.alert = {};
    vm.appId = localStorageService.get('appId');
    vm.appKey = localStorageService.get('appKey');
    vm.developmentMode = (localStorageService.get('developmentMode')) ? true : false;
    vm.termId = localStorageService.get('termId');
    vm.planType = (localStorageService.get('planType')) ? 1 : 0;
    vm.message = '';

    vm.resetApplicationData = function(){
      localStorageService.clearAll();
      resetDataAndMessage('Application Data cleared.');
      setAlertLevel('info');
      redirectToHome();
    };

    vm.saveAppDetails = function(){
      if(!vm.appId || !vm.appKey || !vm.termId){
        resetDataAndMessage('App ID, App Key & Term ID must all be filled in. Re-enter application details.', 'danger');
        return;
      }
      if (!localStorageService.set('appId', vm.appId)){
        resetDataAndMessage('Saving Application ID failed, please try again.', 'danger');
        return;
      }
      if (!localStorageService.set('appKey', vm.appKey)){
        resetDataAndMessage('Saving Application Key failed, please try again.', 'danger');
        return;
      }
      if (!localStorageService.set('termId', vm.termId)){
        resetDataAndMessage('Saving Terminal ID failed, please try again.', 'danger');
        return;
      }
      if (!localStorageService.set('planType', vm.planType)){
        resetDataAndMessage('Saving Plan Type failed, please try again.', 'danger');
        return;
      }
      var devModeForLocalStorage = (vm.developmentMode) ? 1 : 0;
      if (!localStorageService.set('developmentMode', devModeForLocalStorage)){
        resetDataAndMessage('Saving Application Key failed, please try again.', 'danger');
        return;
      }
      vm.message = 'Settings successfully saved.';
      setAlertLevel('success');
      IdtBeyond.resetAppData();
      redirectToHome();
    };
  });
