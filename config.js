var config = { 
    telegram: {
        api_key: ''
    }
    snapshot_path:  __dirname + '/snapshots/',
    pinger: {
        interval:   5000,
        hostmap: {
            //name : 'ipaddress'       
        }
    },
    camera: {
        device: '/dev/video0',
        rotate: 90,
        title: 'HomeSec',
        subtitle: 'Hallway#1',
        timestamp: '%Y-%m-%d %H:%M:%S (%Z)'
    }
};

exports.get = function(key){
    var value;
    if((value = config[key]) !== undefined){
        return value;
    }

    throw new Error('Key ' + key + ' not defined');
}
