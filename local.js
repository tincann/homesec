var TelegramMQ = require('./lib/TelegramMQ.js'),
	Camera = require('./fswebcam-wrapper/lib/Camera.js'),
    config = require('./config.js'),
    ReedSwitch = require('./lib/ReedSwitch.js');

console.log = (function(){
	var log = console.log;
	return function(){
		var date = '[' + new Date + ']';
		log.apply(console, [date].concat(Array.prototype.slice.call(arguments)));
	};
})();

var mq = new TelegramMQ();
var imgPath = __dirname + '/snapshots/' + new Date + '.jpg';

var doorSensor = new ReedSwitch(config.get('doorsensor').pin_number, 100);
var camera = new Camera(config.get('camera'), __dirname + '/' + config.get('snapshot_path'));
var monitor = new (require('./lib/HallMonitor.js'))(mq, doorSensor, camera);
monitor.start();

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function(line){
    switch(line){
        case 'open':
            doorSensor.emit('open');
            break;
        case 'close':
            doorSensor.emit('closed');
            break;
    }
});
