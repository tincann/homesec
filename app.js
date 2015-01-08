var TelegramAPI = require('./telegram-cli-wrapper/lib/telegram-api.js'),
	io = require('pi-gpio'),
	ReedSwitch = require('./reedswitch.js');

var rs = new ReedSwitch(7, 500);

rs.on('open', function(){
	console.log(+new Date);
});

TelegramAPI.connect(function(connection){
	console.log(connection);
});