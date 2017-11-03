## Debug Webpack Plugin
This is a [webpack](http://webpack.github.io/) plugin that makes it easier to debug webpack builds or plugins. It's built on top of [debug](https://github.com/visionmedia/debug).

### Getting started

Install the plugin:

```
npm install --save-dev debug-webpack-plugin
```

### Example as a plugin

This plugin can be included to make it easier to debug your webpack builds (and provide some insight into how webpack works). As a convenience, all events that webpack supports for plugins are already included in the plugin.

```
var DebugWebpackPlugin = require('debug-webpack-plugin');
var path = require('path');

module.exports = {
  context: path.join(__dirname, 'app'),
  plugins: [
    new DebugWebpackPlugin({
    
      // Defaults to ['webpack:*'] which can be VERY noisy, so try to be specific
      scope: [
        'webpack:compiler:*', // include compiler logs
        'webpack:plugin:ExamplePlugin' // include a specific plugin's logs
      ],
      
      // Inspect the arguments passed to an event
      // These are triggered on emits
      listeners: {
        'webpack:compiler:run': function(compiler) {
          // Read some data out of the compiler
        }
      },
      
      // Defaults to the compiler's setting
      debug: true
    })
  ],
  
  // This compiler setting changes the debug settings of loaders
  // and is respected by the DebugWebpackPlugin
  debug: true
};
```

### Example in a plugin

When you're building a plugin and want to make it easier to debug, you can do the following:

```
var Debugger = require('debug-webpack-plugin').Debugger;

module.exports = {
  apply: function(compiler) {
  
    // Create your namespaced debugger
    var dbg = Debugger(compiler).create('webpack:plugin:ExamplePlugin');
    
    compiler.plugin('run', function(comp, cb) {
    
      // Log something with the namespaced debugger
      dbg.log('The plugin is logging something');
      
      // Emit something that can be listened to
      dbg.emit({something: 'The plugin is emitting something'});
      
      cb();
    });
  }
};
```
