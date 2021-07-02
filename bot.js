const config = require('./config');
const rates = require('./ratesDb');
const delta = config.RATE_DELTA;
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(config.BOT_ID, {
    polling: true,
});

let lastRate = 0;
let actualRate = 0;
let actualProRate = 0;

bot.onText(/\/rate/, (msg, match) => {

    const chatId = msg.chat.id;

    const rateStr = `${actualRate}, pro: ${actualProRate}`;
    bot.sendMessage(chatId, rateStr);

    console.log(`rate. chatid: ${chatId}, who: ${msg.from.first_name}`);
});

async function processNewRate(rate){
    console.log(`${(new Date()).toLocaleTimeString()} rate: ${rate.rate}, lastRate: ${lastRate}, proRate: ${rate.proRate}`);

    actualRate = rate.rate;
    actualProRate = rate.proRate;

    if(lastRate < 1) {
        lastRate = await rates.getLastRate();
    }

    await compareRate(rate);
}

async function compareRate(rateData){
    const rate = rateData.rate;
    const proRate = rateData.proRate;
    const diff = Number((rate - lastRate).toFixed(2));
    if(Math.abs(diff) < delta) return;

    lastRate = rate;

    let rateStr = `${rate}, pro: ${proRate}`;

    if (rate < config.VERY_BAD_RATE) rateStr = config.VERY_BAD_RATE_SMILE + ' ' + rateStr;
    else if (rate > config.VERY_GOOD_RATE) rateStr = config.VERY_GOOD_RATE_SMILE + ' ' + rateStr;
    rateStr += ' ' + (diff > 0 ? config.RATE_UP_SMILE : config.RATE_DOWN_SMILE);

    console.log(`new rate: ${rateStr}`);

    await rates.saveLastRate(lastRate);
    await sendRateMessage(rateStr);
}

async function sendRateMessage(rateStr){

    bot.sendMessage(config.CHAT_ID, rateStr);
}

module.exports = {
    processNewRate
};