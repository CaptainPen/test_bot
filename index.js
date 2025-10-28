import fetch from "node-fetch";
import { Telegraf, Markup } from "telegraf";

// 🔹 Вставь токен своего Telegram-бота
const BOT_TOKEN = "8234991987:AAHTAazRIpvYw0huIdkVrjXlk42OOI0ur0Y";
const bot = new Telegraf(BOT_TOKEN);

// 🔍 Функция проверки стрима
// async function isStreamLive() {
//     try {
//         const res = await fetch("https://www.twitch.tv/dyrka9");
//         const html = await res.text();
//         return html.includes('"isLiveBroadcast":true');
//     } catch (err) {
//         console.error("Ошибка при проверке:", err.message);
//         return null;
//     }
// } 

// 🟢 Команда /start
bot.start((ctx) => {
    ctx.reply(
        "Привет! 👋\nХочешь узнать, идёт ли сейчас стрим у dyrka9?",
        Markup.inlineKeyboard([
            [Markup.button.callback("🎥 Проверить стрим", "check_stream")],
        ])
    );
});

// 🎯 Обработка нажатия кнопки
// bot.action("check_stream", async (ctx) => {
//     await ctx.answerCbQuery(); // убираем “loading” у кнопки
//     const live = await isStreamLive();
//
//     if (live === null) {
//         await ctx.reply("⚠️ Не удалось проверить статус стрима. Попробуй позже.");
//     } else if (live) {
//         await ctx.reply("✅ Сейчас идёт стрим! https://twitch.tv/dyrka9");
//     } else {
//         await ctx.reply("❌ Стрим сейчас не идёт.");
//     }
// });

// 🚀 Запуск бота
bot.launch();
console.log("Бот запущен и ждёт команду /start");