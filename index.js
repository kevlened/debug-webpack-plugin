var debug = require('debug');
var _ = require('lodash');

function getColor(id) {
  switch (true) {
    case /webpack:compilation:mainTemplate/.test(id):
      return 1;
    case /webpack:compilation/.test(id):
      return 4;
    case /webpack:compiler/.test(id):
      return 6;
    case /webpack:normal-module-factory/.test(id):
      return 2;
    case /webpack:context-module-factory/.test(id):
      return 3;
    default:
      return 5;
  }
}

function Debugger(compiler, options) {
  if (!(this instanceof Debugger)) {
    return new Debugger(compiler, options);
  }
  
  var dbgr = this;
  options = options || {};
  
  if (options.debug === undefined) {
    dbgr.debug = compiler.options.debug;
  } else {
    dbgr.debug = options.debug;
  }
  
  dbgr.scope = options.scope || [];
  if (dbgr.debug) {
    _.each(dbgr.scope, function(scope) {
      debug.enable(scope);
    });
  }
  
  options.listeners = options.listeners || {};
  compiler.__DEBUG_PLUGIN_LISTENERS = compiler.__DEBUG_PLUGIN_LISTENERS || {};
  _.assign(compiler.__DEBUG_PLUGIN_LISTENERS, options.listeners);
  
  dbgr.create = function(id) {
    debug.colors = [getColor(id)];
    var debugInstance = debug(id);
    
    function log() {
      if (!arguments.length) {
        return debugInstance('');
      }
      debugInstance.apply(null, arguments);
    }
    
    function emit() {
      log();
      var listeners = compiler.__DEBUG_PLUGIN_LISTENERS;
      if (dbgr.debug && _.isFunction(listeners[id])) {
        listeners[id].apply(null, arguments);
      }
    }
    
    return {
      log: log,
      emit: emit
    };
  }
}

function apply(options, compiler) {
  var plugin = this;
  
  if (plugin.debug === undefined) {
    plugin.debug = compiler.options.debug;
  }
  
  if (plugin.debug) {
    _.each(plugin.scope, function(scope) {
      debug.enable(scope);
    });
  }
  
  var dbg = new Debugger(compiler, options);

  compiler.plugin('run', function(comp, cb) {
    dbg.create('webpack:compiler:run').emit.apply(null, arguments);
    cb();
  });

  compiler.plugin('watch-run', function(watching, cb) {
    dbg.create('webpack:compiler:watch-run').emit.apply(null, arguments);
    cb();
  });

  compiler.plugin('normal-module-factory', function(nmf) {
    dbg.create('webpack:compiler:normal-module-factory').emit.apply(null, arguments);

    nmf.plugin('before-resolve', function(data, cb) {
      dbg.create('webpack:normal-module-factory:before-resolve').emit.apply(null, arguments);
      cb(null, data);
    });

    nmf.plugin('after-resolve', function(data, cb) {
      dbg.create('webpack:normal-module-factory:after-resolve').emit.apply(null, arguments);
      cb(null, data);
    });
  });

  compiler.plugin('context-module-factory', function(cmf) {
    dbg.create('webpack:compiler:context-module-factory').emit.apply(null, arguments);

    cmf.plugin('before-resolve', function(data, cb) {
      dbg.create('webpack:context-module-factory:before-resolve').emit.apply(null, arguments);
      cb(null, data);
    });

    cmf.plugin('after-resolve', function(data, cb) {
      dbg.create('webpack:context-module-factory:after-resolve').emit.apply(null, arguments);
      cb(null, data);
    });

    cmf.plugin('alternatives', function(options, cb) {
      dbg.create('webpack:context-module-factory:alternatives').emit.apply(null, arguments);
      cb(null, options);
    });
  });

  compiler.plugin('compile', function(params) {
    dbg.create('webpack:compiler:compile').emit.apply(null, arguments);
  });

  compiler.plugin('make', function(c, cb) {
    dbg.create('webpack:compiler:make').emit.apply(null, arguments);
    cb();
  });

  compiler.plugin('after-compile', function(c, cb) {
    dbg.create('webpack:compiler:after-compile').emit.apply(null, arguments);
    cb();
  });

  compiler.plugin('compilation', function(c, params) {
    dbg.create('webpack:compiler:compilation').emit.apply(null, arguments);

    c.plugin('normal-module-loader', function(loaderContext, module) {
      dbg.create('webpack:compilation:normal-module-loader').emit.apply(null, arguments);
    });

    c.plugin('seal', function() {
      dbg.create('webpack:compilation:seal').emit.apply(null, arguments);
    });

    c.plugin('optimize', function() {
      dbg.create('webpack:compilation:optimize').emit.apply(null, arguments);
    });

    c.plugin('optimize-tree', function(chunks, modules, cb) {
      dbg.create('webpack:compilation:optimize-tree').emit.apply(null, arguments);
      cb();
    });

    c.plugin('optimize-modules', function(modules) {
      dbg.create('webpack:compilation:optimize-modules').emit.apply(null, arguments);
    });

    c.plugin('after-optimize-modules', function(modules) {
      dbg.create('webpack:compilation:after-optimize-modules').emit.apply(null, arguments);
    });

    c.plugin('optimize-module-order', function(modules) {
      dbg.create('webpack:compilation:optimize-module-order').emit.apply(null, arguments);
    });

    c.plugin('optimize-module-ids', function(modules) {
      dbg.create('webpack:compilation:optimize-module-ids').emit.apply(null, arguments);
    });

    c.plugin('after-optimize-module-ids', function(modules) {
      dbg.create('webpack:compilation:after-optimize-module-ids').emit.apply(null, arguments);
    });

    c.plugin('record-modules', function(modules, records) {
      dbg.create('webpack:compilation:record-modules').emit.apply(null, arguments);
    });

    c.plugin('revive-modules', function(modules, records) {
      dbg.create('webpack:compilation:revive-modules').emit.apply(null, arguments);
    });

    c.plugin('optimize-chunks', function(chunks) {
      dbg.create('webpack:compilation:optimize-chunks').emit.apply(null, arguments);
    });

    c.plugin('after-optimize-chunks', function(chunks) {
      dbg.create('webpack:compilation:after-optimize-chunks').emit.apply(null, arguments);
    });

    c.plugin('optimize-chunk-order', function(chunks) {
      dbg.create('webpack:compilation:optimize-chunk-order').emit.apply(null, arguments);
    });

    c.plugin('optimize-chunk-ids', function(chunks) {
      dbg.create('webpack:compilation:optimize-chunk-ids').emit.apply(null, arguments);
    });

    c.plugin('after-optimize-chunk-ids', function(chunks) {
      dbg.create('webpack:compilation:after-optimize-chunk-ids').emit.apply(null, arguments);
    });

    c.plugin('record-chunks', function(modules, records) {
      dbg.create('webpack:compilation:record-chunks').emit.apply(null, arguments);
    });

    c.plugin('revive-chunks', function(chunks, records) {
      dbg.create('webpack:compilation:revive-chunks').emit.apply(null, arguments);
    });

    c.plugin('before-hash', function() {
      dbg.create('webpack:compilation:before-hash').emit.apply(null, arguments);
    });

    c.plugin('after-hash', function() {
      dbg.create('webpack:compilation:after-hash').emit.apply(null, arguments);
    });

    c.plugin('before-chunk-assets', function() {
      dbg.create('webpack:compilation:before-chunk-assets').emit.apply(null, arguments);
    });

    c.plugin('additional-chunk-assets', function(chunks) {
      dbg.create('webpack:compilation:additional-chunk-assets').emit.apply(null, arguments);
    });

    c.plugin('optimize-chunk-assets', function(chunks, cb) {
      dbg.create('webpack:compilation:optimize-chunk-assets').emit.apply(null, arguments);
      cb();
    });

    c.plugin('after-optimize-chunk-assets', function(chunks) {
      dbg.create('webpack:compilation:after-optimize-chunk-assets').emit.apply(null, arguments);
    });

    c.plugin('record', function(compilation, records) {
      dbg.create('webpack:compilation:record').emit.apply(null, arguments);
    });

    c.plugin('optimize-assets', function(assets, cb) {
      dbg.create('webpack:compilation:optimize-assets').emit.apply(null, arguments);
      cb();
    });

    c.plugin('after-optimize-assets', function(assets) {
      dbg.create('webpack:compilation:after-optimize-assets').emit.apply(null, arguments);
    });

    c.plugin('build-module', function(module) {
      dbg.create('webpack:compilation:build-module').emit.apply(null, arguments);
    });

    c.plugin('succeed-module', function(module) {
      dbg.create('webpack:compilation:succeed-module').emit.apply(null, arguments);
    });

    c.plugin('failed-module', function(module) {
      dbg.create('webpack:compilation:failed-module').emit.apply(null, arguments);
    });

    c.plugin('module-asset', function(module, filename) {
      dbg.create('webpack:compilation:module-asset').emit.apply(null, arguments);
    });

    c.plugin('chunk-asset', function(chunk, filename) {
      dbg.create('webpack:compilation:chunk-asset').emit.apply(null, arguments);
    });

    c.mainTemplate.plugin('startup', function(source, module, hash) {
      dbg.create('webpack:compilation:mainTemplate:startup').emit.apply(null, arguments);
      return source;
    });
  });

  compiler.plugin('emit', function(c, cb) {
    dbg.create('webpack:compiler:emit').emit.apply(null, arguments);
    cb();
  });

  compiler.plugin('after-emit', function(c, cb) {
    dbg.create('webpack:compiler:after-emit').emit.apply(null, arguments);
    cb();
  });

  compiler.plugin('done', function(stats) {
    dbg.create('webpack:compiler:done').emit.apply(null, arguments);
  });

  compiler.plugin('failed', function(err) {
    dbg.create('webpack:compiler:failed').emit.apply(null, arguments);
  });

  compiler.plugin('invalid', function(err) {
    dbg.create('webpack:compiler:invalid').emit.apply(null, arguments);
  });

  compiler.plugin('after-plugins', function(comp) {
    dbg.create('webpack:compiler:after-plugins').emit.apply(null, arguments);
  });

  compiler.plugin('after-resolvers', function(comp) {
    dbg.create('webpack:compiler:after-resolvers').emit.apply(null, arguments);
  });
};

module.exports = function(options) {
    options = options || {};
    options.scope = options.scope || ['webpack:*'];
    options.listeners = options.listeners || {};

    return {
        apply: apply.bind(this, options)
    };
};

module.exports.Debugger = Debugger;