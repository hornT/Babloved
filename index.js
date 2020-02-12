const { getCurrency } = require('./currency');
const bot = require('./bot');
const Koa = require('koa');
const app = new Koa();
const config = require('./config.json')



config.botId = config.botId || process.env.BOT_ID;
config.chatId = config.chatId || process.env.CHAT_ID;
global.gConfig = config;

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(process.env.PORT || 5000);

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

setInterval(processApi, global.gConfig.currencyApiTimeout);

async function processApi(){
  if(isWorkingTime() !== true) return;
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

  return new Date(now.getTime() + (now.getTimezoneOffset() + global.gConfig.timezoneOffset) * 60000);
}