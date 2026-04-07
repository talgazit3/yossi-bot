const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// המפתח שלך (מומלץ בעתיד להעביר ל-Environment Variable)
const genAI = new GoogleGenerativeAI("AIzaSyDDSnDOQPagmDIn_9QdJU8BApPsaSRsAa4");
const model = genAI.getGenerativeModel({ 
    model: "gemini-pro"
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('סרוק את הקוד כדי להפעיל את יוסי:');
});

client.on('ready', () => {
    console.log('יוסי מחובר!');
});

client.on('message', async (msg) => {
    // יוסי יגיב לכל הודעה שמתחילה ב"יוסי"
    if (msg.body.toLowerCase().startsWith('יוסי')) {
        const userText = msg.body.replace(/יוסי/i, '').trim();
        try {
            const result = await model.generateContent("אתה יוסי, עוזר אישי מצחיק וחכם בוואטסאפ. תענה על זה: " + userText);
            const response = await result.response;
            msg.reply(response.text());
        } catch (e) {
            msg.reply("אחי, יש לי תקלה קטנה במוח. תנסה שוב?");
        }
    }
});

client.initialize();
