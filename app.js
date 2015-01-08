var TelegramAPI = require('./telegram-cli-wrapper/lib/telegram-api.js');

TelegramAPI.connect(function(connection){
	console.log(connection);
});