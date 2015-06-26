var http = require('http');

var defaultConfig = {
    endpoint: 'localhost:5005'
}

function TTS(config){
    this.config = config || defaultConfig;
}

TTS.prototype.sayall = function(text, language) {
    if(!language){
        language = 'en';
    }
    _get('sayall', text, language)
};

function _get(){
  var args = Array.prototype.slice.call(arguments);
  var parameters = args.join('/');
  http.get(defaultConfig.endpoint + '/' + parameters);  
}

module.exports = TTS;
