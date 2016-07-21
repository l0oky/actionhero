var path = require('path');

exports['default'] = {
  i18n: function(api){
    return {
      // visit https://github.com/mashpie/i18n-node to see all configuration options
      // locale path can be configired from within ./config/api.js
      locales: ['en'],
      updateFiles: false,
      autoReload: false,
      objectNotation: true,

      // how would you like your lanaguages to fall back if a translation string is missing?
      fallbacks: {
        // 'es': 'en'
      },

      // this will configure logging and error messages in the log(s)
      defaultLocale: 'en',

      // the name of the method by which to determine the connection's locale
      // by default, every request will be in the 'en' locale
      // this method will be called witin the localiazation middleware on all requests
      determineConnectionLocale: 'api.i18n.determineConnectionLocale',

      // at boot, we'll take all the files in `api.config.generatl.paths.locale` and merge them
      // into one file per locale. This is what the i18n package will source
      compiledDirectory: path.normalize(api.projectRoot + '/locales/_compiled')
    };
  }
};

exports.staging = {
  i18n: function(){
    return {
      updateFiles: false
    };
  }
};

exports.production = {
  i18n: function(){
    return {
      updateFiles: false
    };
  }
};
