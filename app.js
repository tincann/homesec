var TelegramMQ = new (require('./lib/TelegramMQ.js'));
    monitor = new (require('./lib/HallMonitor.js'))(TelegramMQ),
    config = require('./config.js'),
    pinger = new (require('./lib/Pinger.js'))(config.get('pinger')),
    tw = require('./lib/TelegramWrapper.js');


console.log = (function(){
	var log = console.log;
	return function(){
		var date = '[' + new Date + ']';
		log.apply(console, [date].concat(Array.prototype.slice.call(arguments)));
	};
})();

monitor.start();

setTimeout(function(){
	monitor.doorSensor.emit('open');
}, 5000);

setTimeout(function(){
	monitor.doorSensor.emit('closed');
}, 10000);

process.on('uncaughtException', function(err) {
  console.log('Uncaught exception: ' + err);
  console.log(err.stack);
});

pinger.on('change', function (info) {
    var message = info.name + ': ' + info.action;
    // console.log(message);
    MQ.send({ type: 'message', text: message});
});

pinger.start();