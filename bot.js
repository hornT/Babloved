const axios = require('axios').default;
const config = require('./config');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(config.MONGOLAB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const delta = config.RATE_DELTA;
const sendMesageUrl = `https://api.telegram.org/bot${config.BOT_ID}/sendMessage`;


let lastRate = 0; //62.8;
let id;

function processNewRate(rate){
    console.log(`rate: ${rate}, lastRate: ${lastRate}`);

    // if(lastRate < 1) {
    //     initLastRate(() => compareRate(rate));
    //     return;
    // }

    console.log('diff');
    compareRate(rate);
}

function initLastRate(callback){
    console.log('initLastRate');

    client.connect(err => {
        if(err){
            console.log(`err: ${err}`);
            return;
        }

        const collection = getRateCollection();

        collection.findOne({}, (findErr, result) => {
            if (findErr) throw findErr;

            lastRate = result.last;
            id = result._id;
            console.log(`init last: ${lastRate}, id: ${id}`);

            client.close();
            callback();
        });
    });
}

function compareRate(rate){
    const diff = rate - lastRate;
    if(Math.abs(diff) < delta) return;

    lastRate = rate;

    let rateStr = String(rate);
    if (rate < 61) rateStr = ':japanese_goblin: ' + rateStr;
    rateStr += ' ' + diff > 0 ? ':point_up:' : ':point_down:';

    saveRate(lastRate);
    //await sendRateMessage(rateStr);
}

function saveRate(lastRate){
    console.log('saveRate');

    client.connect(err => {
        console.log('saveRate1');
        if(err){
            console.log(`err: ${err}`);
            return;
        }

        const collection = getRateCollection();
        console.log('saveRate2');
        const rate = {
            last: lastRate,
            _id: id
        };
        console.log(`test1`);
        collection.insertOne(rate, (insertErr, result) => {
            if (insertErr) { 
                console.log(`insert error: ${insertErr}`);
            }
        });
        // collection.updateOne({_id: id}, rate, (insertErr, result) => {
        //     if (insertErr) { 
        //         console.log(`insert error: ${insertErr}`);
        //     }
        // });
        console.log(`save last: ${lastRate}`);
        client.close();
    });
}

function getRateCollection(){
    return client.db("babloved").collection("rates");
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