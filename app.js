var TelegramAPI = require('./telegram-cli-wrapper/lib/telegram-api.js'),
	io = require('pi-gpio'),
	ReedSwitch = require('./lib/reedswitch.js'),
	Camera = require('./fswebcam-wrapper/lib/fswebcam-wrapper.js');

var rs = new ReedSwitch(7, 500);
var hallwayCam = new Camera({
    device: '/dev/video0',
    rotate: 90,
    title: 'HomeSec',
    subtitle: 'Hallway#1'
});

TelegramAPI.connect(function(connection){
	rs.on('open', function(){
		console.log('open', new Date);
		var imgPath = __dirname + '/snapshots/' + new Date + '.jpg';
		hallwayCam.capture(imgPath);
	   	connection.send('HomeSec', 'Inbreker alert ' + new Date);
	   	setTimeout(function(){
	   		connection.sendImage('HomeSec', imgPath);	
	   	}, 1500);
	});
});