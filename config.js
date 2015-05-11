var config = { 
    telegram_group: 'HomeSec',
    snapshot_path:  __dirname + '/snapshots/',
    pinger: {
        interval:   5000,
        hostmap: {
            //name : 'ipadress'
            
        }
    }
};

exports.get = function(key){
    var value;
    if((value = config[key]) !== undefined){
        return value;
    }

    throw new Error('Key ' + key + ' not defined');
}
