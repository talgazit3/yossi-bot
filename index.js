const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// אתחול הבינה המלאכותית של גוגל
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// הגדרת המוח של יוסי - גרוש, בתול ועצבני
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

// יצירת קוד QR לסריקה ב-Logs של Render
client.on('qr', (qr) => {
    console.log('סרוק את הקוד הבא בוואטסאפ:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('יוסי המלך מוכן לעבודה! (או שלא, סעמק)');
});

client.on('message', async (message) => {
    const text = message.body.toLowerCase();
    
    // יוסי עונה רק אם ההודעה מתחילה במילה "יוסי"
    if (text.startsWith('יוסי')) {
        try {
            const prompt = text.replace('יוסי', '').trim
