var events = require('events'),
	util = require('util');

if(!process.env.debug){
	io = require('pi-gpio');
}

function ReedSwitch(pinNumber, pollInterval){
	this.pinNumber = pinNumber;
	this.pollInterval = pollInterval;
	this.open = false;
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
			if(!this.open){
				this.open = true;
				this.emit('open');
			}
		}else{
			if(this.open){
				this.emit('closed');
			}
			this.open = false;
		}
	}.bind(this));
};

module.exports = ReedSwitch;
