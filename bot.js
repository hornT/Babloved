const axios = require('axios').default;

let lastRate = 0.0;

async function processNewRate(rate){
    console.log(`rate: ${rate}`);

    if(Math.abs(rate - lastRate) < global.gConfig.rateDelta) return;

    lastRate = rate;
    await sendRateMessage(rate);
}

async function sendRateMessage(rate){
    const message = {
        chat_id: global.gConfig.chatId,
        text: rate
    }

    const url = `https://api.telegram.org/bot${global.gConfig.botId}/sendMessage`;

    //const response = await axios.post('https://api.telegram.org/bot1001880691:AAGT4bSPR4XZx-E9hhXq1U_5aYDUHo1ceWg/sendMessage', message);
    const response = await axios.post(url, message);
}

module.exports = {
    processNewRate
};