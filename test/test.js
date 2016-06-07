'use strict';

var assert = require('assert');
var path = require('path');
var when = require('ruff-mock').when;

var driverPath = path.join(__dirname, '..');
var driverRunner = require('ruff-driver-runner');

require('t');

describe('Driver for illuminance intensity sensor with I2C', function () {
    var light;
    var i2c;

    before(function (done) {
        driverRunner.run(driverPath, function (device, context) {
            light = device;
            i2c = context.arg('i2c');
            done();
        });
    });

    it('should get illuminance', function (done) {
        when(i2c).readBytes(0x20, 2).thenReturn([0x01, 0x02]);
        light.getIlluminance(function (error, value) {
            if (error) {
                done(error);
                return;
            }

            assert.equal(value, 215);
            done();
        });
    });
});
