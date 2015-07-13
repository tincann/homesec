var config = require('../config.js');

function LocationTracker(messageQueue, pinger, tts) {
  this.messageQueue = messageQueue;
  this.pinger = pinger;
  this.tts = tts;
  this.init();
}

LocationTracker.prototype.init = function() {
    this.pinger.on('change', function (info) {
      var message = info.name + ': ' + info.action;
      // console.log(message);
      this.messageQueue.send({ type: 'message', text: message});

      var hour = new Date().getHours();
      
      //todo: don't hardcode
      if(hour >= 8 && hour <= 22){
        switch(info.action){
          case 'enter':
            this.tts.sayall(info.name + ' is almost home.');
            break;
          case 'leave':
            this.tts.sayall(info.name + ' has left the building.');
            break;
        }
      }
  }.bind(this));  
};

LocationTracker.prototype.start = function() {
  console.log('Location tracker started');
  this.pinger.start();
};

LocationTracker.prototype.stop = function() {
  console.log('Location tracker stopped');
  this.pinger.stop();
};

module.exports = LocationTracker;
