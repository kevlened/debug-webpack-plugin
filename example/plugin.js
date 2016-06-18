var Debugger = require('../index').Debugger;

function ExamplePlugin() {}
ExamplePlugin.prototype.apply = function(compiler) {
  
  var dbg = Debugger(compiler).create('webpack:plugin:ExamplePlugin');
  
  compiler.plugin('run', function(comp, cb) {
    dbg.log('The plugin is being applied');
    dbg.emit({something: 'The plugin is emitting something'});
    cb();
  });
}
module.exports = ExamplePlugin;