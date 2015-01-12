var TelegramMQ = require('./lib/TelegramMQ.js'),
	TelegramWrapper = require('./lib/TelegramWrapper.js'),
	Camera = require('./fswebcam-wrapper/lib/fswebcam-wrapper.js');

console.log = (function(){
	var log = console.log;
	return function(){
		var date = '[' + new Date + ']';
		log.apply(console, [date].concat(Array.prototype.slice.call(arguments)));
	};
})();

var tQueue = new TelegramMQ();

var hallwayCam = new Camera({
    device: '/dev/video0',
    rotate: 90,
    title: 'HomeSec',
    subtitle: 'Hallway#1'
});

console.log('open', new Date);
var imgPath = __dirname + '/snapshots/' + new Date + '.jpg';

tQueue.on('message', function(message, complete){
	TelegramWrapper.handleMessage(message, complete);
});

setInterval(function(){
	tQueue.send({ type: 'message', text: 'Inbreker alert ' + new Date });

	hallwayCam.capture(imgPath, function(){
		tQueue.send({ type: 'image', path: imgPath});
	});

}, 10000);

tQueue.start();
