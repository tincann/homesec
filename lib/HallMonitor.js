var TelegramWrapper = require('./TelegramWrapper.js'),
	Camera = require('../fswebcam-wrapper/lib/Camera.js');

var moment = require('moment'),
	path = require('path')
	config = require('../config.js');


function HallMonitor(messageQueue, doorSensor, camera){
	this.messageQueue = messageQueue;
	this.doorSensor = doorSensor;
	this.camera = camera;
	this.bindEvents();
}

HallMonitor.prototype.bindEvents = function() {
	this.messageQueue.on('message', function(message){
		TelegramWrapper.handleMessage(message);
	});

	this.doorSensor.on('open', this.onDoorOpen.bind(this));
	this.doorSensor.on('closed', this.onDoorClose.bind(this));
};

HallMonitor.prototype.onDoorOpen = function() {
	console.log('open');
	this.messageQueue.send({ type: 'message', text: 'Inbreker alert ' + new Date });
	console.log(this.camera);
	this.camera.startCapture(500);

	setTimeout(function(){
		this.camera.makeAnimation('during.gif', function(gifPath){
			this.messageQueue.send({ type: 'animation', path: gifPath });
		}.bind(this));
	}.bind(this), 2000);
};

HallMonitor.prototype.onDoorClose = function() {
	console.log('close');

	this.camera.stopCapture(function(gifPath){
		this.messageQueue.send({ type: 'animation', path: gifPath});
	}.bind(this));
};

HallMonitor.prototype.start = function() {
	this.messageQueue.start();
};

module.exports = HallMonitor;
