/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');
var mdelay = driver.mdelay;

module.exports = driver({
    attach: function (inputs) {
        this._i2c = inputs.getRequired('i2c');
    },

    exports: {
        getIlluminance: function (handler) {
            var that = this;
            setImmediate(function () {
                try {
                    // read first and throw it;
                    that._i2c.readBytes(0x20, 2);
                    mdelay(180);
                    // reference to datasheet: bh1750fvi-e.pdf
                    var data = that._i2c.readBytes(0x20, 2);
                    var value = Math.floor(((data[0] << 8) + (data[1] & 0xFF)) / 1.2);
                    handler(undefined, value);
                } catch (error) {
                    handler(error);
                }
            });
        }
    }
});
