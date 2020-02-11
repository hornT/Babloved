const axios = require('axios').default;


async function getCurrency () {
    const { data: { payload: { rates } } } = await axios.get('https://api.tinkoff.ru/v1/currency_rates?from=USD&to=RUB');
    const rate = rates.find(e => e.category === 'SavingAccountTransfers');

    return rate.buy;
}


module.exports = {
    getCurrency,
};
