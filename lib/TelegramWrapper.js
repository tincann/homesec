var TelegramAPI = require('node-telegram-bot-api'),
    config = require('../config.js');

var api = new TelegramAPI(config.get('telegram').api_key, { polling: true});

api.on('message', function(message){
    console.log(message);
});

module.exports = {
	handleMessage: function(message) {
		console.log('Attempting to send message:', message.text || message.path);
		var groupId = config.get('telegram').group_id;
		var result;
		try{
			switch(message.type){
				case 'message':
					result = api.sendMessage(groupId, message.text);
					break;
				case 'image':
					result = api.sendPhoto(groupId, message.path);
					break;
				case 'animation':
					result = api.sendDocument(groupId, message.path);
					break;
				default:
					throw "Message type doesn't exist"
			}
		}catch(e){
			console.log("Couldn't send telegram message:", e);
			return;
		}
		
		message.__complete();

		//todo: only complete when message has been sent
		// result.then(function(){
		// 	message.__complete();
		// }).fail(function(e){
		// 	console.log("Couldn't send telegram message:", e);
		// });
	}
};
