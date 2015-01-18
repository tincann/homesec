var ReedSwitch = require('./ReedSwitch.js'),
	TelegramMQ = require('./TelegramMQ.js'),
	TelegramWrapper = require('./TelegramWrapper.js'),
	Camera = require('../fswebcam-wrapper/lib/fswebcam-wrapper.js');

var moment = require('moment'),
	path = require('path')
	config = require('../config.js');


function HallMonitor(){
	this.telegramQueue = new TelegramMQ();
	this.doorSensor = new ReedSwitch(7, 500);
	this.camera = new Camera({
	    device: '/dev/video0',
	    rotate: 90,
	    title: 'HomeSec',
	    subtitle: 'Hallway#1'
	});
	this.bindEvents();
}

HallMonitor.prototype.bindEvents = function() {
	this.telegramQueue.on('message', function(message){
		TelegramWrapper.handleMessage(message);
	});

	this.doorSensor.on('open', this.onDoorOpen.bind(this));
};

HallMonitor.prototype.onDoorOpen = function() {
	console.log('open');
	this.telegramQueue.send({ type: 'message', text: 'Inbreker alert ' + new Date });

	var imgPath = this.getImgPath(moment().format('YYYY-MM-DD HH-mm-ss [UTC]'));
	this.takeSnapshot(imgPath);
};

HallMonitor.prototype.takeSnapshot = function(imgPath) {

	this.camera.capture(imgPath, function(){
		this.telegramQueue.send({ type: 'image', path: imgPath}, function(err, res){
			console.log(err, res);
		});
	}.bind(this));
};

HallMonitor.prototype.getImgPath = function(folderName) {
	return path.join(config.get('snapshot_path'), folderName + '.jpg');
};

HallMonitor.prototype.start = function() {
	this.telegramQueue.start();
};


module.exports = HallMonitor;