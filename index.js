const { getCurrency } = require('./currency');
const bot = require('./bot');

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
  let rate = await getCurrency();
  bot.processNewRate(rate);
}, 5 * 1000);
