'use strict';

/**
 * @ngdoc service
 * @name idtbeyondAngularDemoApp.IdtBeyond
 * @description
 * # IdtBeyond
 * Service in the idtbeyondAngularDemoApp.
 */
angular.module('idtbeyondAngularDemoApp')
  .service('IdtBeyond', function ($http, localStorageService) {
    var setHeaders = function(){
      return  {
        'x-idt-beyond-app-id': (localStorageService.get('appId')) ? localStorageService.get('appId') : '',
        'x-idt-beyond-app-key': (localStorageService.get('appKey')) ? localStorageService.get('appKey') :''
      };
    };

    var url = 'https://api.idtbeyond.com';
    var headers = setHeaders();
    var termId = (localStorageService.get('termId')) ? localStorageService.get('termId') : '';

    this.getProducts = function(){
      return $http.get(url + '/v1/iatu/products/reports/all', {headers: headers});
    };

    this.credentialsSet = function(){
      return !!headers['x-idt-beyond-app-id'] && !!headers['x-idt-beyond-app-key'];
    };

    this.resetAppData = function(){
      headers = setHeaders();
      termId = (localStorageService.get('termId')) ? localStorageService.get('termId') : '';

    };

    this.validateNumber = function(phoneNumber, countryCode){
      return $http.get(
        url.concat(
          '/v1/iatu/number-validator?country_code=', countryCode, '&mobile_number=', phoneNumber),
        {
          headers: headers
        });
    };

    this.getLocalValue = function(params){
      return $http.get(
        url.concat(
          '/v1/iatu/products/reports/local-value?carrier_code=', params.carrierCode, '&country_code=',
          params.countryCode,'&amount=', params.amount, '&currency_code=', params.currencyCode),
        {
          headers: headers
        });
    };

    var generateClientTransactionId = function(){
      return (localStorageService.get('appId')) ? localStorageService.get('appId').concat(
        '-', ('000000' + Math.floor(Math.random() * (999999 - 1) + 1)).slice(-6)): null;
    };

    this.developmentMode = function(){
      return !!localStorageService.get('developmentMode');
    };

    this.postTopup = function(params){
      return $http.post(
        url.concat('/v1/iatu/topups'),
        {'country_code': params.countryCode,
          'carrier_code': params.carrierCode,
          'mobile_number': params.phoneNumber,
          'plan':'Sandbox',
          'amount': params.amount,
          'client_transaction_id': generateClientTransactionId(),
          'terminal_id': termId
        },
        {headers : headers}
      );

    };
  });
