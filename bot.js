const axios = require('axios').default;
const config = require('./config')

let lastRate = 62.8;
const delta = config.RATE_DELTA;
const sendMesageUrl = `https://api.telegram.org/bot${config.BOT_ID}/sendMessage`;

async function processNewRate(rate){
    console.log(`rate: ${rate}`);

    if(Math.abs(rate - lastRate) < delta) return;

    lastRate = rate;
    
    await sendRateMessage(rate);
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