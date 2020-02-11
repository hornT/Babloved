const fetch = require("node-fetch");

setInterval(getCurrency, 5 * 1000 * 60);

async function getCurrency(){

  let response = await fetch('https://api.tinkoff.ru/v1/currency_rates?from=USD&to=RUB');

  if (response.ok) {
    let body = await response.json();
    parseResponse(body);
  } else {
    console.error("Error: " + response.status);
  }
}

function parseResponse(body){

  let rate = body.payload.rates.find((element, index) => element.category === 'SavingAccountTransfers');

  console.log(rate.buy);
}