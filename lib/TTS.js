var http = require('http');

var defaultConfig = {
    endpoint: 'http://localhost:5005'
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
  http.get(defaultConfig.endpoint + '/' + parameters)
  .on('error', function(e){
    if(e.code == 'ECONNREFUSED'){
        console.log('ERROR: TTS server not running at', defaultConfig.endpoint);
    }
  })
}

module.exports = TTS;
