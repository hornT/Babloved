const { getCurrency } = require('./currency');
const bot = require('./bot');
const config = require('./config');
const {startTime, endTime} = getStartEndTime();

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

  return startTime < date && date < endTime;
}

function getApiWorkingDate(){
  const now = new Date();

  return new Date(now.getTime() + (now.getTimezoneOffset() + config.TIMEZONE_OFFSET) * 60000);
}

function getStartEndTime(){
  let startTime = new Date();
  let endTime = new Date();

  const valueStart = config.START_TIME.split(':');
  const valueEnd = config.END_TIME.split(':');

  startTime.setHours(valueStart[0], valueStart[1], 0);
  endTime.setHours(valueEnd[0], valueEnd[1], 0);

  console.log(`startTime: ${startTime}, endTime: ${endTime}`);

  return {startTime, endTime};
}