const { getCurrency } = require('./currency');
const bot = require('./bot');
const config = require('./config');

processApi();
setInterval(processApi, config.CURRENCY_API_TIMEOUT);

async function processApi(){
  if(isWorkingTime() !== true) {
    console.log('sleep');
    return;
  }
  let rate = await getCurrency();
  await bot.processNewRate(rate);
}

function isWorkingTime(){

  const date = getApiWorkingDate();

  const day = date.getDay();
  if(day < 1 || day > 5) return false; // work from moday to friday

  const hours = date.getHours();
  // TODO check for 18-30
  if(hours < 10 || hours > 18) return false; // work from 10 till 18-30

  return true;
}

function getApiWorkingDate(){
  const now = new Date();

  return new Date(now.getTime() + (now.getTimezoneOffset() + config.TIMEZONE_OFFSET) * 60000);
}