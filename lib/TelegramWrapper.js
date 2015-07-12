var TelegramAPI = require('node-telegram-bot-api'),
    config = require('../config.js');

var api = new TelegramAPI(config.get('telegram').api_key, { polling: true});

api.on('message', function(message){
    console.log(message);
});

module.exports = {
	handleMessage: function(message) {
		console.log('Attempting to send message:', message);
		var groupId = config.get('telegram').group_id;
		var result;
		switch(message.type){
			case 'message':
				result = api.sendMessage(group_id, message.text);
				break;
			case 'image':
				result = api.sendPhoto(group_id, message.path);
				break;
			case 'animation':
				result = api.sendDocument(group_id, message.path);
				break;
		}

		result.then(function(){
			message.__complete();
		}).fail(function(e){
			console.log("Couldn't send telegram message:", e);
		});
	}
};
