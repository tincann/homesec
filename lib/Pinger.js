var ping = require('ping'),
    util = require('util'),
    events = require('events');

var defaultConfig = {
    interval: 5000,
    timeout: 10000
}

function Pinger(config){
    this.interval = config.interval || defaultConfig.interval;
    this.timeout = config.timeout || defaultConfig.timeout;
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

    var self = this;
    //Initialise host list
    var hosts = Object.keys(this.hostmap);
    hosts.forEach(function(hostname){
        self.history[hostname] = {
            active: false,
            timeoutHandle: null
        };
    });

    this.intervalHandle = setInterval(function(){        
        hosts.forEach(function(hostname){
            ping.sys.probe(self.hostmap[hostname], function(active){
                self._checkHistory(hostname, active);
            });
        });
    }, this.interval);
};

Pinger.prototype._checkHistory = function(hostname, active) {
    //What was the previous state?
    var previouslyActive = this.history[hostname].active;
    
    //Write history
    var history = this.history[hostname];
    history.active = active;

    //If state has changed
    if(previouslyActive != active){

        //If time has changed when there is an active `timeout`, then ignore it.
        if(history.timeoutHandle !== null){
            clearTimeout(history.timeoutHandle);
            history.timeoutHandle = null;
            return;
        }

        var self = this;
        history.timeoutHandle = setTimeout(function(){
            //Emit the enter/leave event
            self.emit('change', { name: hostname, action: active ? 'enter' : 'leave' });
        }, this.timeout);
    }
};

Pinger.prototype.stop = function() {
    clearInterval(this.intervalHandle);
};

module.exports = Pinger;
