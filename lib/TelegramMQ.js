var RedisSMQ = require('rsmq'),
	util = require('util'),
	events = require('events');

function TelegramMQ(config){
	config = config || {};
	this.init(config);
}

util.inherits(TelegramMQ, events.EventEmitter);

TelegramMQ.prototype.init = function(config) {
	var host = config.host || '127.0.0.1',
		port = config.port || 6379,
		ns   = config.ns   || 'rsmq';

	this.qName = config.qName || 'telegrammq';
	this.mq = new RedisSMQ({ host: host, port: port, ns: ns });
	
	this.mq.createQueue({ qname: this.qName }, function(err, resp){
		if(err){ 
			console.log(err);
		}else{
			console.log('Queue', this.qName, 'created', resp);
		}
	}.bind(this));	
};

TelegramMQ.prototype.start = function(pollInterval) {
	pollInterval = pollInterval || 500;
	this.interval = setInterval(function(){
		this.receive(function(error, message, complete){
			if(error) console.log('Error while receiving message:', error);

			if(message){
				this.emit('message', message, complete);
			}
		}.bind(this))
	}.bind(this), pollInterval);
};

TelegramMQ.prototype.send = function(message, callback) {
	callback = callback || function(){};
	this.mq.sendMessage({ qname: this.qName, message: JSON.stringify(message) }, callback);
};

TelegramMQ.prototype.receive = function(callback) {
	this.mq.receiveMessage({ qname: this.qName }, function(err, response){
		var arguments = [err];
		
		//Parse message back to object
		arguments.push(response ? _parseMessage(response.message) : null);
		
		//'complete' callback function to remove message from queue
		arguments.push(function(){
			_remove.call(this, response.id);
		}.bind(this));

		callback.apply(null, arguments);
	}.bind(this));
};

var _remove = function(id) {
	this.mq.deleteMessage({ qname: this.qName, id: id}, function(err, response){
		if(response === 1){
			console.log('Message', id, 'dequeued');
		}else{
			console.log('Message', id, 'not found');
		}
	});
};

var _parseMessage = function(message){
	if(message){
		try{
			return JSON.parse(message);
		}catch(e){
			return null;
		}
	}
	return null;
}

module.exports = TelegramMQ;
