var config = { 
    telegram_group: 'HomeSec'
};

exports.get = function(key){
    var value;
    if((value = config[key]) !== undefined){
        return value;
    }

    throw new Error('Key ' + key + ' not defined');
}
