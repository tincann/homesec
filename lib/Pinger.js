var ping = require('ping'),
    util = require('util'),
    events = require('events');

var defaultConfig = {
    interval: 5000,
    timeout: 15000
}

function Pinger(config){
    this.interval = config.interval || defaultConfig.interval;
    this.timeout = config.timeout || defaultConfig.timeout;
    this.hostmap = config.hostmap || [];
    this.intervalHandle = null;
    this.history = {};
}

util.inherits(Pinger, events.EventEmitter);

Pinger.prototype.init = function() {
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
};

Pinger.prototype.start = function() {
    if(!this.hostmap){
        console.log('No hostmap specified.');
        return;
    }

    this.stop();
    
    this.init();

    this.intervalHandle = setInterval(function(){
        this.scan(hosts);
    }, this.interval);
};

Pinger.prototype.scan = function(hosts) {
    hosts.forEach(function(hostname){
        ping.sys.probe(self.hostmap[hostname], function(active){
            self._checkHistory(hostname, active);
        });
    });
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
        if(active && history.timeoutHandle !== null){
            console.log('clearing timeout for', hostname, 'because became active again');
            clearTimeout(history.timeoutHandle);
            history.timeoutHandle = null;
            return;
        }

        //No delay if changing to active
        var timeout = active ? 0 : this.timeout;

        var self = this;
        console.log('setting timeout for', hostname);
        history.timeoutHandle = setTimeout(function(){
            //Emit the enter/leave event
            self.emit('change', { name: hostname, action: active ? 'enter' : 'leave' });
            history.timeoutHandle = null;
        }, timeout);
    }
};

Pinger.prototype.stop = function() {
    clearInterval(this.intervalHandle);
};

module.exports = Pinger;
