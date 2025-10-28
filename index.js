require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const streamer = process.env.TWITCH_CHANNEL
const twToken = process.env.TWITCH_TOKEN
const twClient = process.env.TWITCH_CLIENT_ID
const twSecret = process.env.TWITCH_CLIENT_SECRET
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
    checkStreamStatus(ctx)
    ctx.reply('buttonInfo', { reply_markup: keyboard.reply_markup });
});

bot.on('text', (ctx) => {
    ctx.reply("Извините, я вас не понял, используйте кнопки.", { reply_markup: keyboard.reply_markup });
});

async function checkStreamStatus(ctx) {
    const opts = {
        client_id: twClient,
        client_secret: twSecret,
        grant_type: 'client_credentials',
        scopes: '',
    }
    const params = qs.stringify(opts)
    ctx.reply('checkStreamStatus')
    try {
        ctx.reply('try1') 
        const { data } = await axios.post(
            `https://id.twitch.tv/oauth2/token?${params}`
        )
    } catch (error) {
        ctx.reply('error1')
    }

    try {
        const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamer}`, {
            headers: {
                'Client-ID': twClient,
                'Authorization': twToken,
            },
        });
        ctx.reply('try')
        if (response.data.data.length > 0) {
            ctx.reply('Стрим идет!')
        } else {
            ctx.reply('Стрима нет!')
        }
    } catch (error) {
        ctx.reply('error')
        console.error("Error checking stream status:", error);
    }
}

// setInterval(checkStreamStatus, 60000);

bot.launch();

// Обработка завершения работы
process.once('SIGINT', () => bot.launch());
process.once('SIGTERM', () => bot.launch());