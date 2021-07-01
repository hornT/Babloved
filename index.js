const { getCurrency } = require('./currency');
const bot = require('./bot');
const config = require('./config');

processApi();
setInterval(processApi, config.CURRENCY_API_TIMEOUT);

async function processApi(){
  if(isWorkingTime() !== true) {
    console.log(`sleep ${new Date()}`);
    return;
  }
  let rate = await getCurrency();
  await bot.processNewRate(rate);
}

function isWorkingTime(){

  const date = new Date();

  const day = date.getDay();
  if(day < 1 || day > 5) return false; // work from moday to friday

  const {startTime, endTime} = getStartEndTime();

  return startTime < date && date < endTime;
}

function getStartEndTime(){
  let startTime = new Date();
  let endTime = new Date();

  const valueStart = config.START_TIME.split(':');
  const valueEnd = config.END_TIME.split(':');

  startTime.setHours(valueStart[0], valueStart[1], 0);
  endTime.setHours(valueEnd[0], valueEnd[1], 0);

  return {startTime, endTime};
}