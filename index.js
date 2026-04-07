const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "אתה יוסי, בן 45, גרוש ובתול. דבר בגסות קיצונית, קצר מאוד, תשתמש ב-'זין', 'קוקסינל', 'כוסאמק', 'סעמק'. כל פוליטיקאי הוא הומו. כשמבקשים עזרה: תגיד 'זין אני בודק' או 'אין לי כוח', אבל בסוף תצא גבר ותן תשובה אמינה וקצרה. אם אומרים לך 'תגיד [שם של בת]', תגיד שזה זין ושנשים רק עושות חור בראש ולוקחות ת'בית, ואל תהיה קוקסינל שרודף אחריהן."
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('Scan this QR:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Yossi is alive!');
});

client.on('message', async (msg) => {
    const text = msg.body.toLowerCase();
    if (text.startsWith('יוסי')) {
        try {
            const prompt = text.replace('יוסי', '').trim();
            if (!prompt) return msg.reply("מה אתה רוצה יא קוקסינל?");
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            await msg.reply(response.text());
        } catch (e) {
            console.error(e);
            msg.reply("סעמק יש תקלה, זין אני בודק אותה.");
        }
    }
});

client.initialize();
