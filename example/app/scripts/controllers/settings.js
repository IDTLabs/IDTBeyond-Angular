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
        vm.alertDanger = true;
        vm.alertSuccess = false;
        vm.alertInfo = false;
        vm.alertWarning = false;
        return;
      case 'info':
        vm.alertInfo = true;
        vm.alertSuccess = false;
        vm.alertDanger = false;
        vm.alertWarning = false;
        return;
      case 'success':
        vm.alertSuccess = true;
        vm.alertDanger = false;
        vm.alertInfo = false;
        vm.alertWarning = false;
        return;
      case 'warning':
        vm.alertWarning = true;
        vm.alertSuccess = false;
        vm.alertDanger = false;
        vm.alertInfo = false;
        return;
      default:
        vm.alertSuccess = false;
        vm.alertDanger = false;
        vm.alertInfo = false;
        vm.alertWarning = false;
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
          vm.alertDanger = true;
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
    vm.appId = localStorageService.get('appId');
    vm.appKey = localStorageService.get('appKey');
    vm.developmentMode = (localStorageService.get('developmentMode')) ? true : false;
    vm.termId = localStorageService.get('termId');
    vm.planType = (localStorageService.get('planType')) ? 1 : 0;
    vm.message = '';

    vm.clearMessage = function(){
      vm.message = '';
      vm.alertDanger = false;
      vm.alertSuccess = false;
      vm.alertInfo = false;
    };

    vm.resetApplicationData = function(){
      localStorageService.clearAll();
      resetDataAndMessage('Application Data cleared.');
      setAlertLevel('info');
      redirectToHome();
    };

    vm.saveAppDetails = function(){
      if(!vm.appId || !vm.appKey || !vm.termId){
        resetDataAndMessage('App ID, App Key, Plan Type & Term ID must all be filled in. Re-enter application details.', 'danger');
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
