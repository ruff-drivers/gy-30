'use strict';

var assert = require('assert');
var mock = require('ruff-mock');

var any = mock.any;
var when = mock.when;

var ONE_TIME_H_RESOLUTION_MODE = 0x20;
var ONE_TIME_L_RESOLUTION_MODE = 0x23;

var MEASUREMENT_ACCURACY = 1.2;

var Device = require('../');

require('t');

describe('Driver for illuminance intensity sensor with I2C', function () {
    var sensor;
    var i2c;

    before(function () {
        i2c = mock();

        var inputs = {
            i2c: i2c
        };

        var context = {
            args: {
                highResolution: true
            }
        };

        sensor = new Device(inputs, context);
    });

    it('should get illuminance in high resolution mode', function (done) {
        var expectedValue = 215;

        when(i2c)
            .writeByte(any, any, any)
            .then(function (command, code, callback) {
                assert.equal(command, -1);
                assert.equal(code, ONE_TIME_H_RESOLUTION_MODE);
                callback();
            });

        when(i2c)
            .readBytes(any, any, any)
            .then(function (command, total, callback) {
                assert.equal(command, -1);
                assert.equal(total, 2);

                var value = expectedValue * MEASUREMENT_ACCURACY;

                callback(undefined, [value >> 8, value & 0xff]);
            });

        sensor.getIlluminance(function (error, value) {
            if (error) {
                done(error);
                return;
            }

            assert.equal(value, expectedValue);
            done();
        });
    });

    it('should get illuminance in low resolution mode', function (done) {
        var expectedValue = 215;

        sensor.highResolution = false;

        when(i2c)
            .writeByte(any, any, any)
            .then(function (command, code, callback) {
                assert.equal(command, -1);
                assert.equal(code, ONE_TIME_L_RESOLUTION_MODE);
                callback();
            });

        when(i2c)
            .readBytes(any, any, any)
            .then(function (command, total, callback) {
                assert.equal(command, -1);
                assert.equal(total, 2);

                var value = expectedValue * MEASUREMENT_ACCURACY;

                callback(undefined, [value >> 8, value & 0xff]);
            });

        sensor.getIlluminance(function (error, value) {
            if (error) {
                done(error);
                return;
            }

            assert.equal(value, expectedValue);
            done();
        });
    });
});
