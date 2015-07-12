var TelegramMQ = new (require('./lib/TelegramMQ.js')),
    config = require('./config.js'),
    pinger = new (require('./lib/Pinger.js'))(config.get('pinger')),
    tts = new (require('./lib/TTS.js'))(),
    ReedSwitch = require('./ReedSwitch.js');


var doorSensor = new ReedSwitch(config.get('doorsensor.pin_number'), 100);
doorSensor.init();
var camera = new Camera(config.get('camera'), __dirname + config.get('snapshot_path'));
var monitor = new (require('./lib/HallMonitor.js'))(TelegramMQ, doorSensor, camera);

console.log = (function(){
	var log = console.log;
	return function(){
		var date = '[' + new Date + ']';
		log.apply(console, [date].concat(Array.prototype.slice.call(arguments)));
	};
})();

monitor.start();

setTimeout(function(){
	doorSensor.emit('open');
}, 5000);

setTimeout(function(){
	doorSensor.emit('closed');
}, 10000);

process.on('uncaughtException', function(err) {
  console.log('Uncaught exception: ' + err);
  console.log(err.stack);
});

pinger.on('change', function (info) {
    var message = info.name + ': ' + info.action;
    // console.log(message);
    TelegramMQ.send({ type: 'message', text: message});

    var hour = new Date().getHours();
    if(hour >= 8 && hour <= 22){
      switch(info.action){
        case 'enter':
          tts.sayall(info.name + ' is almost home.');
          break;
        case 'leave':
          tts.sayall(info.name + ' has left the building.');
          break;
      }
    }
});

pinger.start();
