var ping = require('ping'),
    util = require('util'),
    events = require('events');

var defaultConfig = {
    interval: 5000
}

function Pinger(config){
    this.interval = config.interval || defaultConfig.interval;
    this.hostmap = config.hostmap || [];
    this.intervalHandle = null;
    this.history = {};
}

util.inherits(Pinger, events.EventEmitter);

Pinger.prototype.start = function() {
    if(!this.hostmap){
        console.log('No hostmap specified.');
        return;
    }

    console.log('hostmap:', this.hostmap);

    this.intervalHandle = setInterval(function(){
        var hosts = Object.keys(this.hostmap);
        hosts.forEach(function(hostname){
            ping.sys.probe(this.hostmap[hostname], function(active){
                this._checkHistory(hostname, active);
            }.bind(this));
        }.bind(this));
    }.bind(this), this.interval);
};

Pinger.prototype._checkHistory = function(hostname, active) {
    //What was the previous state?
    var previouslyActive = this.history[hostname] || false;
    
    //Write history
    this.history[hostname] = active;

    //If state has changed
    if(previouslyActive != active){

        //Emit the enter/leave event
        this.emit('change', { name: hostname, action: active ? 'enter' : 'leave' });
    }
};

Pinger.prototype.stop = function() {
    clearInterval(this.intervalHandle);
};

module.exports = Pinger;
