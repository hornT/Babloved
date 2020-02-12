const axios = require('axios').default;
const config = require('./config')
const currCategory = config.CURRENCY_CATEGORY;

async function getCurrency () {
    const { data: { payload: { rates } } } = await axios.get(config.CURRENCY_API);
    const rate = rates.find(e => e.category === currCategory);

    return rate.buy;
}


module.exports = {
    getCurrency
};
