/*
* @Author: liyunjiao2048@163.com
* @Date:   2019-03-27 14:55:38
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2019-03-27 14:57:00
*/

var br = require('@babel/register');
var fs = require('fs');
var path = require('path');
var babelConfig = {
    "presets": [
        ["@babel/env"]
    ],
    "plugins": [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-transform-modules-commonjs"
    ]
}
br(babelConfig);

require('./server');
