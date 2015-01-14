var TelegramAPI = require('../telegram-cli-wrapper/lib/telegram-api.js'),
	config = require('../config.js');

function TelegramWrapper(){
	this.connection = null;
	this.init();
}

TelegramWrapper.prototype.handleMessage = function(message) {
	if(this.connection && this.connection.open){
		console.log('Attempting to send message:', message);
		switch(message.type){
			case 'message':
				this.connection.send(config.get('telegram_group'), message.text);
				break;
			case 'image':
				this.connection.sendImage(config.get('telegram_group'), message.path);
				break;
		}
		message.__complete();
	}else{
		console.log('Not connected to TelegramAPI');
	}
};

TelegramWrapper.prototype.init = function() {
	console.log('Connecting to TelegramAPI...');
	TelegramAPI.connect(function(connection) {
		console.log('Succesfully connected to TelegramAPI');
		
		this.connection = connection;
		connection.on('error', function(e){
			console.log('TelegramAPI connection error:', e);
		});

		connection.on('disconnect', function(){
			console.log('TelegramAPI connection closed');
			this.connection = null;
			//Restart connection
			TelegramAPI.disconnect();
			process.nextTick(this.init.bind(this));
		}.bind(this));
	}.bind(this));
};

module.exports = new TelegramWrapper;