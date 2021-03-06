'use strict';

/**
 * @ngdoc function
 * @name idtbeyondAngularDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the idtbeyondAngularDemoApp
 */
angular.module('idtbeyondAngularDemoApp')
  .controller('MainCtrl', function (IdtBeyond) {
    var vm = this;
    vm.products = {};
    vm.countries = {};
    vm.alert = {};

    vm.inDevMode = IdtBeyond.developmentMode();
    vm.appDetailsSet = IdtBeyond.credentialsSet();

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

    var resetAllValues = function(){
      vm.selectedCountryCode = '';
      vm.selectedCarrierCode = '';
      vm.selectedAmount = '';
      vm.phoneNumber = '';
      vm.phoneNumberValid = false;
      vm.phoneNumberValidated = false;
      vm.topUpPrepared = false;
      vm.localValueAmount = '';
      vm.localValueCurrency = '';
      vm.localValueResults = '';
      vm.validatePhoneResponse = '';
    };

    vm.productsSet = function(){
      return !angular.equals({}, vm.products);
    };

    vm.allowValidation = function(){
      return !(!!vm.phoneNumber &&
        !!vm.selectedCarrierCode &&
        !!vm.selectedCountryCode &&
        !!vm.selectedAmount);
    };

    vm.getLocalValue = function(){
      if (!vm.selectedAmount && !vm.selectedCarrierCode && !vm.selectedCountryCode){
        return false;
      }
      var currentProducts = vm.products[vm.selectedCountryCode][vm.selectedCarrierCode];

      if (currentProducts.openRange){
        angular.forEach(currentProducts, function(product){
          if (product.minDenomination !== product.maxDenomination){
            if (vm.selectedAmount < product.minDenomination || vm.selectedAmount > product.maxDenomination){
              vm.message = 'Amount not within the acceptable range for this product. Minimum : '.concat(
                product.minDenomination, ' Maximum: ', product.maxDenomination);
              setAlertLevel('danger');
              return;
            }
          }
        });
      }

      IdtBeyond.getLocalValue({
        carrierCode: vm.selectedCarrierCode,
        countryCode: vm.selectedCountryCode,
        amount: vm.selectedAmount,
        currencyCode: 'USD'
      }).success(function(results){
        /* jshint ignore:start */
        vm.localValueAmount = results.local_amount;
        vm.localValueCurrency = results.local_currency;
        vm.localValueDivisor = results.divisor;
        /* jshint ignore:end */
        vm.localValueResults = results;
        vm.message = 'Estimated local value: '.concat((parseInt(vm.localValueAmount) / parseInt(vm.localValueDivisor)).toFixed(2),' ', vm.localValueCurrency);
        setAlertLevel('info');
      }).error(function(err){
        vm.localValueResults = {};
        vm.message = err.error;
        setAlertLevel('danger');
        vm.localValueAmount = null;
        vm.localValueCurrency = null;
      });
    };

    vm.validatePhoneNumber = function(){
      IdtBeyond.validateNumber(vm.phoneNumber, vm.selectedCountryCode)
        .success(function(data){
          vm.phoneNumberValidated = true;
          if (data.valid){
            vm.message = 'Phone number is valid.';
            setAlertLevel('info');
            vm.phoneNumberValid = true;
          } else {
            setAlertLevel('warning');
            vm.message = 'Phone number is not valid. Please check and try again.';
            vm.phoneNumber = '';
          }
          vm.validatePhoneResponse = data;
        })
        .error(function(err){
          setAlertLevel('danger');
          vm.message = err.error;
          vm.phoneNumberValidated = true;
          vm.validatePhoneResponse = {};
          vm.phoneNumberValid = false;
        });
    };

    vm.cancelTopup = function() {
      vm.topUpPrepared = false;
    };

    vm.resetAllValues = function() {
      resetAllValues();
    };

    vm.submitTopup = function() {
      vm.isSubmitting = true;
      if (!vm.selectedAmount && !vm.selectedCarrierCode && !vm.selectedCountryCode && !vm.phoneNumber){
        return false;
      }
      IdtBeyond.postTopup({
        productCode: vm.productCode,
        carrierCode: vm.selectedCarrierCode,
        countryCode: vm.selectedCountryCode,
        amount: vm.selectedAmount,
        currencyCode: 'USD',
        phoneNumber: vm.phoneNumber
      }).success(function(results){
        vm.isSubmitting = false;
        vm.message = 'Topup successfully submitted, client transaction id: '.
          concat(results.client_transaction_id, '.'); // jshint ignore:line
        setAlertLevel('success');
        resetAllValues();
      }).error(function(err){
        vm.isSubmitting = false;
        vm.topUpPrepared = false;
        setAlertLevel('danger');
        // catch 'b2b' error
        if (err instanceof Error) {
          vm.message = 'Error: '.concat(err.error);
        }else{
          var msg = 'Error processing Topup: '
          msg += err.messages.length ? err.messages[0].message : 'Unknown error ';
          vm.message = msg;
        }
      });
    };

    vm.prepareTopup = function(){
      if (!vm.phoneNumberValidated){
        vm.message = 'Please validate the phone number before preparing topup.';
        setAlertLevel('danger');
        return;
      }
      if (vm.phoneNumberValidated && !vm.phoneNumberValid){
        vm.message = 'Please update phone number and re-validate.';
        setAlertLevel('danger');
        return;
      }
      vm.topUpPrepared = true;
      return;
    };

    vm.resetCarrierValues = function(all){
      if (all){
        vm.selectedCarrierCode = '';
      }
      vm.selectedAmount = '';
    };

    // On instantiation of the controller when the page loads it will run all the below functions once.
    resetAllValues();

    if (vm.appDetailsSet){
      IdtBeyond.getProducts().then(function(results){
        var products = {};
        angular.forEach(results.data , function(product){
          vm.countries[product.country_code] = product.country;
          var countryCode = product.country_code;
          var carrierCode = product.carrier_code;
          if (!products[countryCode]){
            products[countryCode] = {};
          }
          if (!products[countryCode][carrierCode]){
            products[countryCode][carrierCode] = {
              values: [],
              openRange: false
            };
          }
          if (product.max_denomination !== product.min_denomination){
            products[countryCode][carrierCode].openRange = true;
            products[countryCode][carrierCode].minDenomination = product.min_denomination;
            products[countryCode][carrierCode].maxDenomination = product.max_denomination;
          }
          products[countryCode][carrierCode].values.push({
              //currencySymbol: product.currencySymbol,
              //currencyDivisor: product.currencyDivisor,
              minDenomination: product.min_denomination,
              maxDenomination: product.max_denomination
          });
        });
        
        vm.products = products;
      });
    }
  });
