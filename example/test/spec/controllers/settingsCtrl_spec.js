'use strict';

describe('Controller: SettingsCtrl', function () {

  beforeEach(module('idtbeyondAngularDemoApp'));

  var SettingsCtrl, IdtBeyond, scope, idtBeyondSettings;
  beforeEach(inject(function ($controller) {
    idtBeyondSettings = {
      getAppId: function () {
        return 'app-id';
      },
      getAppKey: function () {
        return 'app-key';
      },
      getTermId: function () {
        return 'term-id';
      },
      getPlanType: function () {
        return 'plan-type';
      },
      getDevelopmentMode: function () {
        return '1';
      },
      setAppId: function () {
        return false;
      },
      setAppKey: function () {
        return true;
      },
      setTermId: function () {
        return true;
      },
      setPlanType: function () {
        return true;
      },
      setDevelopmentMode: function () {
        return true;
      }
    };
    IdtBeyond = {
      resetAppData: jasmine.createSpy()
    };

    scope = {};
    SettingsCtrl = $controller('SettingsCtrl as vm', {
      IdtBeyond: IdtBeyond,
      $scope: scope,
      idtBeyondSettings: idtBeyondSettings
    });
  }));

  it('should load the data from the local storage service into the controller variables', function () {
    expect(scope.vm.appId).toEqual('app-id');
    expect(scope.vm.appKey).toEqual('app-key');
    expect(scope.vm.termId).toEqual('term-id');
    expect(scope.vm.developmentMode).toEqual(true);
  });

  it('should empty variables and set message when can\'t save in the local storage service', function () {
    expect(scope.vm.message).toBe('');
    scope.vm.saveAppDetails();
    expect(scope.vm.message).toBe('Saving Application ID failed, please try again.');
    expect(scope.vm.appId).toEqual('');
    expect(scope.vm.appKey).toEqual('');
    expect(scope.vm.termId).toEqual('');
    expect(scope.vm.developmentMode).toBeNull();
  });

  it('should empty variables and set message when all fields aren\'t valid', function () {
    expect(scope.vm.message).toBe('');
    scope.vm.termId = null;
    scope.vm.saveAppDetails();
    expect(scope.vm.message).toBe('App ID, App Key & Term ID must all be filled in. Re-enter application details.');
    expect(scope.vm.appId).toEqual('');
    expect(scope.vm.appKey).toEqual('');
    expect(scope.vm.termId).toEqual('');
    expect(scope.vm.developmentMode).toBeNull();
  });

  it('should set the message to success when it saves properly', function () {
    idtBeyondSettings.setAppId = function(){
      return true;
    };
    expect(scope.vm.message).toBe('');
    scope.vm.saveAppDetails();
    expect(scope.vm.message).toBe('Settings successfully saved.');
    expect(IdtBeyond.resetAppData).toHaveBeenCalled();
  });
});
