const config = require('./config');
const rates = require('./ratesDb');
const delta = config.RATE_DELTA;
const Agent = require('socks5-https-client/lib/Agent');
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(config.BOT_ID, {
    polling: true,
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: '127.0.0.1',
            socksPort: '9150'
        }
    }
});

let lastRate = 0;
let actualRate = 0;

bot.onText(/\/echo (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const resp = match[1];
  
    console.log(`chatid: ${chatId}, resp: ${resp}`);
});
  
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if(msg.text === '/rate'){
        bot.sendMessage(chatId, actualRate);
        return;
    }
    
    bot.sendMessage(chatId, `Получили твое сообщение! ${config.RATE_UP_SMILE} Спасибо! @${msg.from.first_name}`);

    console.log(`chatid: ${chatId}, text: ${msg.text}`);
    console.log(msg);
});

async function processNewRate(rate){
    console.log(`${(new Date()).toLocaleTimeString()} rate: ${rate}, lastRate: ${lastRate}`);

    actualRate = rate;
    if(lastRate < 1) {
        lastRate = await rates.getLastRate();
    }

    await compareRate(rate);
}

async function compareRate(rate){
    const diff = Number((rate - lastRate).toFixed(2));
    if(Math.abs(diff) < delta) return;

    lastRate = rate;

    let rateStr = String(rate);

    if (rate < config.VERY_BAD_RATE) rateStr = config.VERY_BAD_RATE_SMILE + ' ' + rateStr;
    else if (rate > config.VERY_GOOD_RATE) rateStr = config.VERY_GOOD_RATE_SMILE + ' ' + rateStr;
    rateStr += ' ' + (diff > 0 ? config.RATE_UP_SMILE : config.RATE_DOWN_SMILE);

    console.log(`new rate: ${rateStr}`);

    await rates.saveLastRate(lastRate);
    await sendRateMessage(rateStr);
}

async function sendRateMessage(rate){

    bot.sendMessage(config.CHAT_ID, rate);
}

module.exports = {
    processNewRate
};