'use strict';

describe('Directive: butterBar', function () {

  // load the directive's module
  beforeEach(module('idtbeyondAngularDemoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
    scope.vm = {
      message: "testing",
      alert: {}
    }

  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<butter-bar message="vm.message" alert-level="vm.alert"></butter-bar>');
    element = $compile(element)(scope);

  }));
});
