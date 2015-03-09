'use strict';

/**
 * @ngdoc service
 * @name idtbeyondAngularDemoApp.idtBeyondSettings
 * @description
 * # idtBeyondSettings
 * Service in the idtbeyondAngularDemoApp.
 */
angular.module('idtbeyondAngularDemoApp')
  .service('idtBeyondSettings', function (localStorageService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getAppId = function(){
      return localStorageService.get('appId');
    };

    this.getAppKey = function(){
      return localStorageService.get('appKey');
    };

    this.getDevelopmentMode = function(){
      return (localStorageService.get('developmentMode')) ? true : false;
    };

    this.getTermId = function(){
      return localStorageService.get('termId');
    };
    this.getPlanType = function(){
      return (localStorageService.get('planType')) ? 1 : 0;
    };

    this.clearAll = function(){
      localStorageService.clearAll();
    };

    this.setAppId = function(appId){
      return localStorageService.set('appId', appId);
    };

    this.setAppKey = function(appKey){
      return localStorageService.set('appKey', appKey);
    };

    this.setTermId = function(termId){
      return localStorageService.set('termId', termId);
    };

    this.setPlanType = function(planType){
      return localStorageService.set('planType', planType);
    };

    this.setDevelopmentMode = function(developmentMode){
      return localStorageService.set('developmentMode', developmentMode);
    };
  });
