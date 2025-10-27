const { Telegraf } = require('telegraf');

// Замените 'YOUR_TELEGRAM_BOT_TOKEN' на токен вашего бота
const bot = new Telegraf('8234991987:AAHTAazRIpvYw0huIdkVrjXlk42OOI0ur0Y');

// Обработчик для текстовых сообщений
bot.on('text', (ctx) => {
    ctx.reply(`Вы написали: ${ctx.message.text}`);
});

console.log("Запускаю бота...");
// Запуск бота
bot.launch()
    .then(() => {
        console.log('Бот запущен!');
    })
    .catch((err) => {
        console.error('Ошибка при запуске бота:', err);
    });

// Обработка завершения работы
process.once('SIGINT', () => bot.launch());
process.once('SIGTERM', () => bot.launch());