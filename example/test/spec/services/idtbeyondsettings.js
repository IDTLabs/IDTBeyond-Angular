'use strict';

describe('Service: idtBeyondSettings', function () {

  // load the service's module
  beforeEach(module('idtbeyondAngularDemoApp'));

  // instantiate service
  var idtBeyondSettings;
  beforeEach(inject(function (_idtBeyondSettings_) {
    idtBeyondSettings = _idtBeyondSettings_;
  }));

  it('should do something', function () {
    expect(!!idtBeyondSettings).toBe(true);
  });

});
