const axios = require('axios').default;
const config = require('./config');
const MongoClient = require('mongodb').MongoClient;
const delta = config.RATE_DELTA;
const sendMesageUrl = `https://api.telegram.org/bot${config.BOT_ID}/sendMessage`;


let lastRate = 0; //62.8;
let id;

async function processNewRate(rate){
    console.log(`rate: ${rate}, lastRate: ${lastRate}`);

    if(lastRate < 1) await initLastRate();

    await compareRate(rate);
}

async function initLastRate(callback){
    const client = await MongoClient.connect(config.MONGOLAB_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db('babloved');
    const collection = db.collection("rates");
    const result = await collection.findOne({});

    lastRate = result.last;
    id = result._id;

    console.log(`init last: ${lastRate}`);

    client.close();
}

async function compareRate(rate){
    const diff = rate - lastRate;
    if(Math.abs(diff) < delta) return;

    lastRate = rate;

    let rateStr = String(rate);
    if (rate < 61) rateStr = ':japanese_goblin: ' + rateStr;
    rateStr += ' ' + diff > 0 ? ':point_up:' : ':point_down:';

    await saveRate(lastRate);
    //await sendRateMessage(rateStr);
}

async function saveRate(lastRate){
    const client = await MongoClient.connect(config.MONGOLAB_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db('babloved');
    const collection = db.collection("rates");

    const rate = {
        last: lastRate,
    };

    await collection.updateOne(
        { "_id": id },
        { $set: rate }
    );

    console.log(`update last: ${lastRate}`);

    client.close();
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