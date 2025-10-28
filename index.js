require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const streamer = process.env.TWITCH_CHANNEL
const link = `https://www.twitch.com/${streamer}`; 

// // Функция для проверки статуса стрима
// async function checkStreamStatus(ctx) {
//     ctx.reply('Checking stream status...');
//     const clientId = process.env.TWITCH_CLIENT_ID;
//     const clientSecret = process.env.TWITCH_CLIENT_SECRET;
//
//     // Получаем токен для доступа к API Twitch
//     const authResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
//         params: {
//             client_id: clientId,
//             client_secret: clientSecret,
//             grant_type: 'client_credentials'
//         }
//     });
//
//     const { access_token } = authResponse.data;
//
//     ctx.reply(access_token);
//
//     // Проверяем статус стрима
//     const streamResponse = await axios.get('https://api.twitch.tv/helix/streams', {
//         headers: {
//             'Client-ID': clientId,
//             'Authorization': `Bearer ${access_token}`
//         },
//         params: {
//             user_login: 'dyrka9'
//         }
//     });
//
//     return streamResponse.data.data.length > 0;
// }

// Обработчик команды /start
bot.start((ctx) => {
    ctx.reply(`Привет! Это бот для уведомлений о стримах на канале [${streamer}](${link}).`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Проверить стрим', callback_data: 'check_stream' }]
            ]
        }
    });
});

// // Обработчик нажатия кнопки
// bot.on('callback_query', async (ctx) => {
//     ctx.reply('callback_query');
//     if (ctx.callbackQuery.data === 'check_stream') {
//         ctx.reply('callback_query.data === check_stream');
//         const isStreaming = await checkStreamStatus(ctx);
//         if (isStreaming) {
//             ctx.reply('Стрим у стримера dyrka9 идет!');
//         } else {
//             ctx.reply('У стримера dyrka9 стрима нет.');
//         }
//     }
// });

// Запуск бота
bot.launch();


// Обработка завершения работы
process.once('SIGINT', () => bot.launch());
process.once('SIGTERM', () => bot.launch());