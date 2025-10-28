const { Telegraf } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Initialize the Telegraf bot
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Twitch API credentials
const twitchClientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
const twitchSecret = '69cb9r990pkkiqse2po5dy40ttw2zk';
const userStream = 'dyrka9';

// File to store the stream status
const statusFilePath = path.join(__dirname, 'StreamTwitch_01Bot.txt');

// Function to check if the Twitch stream is online
async function isTwitchOnline() {
    try {
        // Get OAuth Token
        const tokenResponse = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
            params: {
                client_id: twitchClientId,
                client_secret: twitchSecret,
                grant_type: 'client_credentials'
            }
        });
        const oauthToken = tokenResponse.data.access_token;

        // Check stream status
        const streamResponse = await axios.get(`https://api.twitch.tv/helix/streams`, {
            headers: {
                'Authorization': `Bearer ${oauthToken}`,
                'Client-Id': twitchClientId
            },
            params: {
                user_login: userStream
            }
        });

        // Read the last known status
        let streamStatus = 'FALSE';
        if (fs.existsSync(statusFilePath)) {
            streamStatus = fs.readFileSync(statusFilePath, 'utf-8');
        } else {
            fs.writeFileSync(statusFilePath, "FALSE");
        }

        // Determine if the stream is online/offline and send notifications
        if (streamResponse.data.data.length > 0 && streamStatus === 'FALSE') {
            const message = `Stream of: [${userStream}](https://www.twitch.tv/${userStream}) is online.`;
            await telegramBotSendText(message);
            fs.writeFileSync(statusFilePath, "TRUE");
        } else if (streamResponse.data.data.length === 0 && streamStatus === 'TRUE') {
            const message = `${userStream.toUpperCase()} is offline`;
            await telegramBotSendText(message);
            fs.writeFileSync(statusFilePath, "FALSE");
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to send messages to Telegram
async function telegramBotSendText(message) {
    const botToken = process.env.TELEGRAM_TOKEN; // Add your bot token to the environment
    const chatId = '-1003193304359'; // Chat ID

    const sendTextUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(sendTextUrl, {
        chat_id: chatId,
        parse_mode: 'Markdown',
        text: message
    });
}

// Function to repeatedly check stream status every 30 seconds
function startMonitoring() {
    isTwitchOnline();
    setInterval(isTwitchOnline, 30000); // Check every 30 seconds
}

// Start monitoring when the bot is launched
bot.start((ctx) => {
    ctx.reply('Twitch Stream Monitor is running...');
    startMonitoring();
});

// Launch the bot
bot.launch();