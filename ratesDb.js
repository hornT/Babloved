const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

async function getLastRate(){
    const client = await MongoClient.connect(config.MONGOLAB_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db('babloved');
    const collection = db.collection("rates");
    const result = await collection.findOne({type: 'last'});

    const lastRate = result.rate;
    console.log(`init last: ${lastRate}`);

    client.close();

    return lastRate;
}

async function saveLastRate(lastRate){
    const client = await MongoClient.connect(config.MONGOLAB_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db('babloved');
    const collection = db.collection("rates");
    const historyCollection = db.collection("history");

    const rate = {
        rate: lastRate,
    };

    await collection.updateOne(
        { type: 'last' },
        { $set: rate }
    );

    await historyCollection.insertOne(
        {
            date: new Date(),
            rate: lastRate
        }
    );

    console.log(`update last: ${lastRate}`);

    client.close();
}

module.exports = {
    getLastRate,
    saveLastRate,
}