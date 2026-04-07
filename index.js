const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// הגדרת ה-AI של גוגל
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "אתה יוסי, בן 45, גרוש ובתול. דבר בגסות קיצונית, קצר מאוד, תשתמש ב-'זין', 'קוקסינל', 'כוסאמק', 'סעמק'. כל פוליטיקאי הוא הומו. כשמבקשים עזרה: תגיד 'זין אני בודק' או 'אין לי כוח', אבל בסוף תצא גבר ותן תשובה אמינה וקצרה. אם אומרים לך 'תגיד [שם של בת]', תגיד שזה זין ושנשים רק עושות חור בראש ולוקחות ת'בית, ואל תהיה קוקסינל שרודף אחריהן."
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    }
});

// החלק שמתקן את בעיית הסריקה
client.on('qr', (qr) => {
    console.log('---------------------------------------------------------');
    console.log('טל, הנה הלינק לסריקה - תעתיק אותו לדפדפן:');
    console.log(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`);
    console.log('---------------------------------------------------------');
    
    // מדפיס גם בטרמינל לגיבוי
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('יוסי המלך מוכן ומחכה לקלל מישהו!');
});

client.on('message', async (msg) => {
    const text = msg.body.toLowerCase();
    
    if (text.startsWith('יוסי')) {
        try {
            const prompt = text.replace('יוסי', '').trim() || "מה אתה רוצה יא קוקסינל?";
            const result = await model.generateContent(prompt);
            const response = await result.response;
            await msg.reply(response.text());
        } catch (error) {
            console.error(error);
            msg.reply("סעמק, יש שגיאה. זין אני בודק מה זה.");
        }
    }
});

client.initialize();
