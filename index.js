const { getCurrency } = require('./currency');
const bot = require('./bot');
const Koa = require('koa');
const app = new Koa();
const config = require('./config.json')


global.gConfig = config;

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);

module.exports.bot = async (event) => {
  
  const body = JSON.parse(event.body);

  const msg = {
    'method': 'sendMessage',
    'chat_id': body.message.chat.id,
    'text': body.message.text
  };

  return {
    'statusCode': 200,
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify(msg),
    'isBase64Encoded': false
  };
};

setInterval(async () => {
  if(isWorkingTime() !== true) return;
  let rate = await getCurrency();
  bot.processNewRate(rate);
}, global.gConfig.currencyApiTimeout);

function getApiWorkingDate(){
  const now = new Date();

  return new Date(now.getTime() + (now.getTimezoneOffset() + global.gConfig.timezoneOffset) * 60000);
}

function isWorkingTime(){
  const date = getApiWorkingDate();

  const day = dae.getDay();
  if(day < 1 || day > 5) return false; // work from moday to friday

  const hours = date.getHours();
  // TODO check for 18-30
  if(hours < 10 || hours > 18) return false; // work from 10 till 18-30

  return true;
}