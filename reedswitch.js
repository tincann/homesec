var events = require('events'),
	util = require('util'),
	io = require('pi-gpio');


function ReedSwitch(pinNumber, pollInterval){
	this.pinNumber = pinNumber;
	this.pollInterval = pollInterval;
	this.init();
}

util.inherit(ReedSwitch, events.EventEmitter);

ReedSwitch.prototype.init = function() {
	io.open(this.pinNumber, "input", function(){
		this.interval = setInterval(this.poll.bind(this), this.pollInterval);
	});
};

ReedSwitch.prototype.poll = function() {
	io.read(this.pinNumber, function(err, value){
		if(err) throw err;
		console.log(value);

		if(value){
			this.emit('open');
		}

	}.bind(this));
};

modules.export = ReedSwitch;