var TelegramBot = require('node-telegram-bot-api');

var bot = new TelegramBot(config.get('telegram.api_key'), { polling: true});

bot.on('message', function(message){
    console.log(message);
});
