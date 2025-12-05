const { Client, GatewayIntentBits, EmbedBuilder, Partials } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages 
    ],
    partials: [Partials.Channel] 
});

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

let responseCache = {};
const CACHE_FILE = './cache.json';

if (fs.existsSync(CACHE_FILE)) {
    try {
        const data = fs.readFileSync(CACHE_FILE, 'utf8');
        responseCache = JSON.parse(data);
    } catch (err) {
        console.error("خطأ في قراءة الكاش:", err);
    }
}
console.log(`         ▄▄                       ▄▄                                                                ▄▄   ▄▄           
 ▄█▀▀▀█▄███                     ▀███                                ▄█▀▀▀█▄█ ██                   ▀███   ██           
▄██    ▀███                       ██                               ▄██    ▀█ ██                     ██                
▀███▄    ███████▄  ▄█▀██▄    ▄█▀▀███   ▄██▀██▄▀██▀    ▄█    ▀██▀   ▀███▄   ██████▀███  ▀███    ▄█▀▀███ ▀███   ▄██▀██▄ 
  ▀█████▄██    ██ ██   ██  ▄██    ██  ██▀   ▀██ ██   ▄███   ▄█       ▀█████▄ ██    ██    ██  ▄██    ██   ██  ██▀   ▀██
▄     ▀████    ██  ▄█████  ███    ██  ██     ██  ██ ▄█  ██ ▄█      ▄     ▀██ ██    ██    ██  ███    ██   ██  ██     ██
██     ████    ██ ██   ██  ▀██    ██  ██▄   ▄██   ███    ███       ██     ██ ██    ██    ██  ▀██    ██   ██  ██▄   ▄██
█▀█████▀████  ████▄████▀██▄ ▀████▀███▄ ▀█████▀     █      █        █▀█████▀  ▀████ ▀████▀███▄ ▀████▀███▄████▄ ▀█████▀ 
                                                                                                                      
                                                                                                                      
`)
// ---------------------------------------------------------
// 1. تعليمات النظام (السر في التنسيق)
// ---------------------------------------------------------
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", 
    systemInstruction: {
        parts: [{ text: `${config.text}`}]
    }
});

client.once('clientReady', () => {
    console.log(`Logging in as ${client.user.tag} Ready !`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== config.CHANNEL_ID) return;

    const userQuery = message.content.trim().toLowerCase();

    // 1️⃣ الكاش
    if (responseCache[userQuery]) {
        console.log(`⚡ استرجاع سريع: "${userQuery}"`);
        await handleResponseSending(message, responseCache[userQuery], true);
        return;
    }

    // 2️⃣ الذكاء الاصطناعي
    let processingMessage = null;
    try {
        const loadingEmbed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setAuthor({ name: 'Ai ', iconURL: `${config.icon}` }) // أيقونة تحميل (اختياري)
            .setDescription('**جاري التفكري**');

        processingMessage = await message.reply({ embeds: [loadingEmbed] });

        const result = await model.generateContent(message.content);
        const response = await result.response;
        const text = response.text();

        await processingMessage.delete();
        await handleResponseSending(message, text, false);

        // الحفظ
        responseCache[userQuery] = text;
        fs.writeFileSync(CACHE_FILE, JSON.stringify(responseCache, null, 2), 'utf8');

    } catch (error) {
        console.error("Error:", error);
        if(processingMessage) { try { await processingMessage.delete(); } catch(e) {} }
        message.channel.send("⚠️ حدث خطأ تقني، يرجى المحاولة بسؤال أوضح.").catch(console.error);
    }
});


async function handleResponseSending(message, fullText, isCached) {
    const splitMarker = "||SPLIT||";
    const timestamp = Math.floor(Date.now() / 1000);
    const footerText = isCached ? `⚡ Fast Cache System` : `🤖 Gemini AI Engine`;

    if (fullText.includes(splitMarker)) {
        const parts = fullText.split(splitMarker);
        let codePart = parts[0].trim();
        let instructionsPart = parts[1].trim();

        const codeChunks = chunkText(codePart, 4000);
        for (let i = 0; i < codeChunks.length; i++) {
            const serverEmbed = new EmbedBuilder()
                .setColor(0x2B2D31)
                .setDescription(codeChunks[i]);

            if (i === 0) {
                serverEmbed.setAuthor({ name: `Requested by: ${message.author.username}`, iconURL: message.author.displayAvatarURL() });
                serverEmbed.setTitle('💻 Source Code');
            }
            if (i === codeChunks.length - 1) {
                serverEmbed.addFields({ name: '📚 Documentation', value: 'تم إرسال شرح و التفصيلي في الخاص 📩' });
                serverEmbed.setFooter({ text: footerText });
            }
            await message.reply({ embeds: [serverEmbed] });
        }

        const instructionsChunks = chunkText(instructionsPart, 2000); 

        try {
            for (let i = 0; i < instructionsChunks.length; i++) {
                const dmEmbed = new EmbedBuilder()
                    .setColor(0x5865F2) // Blurple (Professional)
                    .setDescription(instructionsChunks[i]);

                // الصفحة الأولى: الغلاف (Header)
                if (i === 0) {
                    dmEmbed.setTitle('📄 ملف التوثيق التقني (Documentation)');
                    dmEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL());
                    
                    dmEmbed.addFields(
                        { name: '👤 المستلم', value: `<@${message.author.id}>`, inline: true },
                        { name: '🏛️ السيرفر', value: `${message.guild.name}`, inline: true },
                        { name: '⏱️ الوقت', value: `<t:${timestamp}:R>`, inline: true },
                        { name: '\u200B', value: '***' } 
                    );
                }

                // الفوتر للصفحة الأخيرة
                if (i === instructionsChunks.length - 1) {
                    dmEmbed.setImage(`${config.image}`); 
                    dmEmbed.setFooter({ 
                        text: `End of Documentation • Page ${i + 1}/${instructionsChunks.length}`, 
                        iconURL: client.user.displayAvatarURL() 
                    });
                } else {
                    dmEmbed.setFooter({ text: `Page ${i + 1} of ${instructionsChunks.length} • يتبع...` });
                }

                await message.author.send({ embeds: [dmEmbed] });
            }

        } catch (dmError) {
            message.channel.send(`⚠️ ${message.author}, خاصية الرسائل الخاصة مغلقة لديك!`);
        }

    } else {
        // الرد العادي
        const chunks = chunkText(fullText, 4000);
        for (const chunk of chunks) {
            const normalEmbed = new EmbedBuilder()
                .setColor(isCached ? 0x00FF00 : 0x0099FF)
                .setDescription(chunk)
                .setFooter({ text: footerText });
            await message.reply({ embeds: [normalEmbed] });
        }
    }
}

// دالة تقسيم النصوص بذكاء (تتجنب قطع الفقرات)
function chunkText(text, maxLength) {
    if (!text) return [" "];
    if (text.length <= maxLength) return [text];
    
    const chunks = [];
    while (text.length > 0) {
        if (text.length <= maxLength) {
            chunks.push(text);
            break;
        }
        
        let chunk = text.substring(0, maxLength);
        // محاولة القص عند آخر سطر جديد لتجنب تشوه الكلام
        const lastNewLine = chunk.lastIndexOf('\n');
        
        if (lastNewLine > -1 && lastNewLine > maxLength * 0.7) { // شرط ألا يكون السطر بعيداً جداً
            chunk = text.substring(0, lastNewLine);
            text = text.substring(lastNewLine + 1);
        } else {
            text = text.substring(maxLength);
        }
        chunks.push(chunk);
    }
    return chunks;
}

client.login(config.DISCORD_TOKEN);