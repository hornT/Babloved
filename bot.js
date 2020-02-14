const axios = require('axios').default;
const config = require('./config');
const rates = require('./ratesDb');
const delta = config.RATE_DELTA;
const sendMesageUrl = `https://api.telegram.org/bot${config.BOT_ID}/sendMessage`;


let lastRate = 0;

async function processNewRate(rate){
    console.log(`rate: ${rate}, lastRate: ${lastRate}`);

    if(lastRate < 1) lastRate = await rates.getLastRate();

    await compareRate(rate);
}

async function compareRate(rate){
    const diff = rate - lastRate;
    if(Math.abs(diff) < delta) return;

    lastRate = rate;

    let rateStr = String(rate);
    if (rate < config.VERY_BAD_RATE) rateStr = config.VERY_BAD_RATE_SMILE + ' ' + rateStr;
    rateStr += ' ' + (diff > 0 ? config.RATE_UP_SMILE : config.RATE_DOWN_SMILE);

    console.log(`new rate: ${rateStr}`);

    await rates.saveLastRate(lastRate);
    await sendRateMessage(rateStr);
}

async function sendRateMessage(rate){
    const message = {
        chat_id: config.CHAT_ID,
        text: rate
    }

    const response = await axios.post(sendMesageUrl, message);
}

module.exports = {
    processNewRate
};