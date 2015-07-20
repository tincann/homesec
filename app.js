var TelegramMQ = new (require('./lib/TelegramMQ.js')),
    config = require('./config.js'),
    tts = new (require('./lib/TTS.js'))(),
    ReedSwitch = require('./lib/ReedSwitch.js'),
    Camera = require('./fswebcam-wrapper/lib/Camera.js'),
    LocationTracker = require('./lib/LocationTracker.js'),
    pinger = new (require('./lib/Pinger.js'))(config.get('pinger'));


//Hallmonitor
var doorSensor = new ReedSwitch(config.get('doorsensor').pin_number, 100);
var camera = new Camera(config.get('camera'), __dirname + config.get('snapshot_path'));
var monitor = new (require('./lib/HallMonitor.js'))(TelegramMQ, doorSensor, camera);
monitor.start();

//Location tracker
var locationTracker = new LocationTracker(TelegramMQ, pinger, tts);
locationTracker.start();

TelegramMQ.send({ type: 'message', text: 'Starting homesec.' });

//Start with a test
setTimeout(function(){
  doorSensor.emit('open');
}, 5000);

setTimeout(function(){
  doorSensor.emit('closed');
}, 10000);


////////////
//Utility //
////////////
process.on('uncaughtException', function(err) {
  console.log('Uncaught exception: ' + err);
  console.log(err.stack);
});

console.log = (function(){
  var log = console.log;
  return function(){
    var date = '[' + new Date + ']';
    log.apply(console, [date].concat(Array.prototype.slice.call(arguments)));
  };
})();
