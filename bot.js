const axios = require('axios').default;
const config = require('./config')

let lastRate = 62.8;
const delta = config.RATE_DELTA;
const sendMesageUrl = `https://api.telegram.org/bot${config.BOT_ID}/sendMessage`;

async function processNewRate(rate){
    console.log(`rate: ${rate}`);

    const diff = rate - lastRate;
    if(Math.abs(diff) < delta) return;

    lastRate = rate;

    let rateStr = String(rate);
    if (rate < 61) rateStr = ':japanese_goblin: ' + rateStr;
    rateStr += ' ' + diff > 0 ? ':point_up:' : ':point_down:';

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