'use strict';

/**
 * @ngdoc service
 * @name idtbeyondAngularDemoApp.IdtBeyond
 * @description
 * # IdtBeyond
 * Service in the idtbeyondAngularDemoApp.
 */
angular.module('idtbeyondAngularDemoApp')
  .service('IdtBeyond', function ($http, idtBeyondSettings) {
    var setHeaders = function(){
      return  {
        'x-idt-beyond-app-id': idtBeyondSettings.getAppId(),
        'x-idt-beyond-app-key': idtBeyondSettings.getAppKey()
      };
    };

    /************************************************************************************************************
     *  planType is a variable that will determine if you are pointing to either your sandbox account or
     * your production account, it will default to sandbox, if you visit the settings page and click the
     * checkbox for plan: Production [x] it will then set the data in local storage and overwrite this
     * default.
     ************************************************************************************************************/
    var planType = (idtBeyondSettings.getPlanType()) ? 'Production' : 'Sandbox';
    var url = 'https://api.idtbeyond.com';
    var headers = setHeaders();
    var termId = idtBeyondSettings.getTermId();

    this.getProducts = function(){
      return $http.get(url + '/v1/iatu/products/reports/all', {headers: headers});
    };

    this.credentialsSet = function(){
      return !!headers['x-idt-beyond-app-id'] && !!headers['x-idt-beyond-app-key'];
    };

    this.resetAppData = function(){
      headers = setHeaders();
      termId = idtBeyondSettings.getTermId();
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
      return (idtBeyondSettings.getAppId()) ? idtBeyondSettings.getAppId().concat(
        '-', ('000000' + Math.floor(Math.random() * (999999 - 1) + 1)).slice(-6)): null;
    };

    this.developmentMode = function(){
      return !!idtBeyondSettings.getDevelopmentMode();
    };

    this.postTopup = function(params){
      return $http.post(
        url.concat('/v1/iatu/topups'),
        {'country_code': params.countryCode,
          'carrier_code': params.carrierCode,
          'mobile_number': params.phoneNumber,
          'plan': planType,
          'amount': params.amount,
          'client_transaction_id': generateClientTransactionId(),
          'terminal_id': termId
        },
        {headers : headers}
      );
    };
  });
