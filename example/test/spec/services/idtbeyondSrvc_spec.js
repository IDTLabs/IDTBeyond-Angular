'use strict';

describe('Service: IdtBeyond', function () {

  beforeEach(module('idtbeyondAngularDemoApp'));

  var IdtBeyond, $httpBackend, localStorageService, $q, deferred;
  var expectedHeaders = {
    'x-idt-beyond-app-id': 'appId',
    'x-idt-beyond-app-key': 'appKey'
  };

  var verifyHeaders = function(headers){
    return (headers['x-idt-beyond-app-id'] === expectedHeaders['x-idt-beyond-app-id']) &&
      headers['x-idt-beyond-app-key'] === expectedHeaders['x-idt-beyond-app-key'];
  };

  beforeEach(module(function($provide) {
    localStorageService = {
      get: function(value){
        return value;
      }
    };
    $provide.value('localStorageService', localStorageService);
  }));
  beforeEach(inject(function ($injector, _IdtBeyond_) {
    IdtBeyond = _IdtBeyond_;
    $httpBackend = $injector.get('$httpBackend');
    $q = $injector.get('$q');
    deferred = $q.defer();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set the headers from local storage on instantiation', function () {
    expect(IdtBeyond.credentialsSet()).toBe(true);
  });

  it('should call /v1/iatu/products/reports/all when getProducts is called.', function(){
    $httpBackend.expectGET('https://api.idtbeyond.com/v1/iatu/products/reports/all', verifyHeaders).respond(deferred);
    IdtBeyond.getProducts();
    $httpBackend.flush();
  });

  it('should call /v1/iatu/number-validator when validateNumber is called.', function(){
    var phoneNumber = 'phone-number';
    var countryCode = 'country-code';
    $httpBackend.expectGET('https://api.idtbeyond.com/v1/iatu/number-validator?country_code='.concat(
      countryCode, '&mobile_number=', phoneNumber), verifyHeaders).respond(deferred);
    IdtBeyond.validateNumber(phoneNumber, countryCode);
    $httpBackend.flush();
  });

  it('should call /v1/iatu/products/reports/local-value when getLocalValue is called.', function(){
    var params = {
      amount: 'amount',
      countryCode: 'country-code',
      carrierCode: 'carrier-code',
      currencyCode: 'currency-code'
    };

    $httpBackend.expectGET('https://api.idtbeyond.com/v1/iatu/products/reports/local-value?carrier_code='.concat(
      params.carrierCode, '&country_code=', params.countryCode, '&amount=', params.amount, '&currency_code=',
      params.currencyCode), verifyHeaders).respond(deferred);
    IdtBeyond.getLocalValue(params);
    $httpBackend.flush();
  });

  it('should call /v1/iatu/topups when postTopup is called with the correct params.', function(){
    var params = {
      countryCode: 'country-code',
      phoneNumber: 'phone-number',
      carrierCode: 'carrier-code',
      amount: 'amount'
    };

    $httpBackend.expectPOST('https://api.idtbeyond.com/v1/iatu/topups', function(postData){
      var data = angular.fromJson(postData);
      /* jshint ignore:start */
      expect(data.country_code).toEqual(params.countryCode);
      expect(data.mobile_number).toEqual(params.phoneNumber);
      expect(data.carrier_code).toEqual(params.carrierCode);
      expect(data.client_transaction_id).toContain('appId');
      /* jshint ignore:end */
      expect(data.amount).toEqual(params.amount);
      return true;
    }, verifyHeaders).respond(deferred);
    IdtBeyond.postTopup(params);
    $httpBackend.flush();
  });
});
