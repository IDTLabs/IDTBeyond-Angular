'use strict';

/**
 * @ngdoc function
 * @name idtbeyondAngularDemoApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the idtbeyondAngularDemoApp
 */
angular.module('idtbeyondAngularDemoApp')
  .controller('SettingsCtrl', function (idtBeyondSettings, IdtBeyond, $timeout) {

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
    vm.appId = idtBeyondSettings.getAppId();
    vm.appKey = idtBeyondSettings.getAppKey();
    vm.developmentMode = (idtBeyondSettings.getDevelopmentMode()) ? true : false;
    vm.termId = idtBeyondSettings.getTermId();
    vm.planType = idtBeyondSettings.getPlanType();
    vm.message = '';

    vm.resetApplicationData = function(){
      idtBeyondSettings.clearAll();
      resetDataAndMessage('Application Data cleared.');
      setAlertLevel('info');
      redirectToHome();
    };

    vm.saveAppDetails = function(){
      if(!vm.appId || !vm.appKey || !vm.termId){
        resetDataAndMessage('App ID, App Key & Term ID must all be filled in. Re-enter application details.', 'danger');
        return;
      }
      if (!idtBeyondSettings.setAppId(vm.appId)){
        resetDataAndMessage('Saving Application ID failed, please try again.', 'danger');
        return;
      }
      if (!idtBeyondSettings.setAppKey(vm.appKey)){
        resetDataAndMessage('Saving Application Key failed, please try again.', 'danger');
        return;
      }
      if (!idtBeyondSettings.setTermId(vm.termId)){
        resetDataAndMessage('Saving Terminal ID failed, please try again.', 'danger');
        return;
      }
      if (!idtBeyondSettings.setPlanType(vm.planType)){
        resetDataAndMessage('Saving Plan Type failed, please try again.', 'danger');
        return;
      }
      var devModeForLocalStorage = (vm.developmentMode) ? 1 : 0;
      if (!idtBeyondSettings.setDevelopmentMode(devModeForLocalStorage)){
        resetDataAndMessage('Saving Application Key failed, please try again.', 'danger');
        return;
      }
      vm.message = 'Settings successfully saved.';
      setAlertLevel('success');
      IdtBeyond.resetAppData();
      redirectToHome();
    };
  });
