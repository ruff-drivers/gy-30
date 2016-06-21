/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');
var mdelay = driver.mdelay;

module.exports = driver({
    attach: function (inputs) {
        this._i2c = inputs['i2c'];
    },

    exports: {
        getIlluminance: function (callback) {
            var that = this;
            // One Time H-Resolution Mode, measurement at 1lx resolution.
            that._i2c.writeByte(-1, 0x20, function () {
                mdelay(180);
                // reference to datasheet: bh1750fvi-e.pdf
                that._i2c.readBytes(-1, 2, function (error, data) {
                    var value = Math.floor(((data[0] << 8) + (data[1] & 0xFF)) / 1.2);
                    callback(error, value);
                });
            });
        }
    }
});
