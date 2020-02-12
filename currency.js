const axios = require('axios').default;


async function getCurrency () {
    const { data: { payload: { rates } } } = await axios.get(global.gConfig.currencyApi);
    const rate = rates.find(e => e.category === global.gConfig.currencyCategory);

    return rate.buy;
}


module.exports = {
    getCurrency
};
