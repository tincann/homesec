var monitor = new (require('./lib/HallMonitor.js'));

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


process.on('uncaughtException', function(err) {
  console.log('Uncaught exception: ' + err);
  console.log(err.stack);
});
