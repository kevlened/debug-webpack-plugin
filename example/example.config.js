var path = require('path');
var DebugWebpackPlugin = require('../index');
var ExamplePlugin = require('./plugin');

module.exports = {
    entry: path.resolve(__dirname, 'main.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new DebugWebpackPlugin({
            scope: [
                'webpack:compiler:*',
                'webpack:plugin:ExamplePlugin'
            ],
            listeners: {
                'webpack:plugin:ExamplePlugin': function(thing) {
                    console.log(thing);
                }
            }
        }),
        new ExamplePlugin()
    ],
    debug: true
};
