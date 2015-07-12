var TelegramMQ = require('./lib/TelegramMQ.js'),
	Camera = require('./fswebcam-wrapper/lib/fswebcam-wrapper.js'),
    config = require('./config-local.js');

console.log = (function(){
	var log = console.log;
	return function(){
		var date = '[' + new Date + ']';
		log.apply(console, [date].concat(Array.prototype.slice.call(arguments)));
	};
})();

var tQueue = new TelegramMQ();
var imgPath = __dirname + '/snapshots/' + new Date + '.jpg';


var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function(line){
    switch(line){
        case 'open':
            
            break;
        case 'close':
            break;
           
    }
});
