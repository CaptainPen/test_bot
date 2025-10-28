const { Telegraf } = require('telegraf');

// Замените 'YOUR_TELEGRAM_BOT_TOKEN' на токен вашего бота
const bot = new Telegraf(process.env.BOT_API_KEY);

async function checkStreamStatus() {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    // Сначала получим токен для доступа к API Twitch
    const authResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
        }
    });

    const { access_token } = authResponse.data;

    // Проверим статус стрима
    const streamResponse = await axios.get('https://api.twitch.tv/helix/streams', {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${access_token}`
        },
        params: { 
            user_login: 'dyrka9'
        }
    });

    return streamResponse.data.data.length > 0;
}

bot.start(async (ctx) => {
    const isStreaming = await checkStreamStatus();
    if (isStreaming) {
        ctx.reply('Стрим у стримера dyrka9 идет!');
    } else {
        ctx.reply('У стримера dyrka9 стрима нет.');
    }
});

bot.launch();

// Обработка завершения работы
process.once('SIGINT', () => bot.launch());
process.once('SIGTERM', () => bot.launch());