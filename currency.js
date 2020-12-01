const axios = require('axios').default;
const config = require('./config')
const currCategory = config.CURRENCY_CATEGORY;
const proCategory = config.PRO_CURRENCY_CATEGORY;

async function getCurrency () {
    const { data: { payload: { rates } } } = await axios.get(config.CURRENCY_API);
    const rate = rates.find(e => e.category === currCategory);
    const proRate = rates.find(e => e.category === proCategory);

    return {proRate: proRate.buy, rate: rate.buy} ;
}


module.exports = {
    getCurrency
};