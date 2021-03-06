const {
    PORT = 5500,
    CURRENCY_API_TIMEOUT = 5 * 60 * 1000,
    CURRENCY_API_SLEEP_TIMEOUT = 60 * 60 * 1000,
    CURRENCY_API = 'https://api.tinkoff.ru/v1/currency_rates?from=USD&to=RUB',
    CURRENCY_CATEGORY = 'SavingAccountTransfers',
    PRO_CURRENCY_CATEGORY = 'CUTransfersPro',
    TIMEZONE_OFFSET = 180,
    RATE_DELTA = 0.2,
    BOT_ID,
    CHAT_ID,
    MONGOLAB_URI,
    VERY_BAD_RATE = 73,
    VERY_GOOD_RATE = 75,
    VERY_BAD_RATE_SMILE = '💩',
    VERY_GOOD_RATE_SMILE = '💲',
    RATE_UP_SMILE = '💪',
    RATE_DOWN_SMILE = '👿',
    START_TIME = '10:00',
    END_TIME = '21:00',
} = process.env;

module.exports = {
    PORT: Number(PORT),
    CURRENCY_API_TIMEOUT: Number(CURRENCY_API_TIMEOUT),
    CURRENCY_API_SLEEP_TIMEOUT: Number(CURRENCY_API_SLEEP_TIMEOUT),
    CURRENCY_API,
    CURRENCY_CATEGORY,
    PRO_CURRENCY_CATEGORY,
    TIMEZONE_OFFSET: Number(TIMEZONE_OFFSET),
    RATE_DELTA: Number(RATE_DELTA),
    BOT_ID,
    CHAT_ID: Number(CHAT_ID),
    MONGOLAB_URI,
    VERY_BAD_RATE: Number(VERY_BAD_RATE),
    VERY_GOOD_RATE: Number(VERY_GOOD_RATE),
    VERY_BAD_RATE_SMILE,
    VERY_GOOD_RATE_SMILE,
    RATE_UP_SMILE,
    RATE_DOWN_SMILE,
    START_TIME,
    END_TIME,
}