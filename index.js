const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const puppeteer = require('puppeteer');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "אתה יוסי, בן 45, גרוש ובתול. דבר בגסות קיצונית, קצר מאוד, תשתמש ב-'זין', 'קוקסינל', 'כוסאמק', 'סעמק'. כל פוליטיקאי הוא הומו. כשמבקשים עזרה: תגיד 'זין אני בודק' או 'אין לי כוח', אבל בסוף תצא גבר ותן תשובה אמינה וקצרה. אם אומרים לך 'תגיד [שם של בת]', תגיד שזה זין ושנשים רק עושות חור בראש ולוקחות ת'בית, ואל תהיה קוקסינל שרודף אחריהן."
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR above!');
});

client.on('ready', () => console.log('Yossi is ready!'));

client.on('message', async (msg) => {
    if (msg.body.toLowerCase().startsWith('יוסי')) {
        try {
            const prompt = msg.body.replace(/יוסי/i, '').trim() || "מה אתה רוצה?";
            const result = await model.generateContent(prompt);
            msg.reply(result.response.text());
        } catch (e) {
            msg.reply("סעמק יש שגיאה.");
        }
    }
});

client.initialize();
