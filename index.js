require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const streamer = process.env.TWITCH_CHANNEL
const link = `https://www.twitch.com/${streamer}`;

const buttonSubscribe = { text: 'Подписаться на уведомления' };
const buttonUnsubscribe = { text: 'Отписаться от уведомлений' };
const buttonInfo = { text: 'Информация о подписке' };

const keyboard = {
    reply_markup: {
        keyboard: [[buttonSubscribe, buttonUnsubscribe], [buttonInfo]],
        resize_keyboard: true,
        one_time_keyboard: true,
    },
};

// Обработчик команды /start
bot.start((ctx) => {
    ctx.reply(`Привет! Это бот для уведомлений о стримах на канале [${streamer}](${link}).`, {
        parse_mode: 'Markdown',
        reply_markup: keyboard.reply_markup,
    });
});

bot.hears(buttonSubscribe.text, (ctx) => {
        ctx.reply('buttonSubscribe', { reply_markup: keyboard.reply_markup });
});

bot.hears(buttonUnsubscribe.text, (ctx) => {
    ctx.reply('buttonUnsubscribe', { reply_markup: keyboard.reply_markup });
});

bot.hears(buttonInfo.text, (ctx) => {
    ctx.reply('buttonInfo', { reply_markup: keyboard.reply_markup });
});
 
bot.on('text', (ctx) => {
    ctx.reply("Извините, я вас не понял, используйте кнопки.", { reply_markup: keyboard.reply_markup });
});

bot.launch();

// Обработка завершения работы
process.once('SIGINT', () => bot.launch());
process.once('SIGTERM', () => bot.launch());