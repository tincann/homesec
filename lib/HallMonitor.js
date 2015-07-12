var ReedSwitch = require('./ReedSwitch.js'),
	TelegramWrapper = require('./TelegramWrapper.js'),
	Camera = require('../fswebcam-wrapper/lib/Camera.js');

var moment = require('moment'),
	path = require('path')
	config = require('../config.js');


function HallMonitor(messageQueue){
	this.telegramQueue = messageQueue;
	this.doorSensor = new ReedSwitch(7, 500);
	this.camera = new Camera(config.get('camera'), config.get('snapshot_path'));
	this.bindEvents();
}

HallMonitor.prototype.bindEvents = function() {
	this.telegramQueue.on('message', function(message){
		TelegramWrapper.handleMessage(message);
	});

	this.doorSensor.on('open', this.onDoorOpen.bind(this));
	this.doorSensor.on('closed', this.onDoorClose.bind(this));
};

HallMonitor.prototype.onDoorOpen = function() {
	console.log('open');
	this.telegramQueue.send({ type: 'message', text: 'Inbreker alert ' + new Date });
	
	this.camera.startCapture(500);

	setTimeout(function(){
		this.camera.makeAnimation('during.gif', function(gifPath){
			this.telegramQueue.send({ type: 'animation', path: gifPath });
		}.bind(this));
	}.bind(this), 2000);
};

HallMonitor.prototype.onDoorClose = function() {
	console.log('close');

	this.camera.stopCapture(function(gifPath){
		this.telegramQueue.send({ type: 'animation', path: gifPath});
	}.bind(this));
};

HallMonitor.prototype.start = function() {
	this.telegramQueue.start();
};

module.exports = HallMonitor;
