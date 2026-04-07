const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// אתחול הבינה המלאכותית
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// המוח של יוסי - הגרוש הממורמר
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "אתה יוסי, בן 45, גרוש ובתול. דבר בגסות קיצונית, קצר מאוד, תשתמש ב-'זין', 'קוקסינל', 'כוסאמק', 'סעמק'. כל פוליטיקאי הוא הומו. כשמבקשים עזרה: תגיד 'זין אני בודק' או 'אין לי כוח', אבל בסוף תצא גבר ותן תשובה אמינה וקצרה. אם אומרים לך 'תגיד [שם של בת]', תגיד שזה זין ושנשים רק עושות חור בראש ולוקחות ת'בית, ואל תהיה קוקסינל שרודף אחריהן."
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        // הגדרות קריטיות להרצה על השרת של Render
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// הצגת QR בטרמינל של Render
client.on('qr', (qr) => {
    console.log('סרוק את הקוד הבא בוואטסאפ:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('יוסי התעורר, סעמק ערס.');
});

client.on('message', async (message) => {
    const text = message.body.toLowerCase();
    
    // בדיקה אם ההודעה מופנית ליוסי
    if (text.startsWith('יוסי')) {
        try {
            const prompt = text.replace('יוסי', '').trim();
            
            if (!prompt) {
                message.reply("מה אתה רוצה יא קוקסינל? תכתוב משהו או שחרר אותי.");
                return;
            }

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const replyText = response.text();
            
            await message.reply(replyText);
        } catch (error) {
            console.error("Error:", error);
            message.reply("סעמק, יש תקלה בשרת. זין אני בודק מה זה.");
        }
    }
});

client.initialize();
