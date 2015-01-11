var TelegramAPI = require('./telegram-cli-wrapper/lib/telegram-api.js'),
	io = require('pi-gpio'),
	ReedSwitch = require('./lib/reedswitch.js');

var rs = new ReedSwitch(7, 500);

TelegramAPI.connect(function(connection){
	rs.on('open', function(){	
	   connection.send('HomeSec', 'Inbreker alert ' + new Date);
	});
});