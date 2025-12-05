const config = require('./config.json');

async function listMyModels() {
    const apiKey = config.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log("Connecting to Google servers...");

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("No models available for this API key.");
            console.error(data.error.message);
            return;
        }

        if (!data.models) {
            console.log("");
            return;
        }

        console.log("\n✅ The available models for this API key:");
        console.log("============================================");
        
        // تصفية الموديلات لعرض التي تدعم الكتابة فقط (generateContent)
        const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));

        chatModels.forEach(model => {
            // نقوم بإزالة 'models/' من بداية الاسم ليسهل عليك نسخه
            const cleanName = model.name.replace('models/', '');
            console.log(`🔹 ${cleanName}`);
        });

        console.log("============================================");
        console.log("Copy one of the names above and paste it in index.js");

    } catch (error) {
        console.error("Error connecting to Google servers:", error);
    }
}

listMyModels();