const { Telegraf } = require('telegraf');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.TG_API);

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

const streamer = process.env.STREAMER;
const link = `https://www.twitch.com/${streamer}`;
const twClient = process.env.TW_CLIENT;
const twToken = `Bearer ${process.env.TW_TOKEN}`;

let online = false;
let subscribers = readSubs();

bot.start((ctx) => {
    ctx.reply(`Привет! Это бот для уведомлений о стримах на канале [${streamer}](${link}).`, {
        parse_mode: 'Markdown',
        reply_markup: keyboard.reply_markup,
    }); 
});

// bot.hears(buttonSubscribe.text, (ctx) => {
//     if (addToSubs(ctx.chat.id.toString())) {
//         ctx.reply('Вы успешно подписались.', { reply_markup: keyboard.reply_markup });
//     } else {
//         ctx.reply('Вы уже подписаны.', { reply_markup: keyboard.reply_markup });
//     }
// });
//
// bot.hears(buttonUnsubscribe.text, (ctx) => {
//     if (remFromSubs(ctx.chat.id.toString())) {
//         ctx.reply('Вы успешно отписались.', { reply_markup: keyboard.reply_markup });
//     } else {
//         ctx.reply('Вы не были подписаны.', { reply_markup: keyboard.reply_markup });
//     }
// });
//
// bot.hears(buttonInfo.text, (ctx) => {
//     if (subscribers.includes(ctx.chat.id.toString())) {
//         ctx.reply(`Поскольку вы подписаны на уведомления, вы будете получать сообщения когда [${streamer}](${link}) запускает стрим.`, {
//             parse_mode: 'Markdown',
//             reply_markup: keyboard.reply_markup,
//         });
//     } else {
//         ctx.reply(`Если вы хотите получать уведомления о стримах [${streamer}](${link}), подпишитесь на них. В противном случае, вы не будете получать сообщения о запуске стрима.`, {
//             parse_mode: 'Markdown',
//             reply_markup: keyboard.reply_markup,
//         });
//     }
// });
//
// bot.on('text', (ctx) => {
//     ctx.reply("Извините, я вас не понял, используйте кнопки.", { reply_markup: keyboard.reply_markup });
// });
//
// function readSubs() {
//     if (fs.existsSync('subscribers.json')) {
//         return JSON.parse(fs.readFileSync('subscribers.json', 'utf8'));
//     }
//     return [];
// }
//
// function addToSubs(chatId) {
//     if (!subscribers.includes(chatId)) {
//         subscribers.push(chatId);
//         fs.writeFileSync('subscribers.json', JSON.stringify(subscribers));
//         return true;
//     }
//     return false;
// }
//
// function remFromSubs(chatId) {
//     const index = subscribers.indexOf(chatId);
//     if (index > -1) {
//         subscribers.splice(index, 1);
//         fs.writeFileSync('subscribers.json', JSON.stringify(subscribers));
//         return true;
//     }
//     return false;
// }
//
// async function checkStreamStatus() {
//     try {
//         const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamer}`, {
//             headers: {
//                 'Client-ID': twClient,
//                 'Authorization': twToken,
//             },
//         });
//         if (response.data.data.length > 0 && !online) {
//             const streamTitle = response.data.data[0].title;
//             for (const chatId of subscribers) {
//                 bot.telegram.sendMessage(chatId, `${streamer} запустил стрим!\n${streamTitle}\n\n${link}`);
//             }
//             online = true;
//         } else if (response.data.data.length === 0) {
//             online = false;
//         }
//     } catch (error) {
//         console.error("Error checking stream status:", error);
//     }
// }
//
// setInterval(checkStreamStatus, online ? 1800000 : 60000);

bot.launch();
