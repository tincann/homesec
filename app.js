var ReedSwitch = require('./lib/ReedSwitch.js'),
	TelegramMQ = require('./lib/TelegramMQ.js'),
	TelegramWrapper = require('./lib/TelegramWrapper.js'),
	Camera = require('./fswebcam-wrapper/lib/fswebcam-wrapper.js'),
	moment = require('moment');

console.log = (function(){
	var log = console.log;
	return function(){
		var date = '[' + new Date + ']';
		log.apply(console, [date].concat(Array.prototype.slice.call(arguments)));
	};
})();

var tQueue = new TelegramMQ();

var rs = new ReedSwitch(7, 500);
var hallwayCam = new Camera({
    device: '/dev/video0',
    rotate: 90,
    title: 'HomeSec',
    subtitle: 'Hallway#1'
});

tQueue.on('message', function(message){
	TelegramWrapper.handleMessage(message);
});

rs.on('open', function(){
	console.log('open');
	tQueue.send({ type: 'message', text: 'Inbreker alert ' + new Date });
	var imgPath = __dirname + '/snapshots/' + moment().format('YYYY-MM-DD HH-mm-ss [UTC]') + '.jpg';
	hallwayCam.capture(imgPath, function(){
		tQueue.send({ type: 'image', path: imgPath}, function(err, res){
			console.log(err, res);
		});
	});
});

tQueue.start();

process.on('uncaughtException', function(err) {
  console.log('Uncaught exception: ' + err);
  console.log(err.stack);
});
