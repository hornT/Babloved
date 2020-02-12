const {
    PORT = 5000,
    CURRENCY_API_TIMEOUT = 5 * 60 * 1000,
    CURRENCY_API = 'https://api.tinkoff.ru/v1/currency_rates?from=USD&to=RUB',
    CURRENCY_CATEGORY = 'SavingAccountTransfers',
    TIMEZONE_OFFSET = 180,
    RATE_DELTA = 0.2,
    BOT_ID,
    CHAT_ID,
} = process.env;

module.exports = {
    PORT: Number(PORT),
    CURRENCY_API_TIMEOUT: Number(CURRENCY_API_TIMEOUT),
    CURRENCY_API,
    CURRENCY_CATEGORY,
    TIMEZONE_OFFSET: Number(TIMEZONE_OFFSET),
    RATE_DELTA: Number(RATE_DELTA),
    BOT_ID,
    CHAT_ID: Number(CHAT_ID),
}