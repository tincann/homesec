var fs = require('fs');
var filePath = './config.json';
if(process.env.debug){
    console.log('using config-test.json');
    filePath = './config-test.json';
}

var config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log(config);
exports.get = function(key){
    var value;
    if((value = config[key]) !== undefined){
        return value;
    }

    throw new Error('Key ' + key + ' not defined');
};
