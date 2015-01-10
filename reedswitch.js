var events = require('events'),
	util = require('util'),
	io = require('pi-gpio');

var STATE = {
	CLOSED: 0,
	OPEN: 1
};

function ReedSwitch(pinNumber, pollInterval){
	this.pinNumber = pinNumber;
	this.pollInterval = pollInterval;
	this.init();
	this.state 
}

util.inherits(ReedSwitch, events.EventEmitter);

ReedSwitch.prototype.init = function() {
	io.close(this.pinNumber);
	io.open(this.pinNumber, "input", function(){
		this.interval = setInterval(this.poll.bind(this), this.pollInterval);
	}.bind(this));
};

ReedSwitch.prototype.poll = function() {
	io.read(this.pinNumber, function(err, value){
		if(err) throw err;

		if(value){
			if(this.state === STATE.CLOSED){
				this.state = STATE.OPEN;
				this.emit('open');
			}
		}else{
			this.state = STATE.CLOSED;
		}
	}.bind(this));
};

module.exports = ReedSwitch;
