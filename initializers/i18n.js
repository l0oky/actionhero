'use strict';

var i18n = require('i18n');
var path = require('path');
var fs   = require('fs');

module.exports = {
  loadPriority:  10,
  initialize: function(api, next){

    // Build the compiled direcotry
    var data = {};

    api.config.general.paths.locale.forEach(function(direcotry){
      direcotry = path.normalize(direcotry);
      api.utils.recursiveDirectoryGlob(direcotry, '.json').forEach(function(f){
        if(f.indexOf(api.config.i18n.compiledDirectory) !== 0){
          var pathParts = f.replace(direcotry, '').split(path.sep);
          var nameParts = pathParts[(pathParts.length - 1)].split('.');
          var locale = nameParts[0];
          if(!data[locale]){ data[locale] = {}; }
          var deepData = data[locale];
          var pathPart;

          for(var i = 0; i < pathParts.length; i++){
            pathPart = pathParts[i];
            if(pathPart.length > 0 && i < (pathParts.length - 1)){
              if(i + 1 === (pathParts.length - 1)){
                deepData[pathPart] = require(f);
              }else{
                deepData[pathPart] = {};
                deepData = deepData[pathPart];
              }
            }
          }
        }
      });
    });

    try{
      if(!fs.existsSync(api.config.i18n.compiledDirectory)){
        fs.mkdirSync(api.config.i18n.compiledDirectory);
      }
      Object.keys(data).forEach(function(locale){
        var file = api.config.i18n.compiledDirectory + path.sep + locale + '.json';
        fs.writeFileSync(file, JSON.stringify(data[locale], null, 2));
      });
    }catch(e){
      throw e;
    }

    // Load i18n
    var options = api.config.i18n;
    options.directory = path.normalize(api.config.i18n.compiledDirectory);
    i18n.configure(options);
    i18n.setLocale(api.config.i18n.defaultLocale);

    api.i18n = Object.assign({
      // simplistic determination of locale for connection
      determineConnectionLocale: function(connection){
        // perhpas you want to look at the `accept-language` headers from a web requests
        // perhaps your API can use a certain cookie or URL to determine locale
        return api.config.i18n.defaultLocale;
      },
      invokeConnectionLocale: function(connection){
        var cmdParts = api.config.i18n.determineConnectionLocale.split('.');
        var cmd = cmdParts.shift();
        if(cmd !== 'api'){ throw new Error('cannot operate on a method outside of the api object'); }
        var method = api.utils.stringToHash(cmdParts.join('.'));
        var locale = method(connection);
        api.i18n.setLocale(connection, locale);
      },
      localize: function(message, options){
        if(!Array.isArray(message)){ message = [message]; }
        if(!options){ options = api.i18n; }
        return api.i18n.__.apply(options, message);
      }
    }, i18n);

    next();
  }
};
